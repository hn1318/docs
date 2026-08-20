# MakerStudio

MakerStudio 主页 —— 基于 [Next.js](https://nextjs.org) + [Fumadocs](https://fumadocs.dev) + Tailwind CSS 构建的独立开发者工作坊官网，部署于 Cloudflare。

站点展示了 4 个产品：**Hwather**（天气与灾害预警）、**Hchat**（在线多人聊天室）、**NetTool**（FRP 快速连接工具）、**校书淘 CampusTao**（校园二手书交易平台）。

## 开发

```bash
npm install
npm run dev
```

打开 http://localhost:3000 查看。中文版位于 `/zh`（根据浏览器语言自动跳转）。

## 国际化

- 文案集中在 `src/i18n/dict.ts`，中英文双语完整覆盖（导航、页脚、项目卡片、Hero 等）。
- 路由约定：英文为默认语言（无前缀），中文使用 `/zh` 前缀；导航栏与页脚均提供语言切换入口。
- 文档内容按 `content/docs/en` 与 `content/docs/zh` 组织。

## 部署到 Cloudflare

本项目使用 [OpenNext for Cloudflare](https://opennext.js.org/cloudflare) 将 Next.js 应用（含 API 路由、AI 搜索）完整部署到 Cloudflare Workers。

1. 安装依赖（`@opennextjs/cloudflare` 与 `wrangler` 已在 devDependencies 中）。

2. 登录并部署：

   ```bash
   npx wrangler login
   npm run deploy          # 构建 + 部署到 Cloudflare Workers
   # 或本地预览 Worker 版本：
   npm run preview
   ```

3. AI 搜索需要 OpenRouter Key，通过 secret 注入：

   ```bash
   npx wrangler secret put OPENROUTER_API_KEY
   ```

4. （可选）在 `wrangler.jsonc` 中取消 `routes` 注释绑定自定义域名。

## CI/CD（GitHub Actions）

`.github/workflows/deploy.yml` 在代码推送到 `master`/`main` 分支后自动构建并部署到 Cloudflare。需要在仓库 **Settings → Secrets and variables → Actions** 中配置：

| Secret                    | 说明                                             |
| ------------------------- | ------------------------------------------------ |
| `CLOUDFLARE_API_TOKEN`    | Cloudflare API Token（需要 Workers 部署权限）   |
| `CLOUDFLARE_ACCOUNT_ID`   | Cloudflare Account ID                            |

推送代码后，Actions 将自动执行 `npm ci` → OpenNext 构建 → `wrangler deploy`。

## 目录结构

| 路径                        | 说明                                     |
| --------------------------- | ---------------------------------------- |
| `src/components/home/`      | 主页组件（含滚动渐入动效）               |
| `src/i18n/`                 | 语言配置与中英文案字典                   |
| `content/docs/{en,zh}`      | 双语文档内容（MDX）                      |
| `wrangler.jsonc`            | Cloudflare Workers 部署配置              |
| `open-next.config.ts`       | OpenNext 适配配置                        |
| `.github/workflows/`        | CI/CD 工作流（构建检查 + 自动部署）      |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Fumadocs](https://fumadocs.dev)
- [OpenNext for Cloudflare](https://opennext.js.org/cloudflare)
