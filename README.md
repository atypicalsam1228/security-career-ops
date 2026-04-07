# security-career-ops

> A Claude Code skill that configures [career-ops](https://github.com/santifer/career-ops) for cybersecurity and compliance professionals.

Career-ops is an AI-powered job search pipeline that automates offer evaluation, CV generation, portal scanning, and application tracking. **This skill adapts it for the security domain** — defense contractors, GRC roles, clearance-required positions, FedRAMP, and cloud security.

## What It Does

| Feature | Description |
|---------|-------------|
| **6 Security Archetypes** | GRC/Compliance, Cloud Security (AWS), AI Security, DevSecOps, Security Architect, FedRAMP Consultant |
| **24 Tracked Employers** | Defense primes (Booz Allen, Leidos, SAIC, Northrop), cloud security (CrowdStrike, Palo Alto, Wiz), 3PAOs (Coalfire, Schellman), AI safety (Anthropic) |
| **19 Search Queries** | ClearanceJobs, Greenhouse, Ashby, Lever — all targeting security/compliance roles |
| **Clearance-Aware Scoring** | TS/SCI, Top Secret, Secret — clearance match boosts evaluation scores |
| **Firecrawl Integration** | 10x faster portal scanning via Firecrawl (replaces Playwright for scraping) |
| **Obsidian Career Vault** | Dataview-powered analytics, bidirectional linking, clearance tracking |

## Who This Is For

- **ISSO / ISSM / GRC Engineers** looking for cleared federal roles
- **Cloud Security Engineers** targeting AWS GovCloud positions
- **AI Security / Governance professionals** working with NIST AI RMF
- **DevSecOps Engineers** automating compliance in CI/CD
- **FedRAMP Consultants** and 3PAO assessors
- Anyone with a security clearance looking for their next role

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- Node.js 18+
- (Optional) [Firecrawl](https://firecrawl.dev) for faster web scraping
- (Optional) [Obsidian](https://obsidian.md) with Dataview plugin

## Quick Start

### 1. Install career-ops (the base system)

```bash
git clone https://github.com/santifer/career-ops.git
cd career-ops
npm install
npx playwright install chromium
```

### 2. Install security-career-ops (this skill)

```bash
git clone https://github.com/atypicalsam1228/security-career-ops.git
```

Add it to your Claude Code skills by copying the `.claude/skills/security-career-ops/` directory into your career-ops project:

```bash
cp -r security-career-ops/.claude/skills/security-career-ops career-ops/.claude/skills/
```

### 3. Run setup

Open Claude Code in your career-ops directory and run:

```
/security-career-ops setup
```

This will:
- Apply security archetypes, portals, and scoring rules
- Walk you through profile setup (name, clearance level, salary targets)
- Help you create your CV in markdown
- Set up Obsidian career vault (optional)

### Manual Setup (without the skill)

If you prefer to configure manually, copy the templates:

```bash
# From within career-ops directory:
cp ../security-career-ops/templates/modes/_profile.md modes/_profile.md
cp ../security-career-ops/templates/portals.yml portals.yml
cp ../security-career-ops/templates/profile.yml config/profile.yml
cp ../security-career-ops/scripts/sync-to-obsidian.mjs sync-to-obsidian.mjs
```

Then edit `config/profile.yml` with your personal details.

## Archetype Presets

Not everyone targets the same security roles. The skill includes **7 preset packs** you can swap between:

```
/security-career-ops archetypes
> swap to offensive
```

| Preset | Focus | Example Roles |
|--------|-------|---------------|
| `default` | General security/compliance | ISSM, Cloud Security, AI Security, DevSecOps, Architect, FedRAMP |
| `grc` | Federal compliance | ISSM, ISSO, RMF Analyst, FedRAMP Engineer, OSCAL/eMASS, 3PAO Assessor |
| `offensive` | Red team / pentesting | Pentester, Red Team Operator, AppSec, Exploit Dev, Bug Bounty, Threat Intel |
| `cloud` | Cloud-native security | Cloud Security Engineer, DevSecOps, CSPM, Container/K8s Security, IAM |
| `ai-security` | AI/ML security | AI Security Engineer, AI Governance, ML Security, AI Red Team, LLM Security |
| `soc` | Security operations | SOC Analyst, Detection Engineer, IR Lead, Threat Hunter, SIEM, Forensics |
| `leadership` | Security leadership | CISO, Security Director, GRC Director, Program Manager, SOC Manager |

You can also mix presets, add custom archetypes, or edit individual roles:

```
/security-career-ops archetypes
> add "Insider Threat Analyst"
> edit 3
> remove 6
```

All changes live in `modes/_profile.md` (User Layer) and survive career-ops system updates.

## Default Security Archetypes

The `default` preset configures 6 role archetypes optimized for cybersecurity professionals:

| Archetype | Key Signals | Example Roles |
|-----------|-------------|---------------|
| **Cleared GRC / Compliance** | RMF, NIST 800-53, FedRAMP, ATO, eMASS | ISSM, ISSO, Compliance Engineer |
| **Cloud Security (AWS)** | GovCloud, IAM, Security Hub, Zero Trust | Cloud Security Engineer, AWS Security Architect |
| **AI Security / Governance** | OWASP LLM Top 10, AI RMF, SecAI+ | AI Security Engineer, AI Governance Lead |
| **DevSecOps / Automation** | SAST/DAST, STIG, Terraform, CI/CD | DevSecOps Engineer, Security Automation |
| **Security Architect** | Threat modeling, zero trust, defense-in-depth | Security Architect, Cybersecurity Architect |
| **FedRAMP Consultant** | 3PAO, JAB, SSP, POA&M, ConMon | FedRAMP Assessor, Compliance Consultant |

## Tracked Employers

The default portal config tracks 24 security/defense employers. You can swap entire employer sets with portal presets:

```
/security-career-ops portals
> swap to offensive
```

| Portal Preset | Companies | Focus Employers |
|---------------|:---------:|-----------------|
| `default` | ~24 | Booz Allen, Leidos, CrowdStrike, Wiz, Coalfire, Anthropic |
| `grc` | ~20 | Defense primes, 3PAOs (Coalfire, Schellman, A-LIGN), GRC platforms, federal consulting |
| `offensive` | ~17 | HackerOne, Bugcrowd, Rapid7, Bishop Fox, SpecterOps, NCC Group, Mandiant |
| `cloud` | ~18 | AWS, Wiz, Orca, Snyk, Chainguard, Okta, CyberArk, Sysdig |
| `ai-security` | ~17 | Anthropic, OpenAI, Lakera, Protect AI, HiddenLayer, Anduril, Scale AI |
| `soc` | ~17 | Splunk, Elastic, CrowdStrike, SentinelOne, Arctic Wolf, Expel, Mandiant |
| `leadership` | ~21 | Google, Microsoft, Amazon, JPMorgan, Salesforce, Snowflake, Booz Allen |

You can also add individual companies:
```
/security-career-ops portals
> add "Dragos"
```

The skill auto-detects the ATS platform and builds the YAML entry for you.

## Obsidian Career Vault

The optional Obsidian integration adds:

- **Application notes** with YAML frontmatter (score, status, clearance, archetype)
- **Company research notes** with bidirectional backlinks
- **Dataview analytics** — pipeline status, score distribution, archetype breakdown, clearance vs non-clearance roles
- **STAR story bank** linked to evaluations
- **Sync script** (`sync-to-obsidian.mjs`) that populates the vault from career-ops tracker

## Firecrawl Integration

If you have the Firecrawl CLI configured, the skill sets it as the preferred web scraping tool:

- **Portal scanning**: Firecrawl `scrape` replaces Playwright (100 concurrent vs 3-5)
- **Job discovery**: Firecrawl `search` replaces WebSearch (structured JSON, fresher results)
- **JD extraction**: Firecrawl converts any career page to clean markdown
- **Fallback**: Playwright still used for PDF generation and login-gated pages

## File Structure

```
security-career-ops/
  .claude/skills/security-career-ops/
    SKILL.md                          # Skill definition (router + 7 commands)
  templates/
    modes/_profile.md                 # Security archetypes + Firecrawl overrides
    portals.yml                       # Defense/security employer config
    profile.yml                       # Profile template with security roles
    presets/                          # Preset packs (archetypes + portals)
      default.md                     #   Archetypes: General security/compliance
      grc.md                         #   Archetypes: Federal compliance
      offensive.md                   #   Archetypes: Red team / pentesting
      cloud.md                       #   Archetypes: Cloud-native security
      ai-security.md                 #   Archetypes: AI/ML security
      soc.md                         #   Archetypes: Security operations
      leadership.md                  #   Archetypes: CISO / security management
      portals/                       #   Matching portal configs
        default.yml                  #     Defense primes, cloud security, 3PAOs
        grc.yml                      #     Federal compliance employers
        offensive.yml                #     Pentest firms, bug bounty platforms
        cloud.yml                    #     Cloud providers, CNAPP, DevSecOps
        ai-security.yml              #     AI labs, AI security startups
        soc.yml                      #     SIEM/SOAR, MDR, EDR vendors
        leadership.yml               #     Fortune 500, finance, large SaaS
    obsidian/
      VAULT-INDEX.md                  # Vault index
      Templates/
        application-note.md           # Obsidian note template
        company-note.md               # Company research template
      Analytics/
        pipeline-status.md            # Dataview: apps by status
        score-distribution.md         # Dataview: score breakdown
        archetype-breakdown.md        # Dataview: roles by archetype
        clearance-roles.md            # Dataview: clearance tracking
  scripts/
    sync-to-obsidian.mjs             # career-ops → Obsidian sync
  examples/
    profile-issm-example.yml          # Filled example (ISSM role)
    cv-issm-example.md                # Filled CV example
  CLAUDE.md                           # Agent instructions
  README.md                           # This file
  LICENSE                             # MIT
```

## How It Works With career-ops

This is a **companion skill**, not a fork. Career-ops is the engine; this skill is the configuration layer.

```
career-ops (upstream)          security-career-ops (this repo)
━━━━━━━━━━━━━━━━━━━           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
System Layer (auto-updatable)  → stays untouched
  modes/_shared.md
  modes/oferta.md, scan.md...
  CLAUDE.md, *.mjs scripts
  dashboard/

User Layer (your customizations) ← configured by this skill
  modes/_profile.md             ← security archetypes + Firecrawl
  config/profile.yml            ← your identity + clearance
  portals.yml                   ← defense/security employers
  cv.md                         ← your CV
  sync-to-obsidian.mjs          ← Obsidian sync script
```

This means you can run `node update-system.mjs apply` in career-ops to get upstream improvements without losing your security customizations.

## Acknowledgments

- [career-ops](https://github.com/santifer/career-ops) by [@santifer](https://github.com/santifer) — the foundation this skill builds on
- Built with [Claude Code](https://claude.ai/code) by Anthropic

## License

MIT
