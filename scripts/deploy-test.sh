#!/usr/bin/env bash
set -euo pipefail

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

run() {
  if [[ "${DEPLOY_DRY_RUN}" == "1" ]]; then
    log "DRY RUN: $*"
    return 0
  fi
  "$@"
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

log "Step 1/4: Building project (mode=test)"
npm run build:test

if [[ ! -d "dist" ]]; then
  log_err "dist/ not found after build."
  exit 1
fi

log "Step 2/4: Preparing SSH commands"
log "Deploy target: ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

ssh_cmd=(ssh "${DEPLOY_USER}@${DEPLOY_HOST}")
scp_cmd=(scp -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/")

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
    log "Step 3/4: Using sshpass for non-interactive login"
    ssh_cmd=(sshpass -p "${DEPLOY_PASS}" ssh "${DEPLOY_USER}@${DEPLOY_HOST}")
    scp_cmd=(sshpass -p "${DEPLOY_PASS}" scp -r dist/* "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/")
    ;;
  interactive)
    log "Step 3/4: Using interactive SSH login"
    ;;
  *)
    log_err "DEPLOY_AUTH_MODE must be 'sshpass', 'interactive', or 'auto'."
    exit 1
    ;;
esac

log "Step 4/4: Cleaning remote directory and uploading"
remote_prepare=()
if [[ "${DEPLOY_CREATE_PATH}" == "1" ]]; then
  # 确保远端部署目录存在。
  remote_prepare+=("mkdir -p '${DEPLOY_PATH}'")
fi
if [[ "${DEPLOY_BACKUP}" == "1" && -n "${DEPLOY_BACKUP_DIR}" ]]; then
  # 备份远端当前内容（空目录不报错）。
  ts="$(date '+%Y%m%d_%H%M%S')"
  remote_prepare+=("mkdir -p '${DEPLOY_BACKUP_DIR}'")
  remote_prepare+=("tar -czf '${DEPLOY_BACKUP_DIR}/dist_${ts}.tgz' -C '${DEPLOY_PATH}' . || true")
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
log "Uploading dist/ to remote"
run "${scp_cmd[@]}"
log "Deploy complete"
