# security-career-ops

Security/compliance career search configuration for [career-ops](https://github.com/santifer/career-ops).

## What this does

This is a Claude Code skill that configures career-ops for cybersecurity professionals targeting:
- GRC / Compliance Engineering (ISSM, ISSO, RMF, FedRAMP)
- Cloud Security (AWS GovCloud, Zero Trust)
- AI Security / AI Governance (NIST AI RMF, OWASP LLM Top 10)
- DevSecOps / Compliance Automation (SAST/DAST, STIG, policy-as-code)
- Security Architecture (threat modeling, defense-in-depth)
- FedRAMP Consulting (3PAO, JAB, SSP authoring)

## How to use

Run `/security-career-ops setup` for full installation, or `/security-career-ops overlay` to add security config to an existing career-ops install.

## Files

| Directory | Contents |
|-----------|----------|
| `templates/modes/` | Security-focused `_profile.md` (archetypes, detection signals, Firecrawl overrides) |
| `templates/portals.yml` | 24 defense/security employers + 19 search queries |
| `templates/profile.yml` | Profile template with security role archetypes |
| `templates/obsidian/` | Obsidian vault templates (Dataview analytics, note templates) |
| `scripts/` | `sync-to-obsidian.mjs` for career-ops → Obsidian sync |
| `examples/` | Filled-in examples for reference |

## Requires

- [career-ops](https://github.com/santifer/career-ops) installed
- Node.js 18+
- Optional: Firecrawl skill (faster web scraping), Obsidian with Dataview plugin
