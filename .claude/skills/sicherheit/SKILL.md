---
name: sicherheit
description: Security check of a customer site before launch or after changes to functions/, _headers or dependencies - deploys the security-auditor agent and summarizes. Use on "/sicherheit", before every go-live, on Dependabot PRs.
---

# Security

1. Deploy the agent `security-auditor` with the customer folder.
2. For diffs with logic, additionally run the built-in command `/security-review`.
3. Live site (only our own, approved domains): `NODE_USE_ENV_PROXY=1 node wartung/check.mjs --nur <slug>`.
4. Fix KRIT/HOCH defects before the merge, log the rest as an order.
5. Before go-live also run `/seiten-check` (outside measurement + source checklist) against the own/ordered site.
