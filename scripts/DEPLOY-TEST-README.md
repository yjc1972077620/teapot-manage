# deploy-test.sh 使用说明

本脚本用于将本地 `dist/` 构建产物部署到测试环境。

## 使用前提

- 本地可执行 `npm run build:test` 且生成 `dist/`
- 目标机器可通过 SSH 访问
- 目标路径有写入权限

## 基本用法

在项目根目录执行：

```bash
npm run deploy:test
```

或先设置环境变量后执行：

```bash
DEPLOY_HOST=192.168.4.239 \
DEPLOY_USER=react \
DEPLOY_PATH=/home/react-project/teapot-web \
npm run deploy:test
```

## 配置项说明

| 变量名 | 默认值 | 说明 |
| --- | --- | --- |
| `DEPLOY_HOST` | `192.168.4.239` | 目标主机地址 |
| `DEPLOY_USER` | 本机 `$USER` | 登录用户名 |
| `DEPLOY_PATH` | `/home/react-project/teapot-web` | 目标部署目录 |
| `DEPLOY_PASS` | 空 | SSH 密码（仅在 `DEPLOY_AUTH_MODE=sshpass` 时使用） |
| `DEPLOY_AUTH_MODE` | `sshpass` | 认证模式：`sshpass`、`interactive` 或 `auto` |
| `DEPLOY_ALLOW_DELETE` | `0` | 是否允许清空远端目录（`1` 才会执行 `rm -rf`） |
| `DEPLOY_DRY_RUN` | `0` | 仅打印命令不执行（`1` 开启） |
| `DEPLOY_BACKUP` | `1` | 是否启用远端备份（`1` 启用，`0` 关闭） |
| `DEPLOY_BACKUP_DIR` | `${DEPLOY_PATH}/old_version` | 远端备份目录（需 `DEPLOY_BACKUP=1` 生效） |
| `DEPLOY_CREATE_PATH` | `1` | 是否自动创建部署目录（`1` 创建） |

## SSH 用户名/密码如何配置

- 用户名：通过 `DEPLOY_USER` 设置，默认使用本机 `$USER`
- 认证模式：通过 `DEPLOY_AUTH_MODE` 设置，默认 `sshpass`
- 密码：通过 `DEPLOY_PASS` 设置，`DEPLOY_AUTH_MODE=sshpass` 时才使用
  - 需要本机已安装 `sshpass`
  - 想用交互式登录时设置 `DEPLOY_AUTH_MODE=interactive`
- 推荐：配置 SSH 密钥并使用 `DEPLOY_AUTH_MODE=interactive`

## 配置示例

使用环境变量运行（推荐）：  

```bash
DEPLOY_HOST=${YOUR_HOST} \
DEPLOY_USER=react \
DEPLOY_PATH=/home/react-project/teapot-web \
DEPLOY_ALLOW_DELETE=1 \
DEPLOY_BACKUP_DIR=/home/react-project/backup \
npm run deploy:test
```

使用密码免交互（需要 `sshpass`）：  

```bash
DEPLOY_USER=react \
DEPLOY_PASS=your_password \
DEPLOY_AUTH_MODE=sshpass \
npm run deploy:test
```

## 不同配置组合示例

- 仅构建并上传（不清空、不备份）：  

```bash
npm run deploy:test
```

- 开启远端清空（先删再传）：  

```bash
DEPLOY_ALLOW_DELETE=1 npm run deploy:test
```

- 先备份再部署（不会清空，最多保留 5 个版本）：  

```bash
DEPLOY_BACKUP=1 \
DEPLOY_BACKUP_DIR=/home/react-project/backup \
npm run deploy:test
```

- 备份 + 清空 + 指定目标主机/用户/路径：  

```bash
DEPLOY_HOST=192.168.4.239 \
DEPLOY_USER=react \
DEPLOY_PATH=/home/react-project/teapot-web \
DEPLOY_BACKUP_DIR=/home/react-project/backup \
DEPLOY_ALLOW_DELETE=1 \
npm run deploy:test
```

- 预演（仅打印命令）：  

```bash
DEPLOY_DRY_RUN=1 npm run deploy:test
```

- 强制交互式登录（忽略 `DEPLOY_PASS`）：  

```bash
DEPLOY_AUTH_MODE=interactive npm run deploy:test
```

## 自动部署流程

1. 本地执行 `npm run build:test`
2. 校验本地存在 `dist/`
3. 远端可选创建目录
4. 远端可选备份当前内容
5. 远端可选清空目录（需 `DEPLOY_ALLOW_DELETE=1`）
6. 上传 `dist/` 到远端目录

## 常用示例

- 预演（不执行任何命令）：

```bash
DEPLOY_DRY_RUN=1 npm run deploy:test
```

- 启用远端清空与备份：

```bash
DEPLOY_ALLOW_DELETE=1 \
DEPLOY_BACKUP_DIR=/home/react-project/backup \
npm run deploy:test
```

- 使用密码免交互（需要安装 sshpass）：

```bash
DEPLOY_PASS=your_password npm run deploy:test
```

## 注意事项

- `DEPLOY_ALLOW_DELETE` 默认关闭，避免误删
- `DEPLOY_PATH` 不能为 `/`、`/home`、`/root`、`.` 或 `..`
- 若不设置 `DEPLOY_PASS`，将使用交互式 SSH 登录
