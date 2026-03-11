# 环境变量配置（Vite 最佳实践）

本项目使用 Vite 的 `.env` 系列文件管理 API 地址，不再通过 `env.ts` 进行硬编码。

## 目录结构

```
.env.development
.env.test
.env.production
.env.example
```

## 变量说明

- `VITE_API_BASE_URL`：后端 API 基础地址（必须以 `VITE_` 开头才能被 Vite 注入）
- `VITE_LOGIN_BASE_URL`：登录接口基础地址（可与 API 地址一致，也可独立配置）

示例：

```
VITE_API_BASE_URL=http://localhost:8080
VITE_LOGIN_BASE_URL=http://localhost:8080
```

## 启动与切换方式

- 开发环境：
  - `npm run dev`
  - 自动读取 `.env.development`
- 测试环境：
  - `npm run test`
  - 自动读取 `.env.test`
- 生产环境：
  - `npm run prod`
  - 自动读取 `.env.production`

## 脚本配置

`package.json` 中已配置：

```
"dev": "vite --mode development",
"test": "vite --mode test",
"prod": "vite --mode production"
```

## 代码使用

统一从 `import.meta.env.VITE_API_BASE_URL` 读取：

```
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';
```

## 新环境扩展

新增环境时，按以下规则：

1) 新增 `.env.<mode>` 文件  
2) 新增对应脚本 `vite --mode <mode>`  
3) 在 `.env.example` 中补充变量示例
