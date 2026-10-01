# How Claude works – and how we use it wisely

## The building blocks

| Building block | What it is | What we use it for |
|---|---|---|
| **Session** | One conversation with its own working memory (context) in a fresh cloud container. When the session ends, the container is gone. | That is why everything is committed and pushed: GitHub is the long-term memory for code. |
| **Context** | What I currently have "in my head". Large but finite; very long sessions get summarized and lose details. | Split big tasks into threads, write important things into files instead of only saying them. |
| **CLAUDE.md** | A file in the repo that I read automatically at every start. | Rules, persona, quality standard – the same for every session. |
| **Project memory** | Small notes that all Claudes in this project read. | Decisions and preferences that would otherwise have to be asked again. |
| **Order log** | `ops/auftraege.jsonl` | What was requested by whom and when, and how it was handled. |
| **Skills** (`/pruefen`) | Saved work instructions, loaded via slash command or automatically when they fit. | Do recurring procedures equally well every time. |
| **Agents** (subagents) | Helpers with their own context, their own toolset and a selectable model. They report back only the result. | Parallel work (5 scouts at once) and relieving my context. They cost energy, so use them selectively. |
| **Hooks** | Commands that the system (not I) runs automatically, e.g. after every file change. | Catch errors immediately: HTML, head and security checks after every edit. I cannot "forget" them. |
| **MCP / connectors** | Connections to external services (Higgsfield, Stripe, Cloudflare, GitHub, browser). | I operate the services directly – you grant access by logging in, never by a password in the chat. |
| **Routines** | Scheduled sessions that start at fixed times. | Weekly maintenance without any effort from you. |
| **Workflows** | Many agents following a fixed plan, e.g. review across several dimensions with cross-checking. | Only for big tasks, because they are expensive. Say "use a workflow" if you want that. |
| **Artifacts** | Private web pages on claude.ai (like the situation map). | Previews, plans, reports to look at and share. |
| **Remote Control** | A session on your own device, in a folder of yours. | When something has to run locally (your accounts, your programs). |
| **Pull request** | A proposal to take a branch into `main`, with automatic checking (CI). | Every PR is both a backup and a checkpoint. You merge, I prepare. |

## Backup, branch, PR – the difference

- **Commit + push** = backup. The state is safe on GitHub even when the session ends.
- **Branch** = a separate line of work. `main` always stays runnable; new work happens alongside it.
- **Pull request** = "I propose taking this into `main`." GitHub checks automatically (workflow "Prüfen"),
  you see the changes and click Merge. Only then does a customer site go live.

## What I cannot do (and how we solve it)

- Create accounts, sign contracts, upload IDs, register with the authorities → `ops/HAENDE.md`.
- Creating new GitHub repos in this environment is not possible → you create the empty repo, I fill it.
- See secrets that you do not give me → good that way. Keys belong in Cloudflare/GitHub secrets.
- Remember earlier sessions if nothing was written down → hence log, memory, CLAUDE.md.

## Saving energy

Large models for planning, architecture and hard bugs. Scouts and routine on smaller models
(set in the agent). Agents only when they work in parallel or have to read a lot. Check first, then push:
one clean push saves three rounds of corrections.
