# 招聘方可操作在线 Demo 说明

这个模式用于把 `AI OrderOps Workbench` 临时开放给招聘方体验。服务运行在你的电脑上，招聘方通过公网隧道访问前端页面，页面再通过同源代理 `/api/live` 调用本机 FastAPI 后端。

## 启动方式

在项目根目录双击或运行：

```powershell
scripts\start-live-recruiter-demo.cmd
```

默认访问地址：

- 前端：http://127.0.0.1:3000
- 后端健康检查：http://127.0.0.1:8000/api/health
- 默认访问密码：`demo-pass`

如需换密码：

```powershell
$env:ORDEROPS_DEMO_PASSWORD="your-demo-password"
scripts\start-live-recruiter-demo.cmd
```

## 给招聘方访问

只需要把前端 `http://127.0.0.1:3000` 暴露成公网地址。前端会自动把后端请求转发到 `/api/live`，不需要再给后端单独开一个公网地址。

可选工具：

- Cloudflare Tunnel
- ngrok
- frp
- 其它你已经熟悉的内网穿透工具

## 招聘方能做什么

- 点击“运行真实脱敏任务”，调用本机 FastAPI 生成真实任务。
- 上传脱敏 PDF 或 ZIP，生成真实 Excel。
- 进入任务详情查看字段溯源、人工审核、规则沉淀。
- 点击“下载真实 Excel”，下载后端生成的 `.xlsx` 文件。

## 安全边界

- 只放脱敏 PDF、合成 SKU、合成地址和合成客户留言。
- 不上传真实客户数据、真实规则表、真实订单输出、OpenAI 密钥。
- 访问密码只适合简历演示，不等同于企业级账号权限。
- 演示结束后关闭两个命令行窗口，并关闭公网隧道。

## 常见问题

如果前端页面能打开，但按钮提示后端失败：

1. 确认后端窗口没有报错。
2. 打开 `http://127.0.0.1:8000/api/health`，确认返回 `status: ok`。
3. 确认前端启动时显示 `NEXT_PUBLIC_USE_REMOTE_API=true`。
4. 如果设置了访问密码，前端输入框中的密码必须和 `ORDEROPS_DEMO_PASSWORD` 一致。

如果公网访问能打开页面，但上传或下载失败：

- 确认你只暴露了前端端口 `3000`。
- 不要把前端环境变量 `NEXT_PUBLIC_API_BASE_URL` 设置成 `http://127.0.0.1:8000`，远程浏览器无法访问你电脑的本机地址。
- 推荐保持默认 `/api/live`，由 Next.js 服务端代理到本机后端。
