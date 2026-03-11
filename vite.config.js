import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 部署后的路径前缀
  // 注意：如果使用了 GitHub Pages，这里需要修改为你的仓库名
  base: '/teapot/',

  // 开发服务器配置（仅本地开发时生效）
  server: {
    port: 5173, // 本地开发启动的端口，默认是 5173，这里改为 3000 也可以
    open: true // 启动后自动在浏览器打开
  },  

  // 构建配置
  build: {
    outDir: 'dist', // 打包后的文件输出目录
    assetsDir: 'assets', // 静态资源存放目录
  }
  // 部署nginx转发配置，在/etc/nginx/sites-available/teapot.conf
})
