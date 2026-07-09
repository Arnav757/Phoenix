# Claude Code Setup for Building Websites

A guide to replicating my Claude Code setup — MCP servers, plugins, skills, and connectors I use for making websites. Work through it top to bottom; each section says exactly what to run or where to click.

---

## 1. Prerequisites

- Install Claude Code: `npm i -g @anthropic-ai/claude-code` (or use the desktop app / VS Code extension)
- Node.js 20+ and Git installed
- Run `claude` once in a project folder and log in

---

## 2. MCP Servers

MCP servers give Claude extra tools. Add these from any terminal:

### 2a. Magic (21st.dev) — AI UI component generation

Generates polished React/Tailwind components, finds design inspiration, and searches logos.

1. Get your own API key at https://21st.dev (free tier available)
2. Run:

```bash
claude mcp add magic --scope user -- npx -y @21st-dev/magic@latest
```

3. When prompted (or via `claude mcp add` with `-e`), set the env var `API_KEY=<your-21st-dev-key>`

### 2b. MarkItDown (Microsoft) — convert documents to Markdown

Turns PDFs, Word docs, PowerPoints, images, etc. into Markdown that Claude can read. Handy for turning client briefs/brand docs into usable context.

```bash
pipx install markitdown-mcp
claude mcp add markitdown --scope user -- markitdown-mcp
```

(Install pipx first if needed: `brew install pipx` on Mac.)

Verify both with `/mcp` inside Claude Code — they should show as connected.

---

## 3. Plugins

### Vercel plugin (official) — deploy, Next.js, shadcn/ui, and more

This is the biggest one. It adds 30+ skills: `vercel:deploy`, `vercel:nextjs`, `vercel:shadcn`, `vercel:env`, `vercel:ai-sdk`, `vercel:vercel-functions`, deployment/CI-CD guidance, plus specialist agents (deployment-expert, performance-optimizer, ai-architect).

Inside Claude Code:

1. Run `/plugin`
2. Browse the **claude-plugins-official** marketplace
3. Install **vercel**

Also install the Vercel CLI and log in:

```bash
npm i -g vercel@latest
vercel login
```

---

## 4. Skills

### ui-ux-pro-max — design intelligence skill

A searchable design database: 67 UI styles, 96 color palettes, 57 font pairings, 99 UX rules, chart guidance — for React, Next.js, Vue, Tailwind, shadcn/ui and more. Claude consults it automatically when designing pages.

Install: copy the `ui-ux-pro-max` folder (I'll send it to you — it lives at `.claude/skills/ui-ux-pro-max/` in my project) into your own project at:

```
your-project/.claude/skills/ui-ux-pro-max/
```

Or put it in `~/.claude/skills/` to have it available in every project. It's also published on GitHub — search "ui-ux-pro-max claude skill".

Built-in skills you'll get automatically (no install needed): `/code-review`, `/simplify`, `/security-review`, `/init`, `dataviz`, `artifact-design`, and more. Try `/init` first in any new project — it writes a CLAUDE.md so Claude understands your codebase.

---

## 5. Connectors (claude.ai account level)

These aren't installed locally — you connect them once in **claude.ai → Settings → Connectors**, and they show up in Claude Code too:

| Connector | What I use it for |
|---|---|
| **Claude in Chrome** (browser extension) | Claude drives a real Chrome tab — testing sites, taking screenshots, debugging console/network. Essential for web work. Install from the Chrome Web Store. |
| **Canva** | Generating/exporting designs and social assets |
| **Adobe (for creativity)** | Image editing, background removal, posters/flyers, Express documents |
| **Gmail / Google Calendar / Google Drive** | Email drafts, scheduling, files |
| **Microsoft 365** | Outlook/SharePoint search |
| **Composio** | Bridge to hundreds of other apps/tools |
| **Higgsfield / HeyGen** | AI image, video, and audio generation |

For website building specifically, **Claude in Chrome** is the must-have; the rest are nice-to-haves.

---

## 6. My typical website stack (what Claude builds with)

- **Next.js** (App Router) + **Tailwind CSS** + **shadcn/ui** for components
- **Supabase** for database/auth
- **Vercel** for hosting (deploy with `/vercel:deploy`)

A good first prompt once everything is set up:

> "Create a new Next.js site with Tailwind and shadcn/ui for [your idea]. Use the ui-ux-pro-max skill to pick a style, palette, and font pairing before writing any code."

---

## 7. Quick checklist

- [ ] Claude Code installed and logged in
- [ ] `claude mcp add magic ...` (with your own 21st.dev API key)
- [ ] `claude mcp add markitdown ...`
- [ ] `/plugin` → install **vercel** from claude-plugins-official
- [ ] `npm i -g vercel@latest` + `vercel login`
- [ ] `ui-ux-pro-max` folder copied into `.claude/skills/`
- [ ] Claude in Chrome extension installed and connected
- [ ] Run `/mcp` to confirm servers are connected
- [ ] Run `/init` in your project

Happy building! 🚀
