#!/usr/bin/env bash
set -Eeuo pipefail

# 目标主机地址（SSH）。
DEPLOY_HOST="${DEPLOY_HOST:-192.168.5.239}"
# 远端部署目录，必须是安全且非系统目录。
DEPLOY_PATH="${DEPLOY_PATH:-/home/react-project/teapot-web}"
# 远端登录用户名（SSH）。
DEPLOY_USER="${DEPLOY_USER:-root}"
# SSH 密码（用于 sshpass），留空则使用交互式或密钥登录。
DEPLOY_PASS="${DEPLOY_PASS:-ruijing1}"
# 认证模式：sshpass（默认）、interactive（交互式）、auto（自动）。
DEPLOY_AUTH_MODE="${DEPLOY_AUTH_MODE:-sshpass}"
# SSH 连接超时时间（秒）。
DEPLOY_CONNECT_TIMEOUT="${DEPLOY_CONNECT_TIMEOUT:-10}"
# 首次连接新主机时自动写入 known_hosts；如需更严格校验可改为 yes。
DEPLOY_STRICT_HOST_KEY_CHECKING="${DEPLOY_STRICT_HOST_KEY_CHECKING:-accept-new}"
# 设为 1 允许上传前清空远端目录；设为 0 则跳过清空。
DEPLOY_ALLOW_DELETE="${DEPLOY_ALLOW_DELETE:-1}"
# 设为 1 仅打印命令不执行（演练模式）；设为 0 正常执行。
DEPLOY_DRY_RUN="${DEPLOY_DRY_RUN:-0}"
# 设为 1 启用远端备份；设为 0 不备份。
DEPLOY_BACKUP="${DEPLOY_BACKUP:-1}"
# 远端备份目录（需 DEPLOY_BACKUP=1 生效），默认在部署目录下生成 old_version。
DEPLOY_BACKUP_DIR="${DEPLOY_BACKUP_DIR:-${DEPLOY_PATH}/old_version}"
# 设为 1 则自动创建远端部署目录；设为 0 则不创建。
DEPLOY_CREATE_PATH="${DEPLOY_CREATE_PATH:-1}"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

log_err() {
  printf '[%s] ERROR: %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" >&2
}

CURRENT_COMMAND_DISPLAY=""

format_cmd() {
  local parts=()
  local redact_next=0
  local arg quoted

  for arg in "$@"; do
    if [[ "${redact_next}" == "1" ]]; then
      parts+=("'******'")
      redact_next=0
      continue
    fi

    if [[ "${arg}" == "-p" ]]; then
      parts+=("-p")
      redact_next=1
      continue
    fi

    printf -v quoted '%q' "${arg}"
    parts+=("${quoted}")
  done

  printf '%s' "${parts[*]}"
}

on_err() {
  local exit_code="$1"
  local line_no="$2"

  if [[ -n "${CURRENT_COMMAND_DISPLAY}" ]]; then
    log_err "Command failed (exit=${exit_code}, line=${line_no}): ${CURRENT_COMMAND_DISPLAY}"
  else
    log_err "Command failed (exit=${exit_code}, line=${line_no}): ${BASH_COMMAND}"
  fi
}

trap 'on_err "$?" "$LINENO"' ERR

run() {
  local cmd_display
  cmd_display="$(format_cmd "$@")"

  if [[ "${DEPLOY_DRY_RUN}" == "1" ]]; then
    log "DRY RUN: ${cmd_display}"
    return 0
  fi

  log "Running: ${cmd_display}"
  CURRENT_COMMAND_DISPLAY="${cmd_display}"
  "$@"
  CURRENT_COMMAND_DISPLAY=""
}

# 保护：禁止空路径或危险路径。
if [[ -z "${DEPLOY_PATH}" ]]; then
  log_err "DEPLOY_PATH is empty."
  exit 1
fi

case "${DEPLOY_PATH}" in
  "/"|"/home"|"/root"|"."|".."|"/home/"|"/root/")
    log_err "DEPLOY_PATH '${DEPLOY_PATH}' is not allowed."
    exit 1
    ;;
esac

log "Step 1/5: Preparing SSH commands"
log "Deploy target: ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

ssh_options=(
  -o "StrictHostKeyChecking=${DEPLOY_STRICT_HOST_KEY_CHECKING}"
  -o "ConnectTimeout=${DEPLOY_CONNECT_TIMEOUT}"
  -o "ServerAliveInterval=30"
  -o "ServerAliveCountMax=3"
)
ssh_cmd=(ssh "${ssh_options[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}")
scp_cmd=(scp "${ssh_options[@]}" -r dist/. "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/")

auth_mode="${DEPLOY_AUTH_MODE}"
if [[ "${auth_mode}" == "auto" ]]; then
  if [[ -n "${DEPLOY_PASS}" ]]; then
    auth_mode="sshpass"
  else
    auth_mode="interactive"
  fi
fi

case "${auth_mode}" in
  sshpass)
    if [[ -z "${DEPLOY_PASS}" ]]; then
      log_err "DEPLOY_PASS is empty but DEPLOY_AUTH_MODE=sshpass."
      exit 1
    fi
    if ! command -v sshpass >/dev/null 2>&1; then
      log_err "sshpass not found. Install it or set DEPLOY_AUTH_MODE=interactive."
      exit 1
    fi
    log "Using sshpass for non-interactive login"
    ssh_cmd=(sshpass -p "${DEPLOY_PASS}" ssh "${ssh_options[@]}" "${DEPLOY_USER}@${DEPLOY_HOST}")
    scp_cmd=(sshpass -p "${DEPLOY_PASS}" scp "${ssh_options[@]}" -r dist/. "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/")
    ;;
  interactive)
    log "Using interactive SSH login"
    ;;
  *)
    log_err "DEPLOY_AUTH_MODE must be 'sshpass', 'interactive', or 'auto'."
    exit 1
    ;;
esac

log "Step 2/5: Verifying remote SSH connectivity"
run "${ssh_cmd[@]}" "printf 'remote ssh ok\n'"

log "Step 3/5: Building project (mode=test)"
npm run build:test

if [[ ! -d "dist" ]]; then
  log_err "dist/ not found after build."
  exit 1
fi

log "Step 4/5: Preparing remote directory"
remote_prepare=()
if [[ "${DEPLOY_CREATE_PATH}" == "1" ]]; then
  # 确保远端部署目录存在。
  remote_prepare+=("mkdir -p '${DEPLOY_PATH}'")
fi
if [[ "${DEPLOY_BACKUP}" == "1" && -n "${DEPLOY_BACKUP_DIR}" ]]; then
  # 备份远端当前内容（空目录不报错）。
  ts="$(date '+%Y%m%d_%H%M%S')"
  remote_prepare+=("mkdir -p '${DEPLOY_BACKUP_DIR}'")
  if [[ "${DEPLOY_BACKUP_DIR}" == "${DEPLOY_PATH}/"* ]]; then
    backup_exclude_path="${DEPLOY_BACKUP_DIR#${DEPLOY_PATH}/}"
    remote_prepare+=("tar --exclude='./${backup_exclude_path}' -czf '${DEPLOY_BACKUP_DIR}/dist_${ts}.tgz' -C '${DEPLOY_PATH}' . || true")
  else
    remote_prepare+=("tar -czf '${DEPLOY_BACKUP_DIR}/dist_${ts}.tgz' -C '${DEPLOY_PATH}' . || true")
  fi
  # 仅保留最新 5 个备份，删除更早版本。
  remote_prepare+=("ls -1t '${DEPLOY_BACKUP_DIR}'/*.tgz 2>/dev/null | tail -n +6 | xargs -r rm -f")
fi
if [[ "${#remote_prepare[@]}" -gt 0 ]]; then
  run "${ssh_cmd[@]}" "$(printf '%s && ' "${remote_prepare[@]}") true"
fi

if [[ "${DEPLOY_ALLOW_DELETE}" == "1" ]]; then
  # 仅在显式允许时清空远端文件，保留备份目录。
  if [[ "${DEPLOY_BACKUP}" == "1" && "${DEPLOY_BACKUP_DIR}" == "${DEPLOY_PATH}/"* ]]; then
    run "${ssh_cmd[@]}" "find '${DEPLOY_PATH}' -mindepth 1 -maxdepth 1 ! -path '${DEPLOY_BACKUP_DIR}' -exec rm -rf {} +"
  else
    run "${ssh_cmd[@]}" "rm -rf '${DEPLOY_PATH}'/*"
  fi
else
  log "Skipping remote cleanup (set DEPLOY_ALLOW_DELETE=1 to enable)"
fi

log "Step 5/5: Uploading dist/ to remote"
run "${scp_cmd[@]}"
log "Deploy complete"
