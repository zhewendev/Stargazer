# Quartz v5

> “[One] who works with the door open gets all kinds of interruptions, but [they] also occasionally gets clues as to what the world is and what might be important.” — Richard Hamming

Quartz is a set of tools that helps you publish your [digital garden](https://jzhao.xyz/posts/networked-thought) and notes as a website for free.

🔗 Read the documentation and get started: https://quartz.jzhao.xyz/

[Join the Discord Community](https://discord.gg/cRFFHYye7t)

## Deploy

本博客通过 GitHub Actions 自动部署到 GitHub Pages，工作流文件：`.github/workflows/deploy.yaml`。

**触发条件**

- 推送到 `main` 分支
- 在 Actions 页面手动运行（`workflow_dispatch`）

**首次启用**

1. GitHub 仓库 → **Settings → Pages → Source** 选择 **GitHub Actions**
2. 等待首次构建完成，站点将发布到 `https://<用户名>.github.io/Stargazer/`

**本地预览**

```bash
npx quartz build --serve
```

浏览器打开 `http://localhost:8080/Stargazer/` 实时预览。

**构建产物**

`npx quartz build` 默认输出到 `public/` 目录，工作流将其作为 artifact 上传并由 `actions/deploy-pages` 部署。

## 部署到自定义域名

1. 在 `quartz/static/CNAME` 文件中写入你的域名（无后缀，每行一个）：

   ```
   blog.example.com
   ```

   `cname` 插件已默认启用，构建时会自动复制该文件到站点根。

2. 修改 `quartz.config.yaml`，将 `baseUrl` 改为空字符串（自定义域名对应根路径，不再带仓库名前缀）：

   ```yaml
   configuration:
     baseUrl: ""
   ```

3. 在域名服务商处添加 DNS 记录：
   - **CNAME**：`blog.example.com` → `<用户名>.github.io`

   或 **A 记录**（任选其一）：
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. 在 **Settings → Pages → Custom domain** 填入域名并启用 **Enforce HTTPS**。
