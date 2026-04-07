---
name: security-career-ops
description: Configure career-ops for cybersecurity/compliance professionals — security archetypes, defense contractor portals, clearance-aware scoring, Firecrawl integration, Obsidian vault sync
user_invocable: true
args: command
---

# security-career-ops — Security Career Search Configuration

## Overview

This skill configures [career-ops](https://github.com/santifer/career-ops) for cybersecurity and compliance professionals. It overlays security-specific archetypes, defense contractor portals, clearance-aware evaluation rules, Firecrawl web scraping integration, and an Obsidian vault for career intelligence.

## Command Routing

| Input | Action |
|-------|--------|
| (empty / no args) | Show help menu |
| `setup` | Full installation: career-ops + security overlay + Obsidian vault |
| `overlay` | Apply security config to existing career-ops installation |
| `vault` | Set up Obsidian career vault only |
| `sync` | Run Obsidian sync (applications.md → vault) |
| `status` | Check installation status |
| `portals` | Show/edit tracked security employers |
| `archetypes` | Show/edit security role archetypes |

---

## Discovery Mode (no arguments)

Show this menu:

```
security-career-ops — Cybersecurity Career Search Kit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overlay for career-ops targeting GRC, cloud security, AI security,
DevSecOps, and cleared cybersecurity roles.

Commands:
  /security-career-ops setup       → Full install (career-ops + security config + vault)
  /security-career-ops overlay     → Apply security config to existing career-ops
  /security-career-ops vault       → Set up Obsidian career vault
  /security-career-ops sync        → Sync applications → Obsidian vault
  /security-career-ops status      → Check installation status
  /security-career-ops portals     → View/edit tracked security employers
  /security-career-ops archetypes  → View/edit security role archetypes

Requires: career-ops (https://github.com/santifer/career-ops)
Optional: Firecrawl skill, Obsidian with Dataview plugin
```

---

## `setup` — Full Installation

### Step 1: Check prerequisites

```bash
node --version    # Must be 18+
```

### Step 2: Clone career-ops (if not present)

Check if career-ops exists. Look for it in:
1. Current working directory
2. `../career-ops/`
3. `~/repos/career-ops/`

If not found:
```bash
git clone https://github.com/santifer/career-ops.git
cd career-ops
npm install
npx playwright install chromium
```

### Step 3: Apply security overlay

Run the `overlay` command (see below).

### Step 4: Set up Obsidian vault

Run the `vault` command (see below).

### Step 5: Onboarding

Ask the user for:
1. **Full name and email** — for profile.yml
2. **Security clearance level** — TS/SCI, Top Secret, Secret, or None
3. **Location and timezone**
4. **Target salary range**
5. **Work location preference** — Remote, Hybrid, Any

Then ask for their CV:
- Paste CV text, provide a .docx file path, or describe experience

Fill in `config/profile.yml` and `cv.md` with their answers.

### Step 6: Confirm ready

```
Setup complete! Your security career-ops is configured with:
  ✅ 6 security/compliance archetypes
  ✅ 24 defense/security employers tracked
  ✅ 19 security-focused search queries
  ✅ Clearance-aware evaluation scoring
  ✅ Firecrawl integration (if available)
  ✅ Obsidian career vault (if set up)

Next: paste a job URL or run /career-ops scan
```

---

## `overlay` — Apply Security Config to Existing career-ops

Locate the career-ops installation directory. Then:

### 1. Copy `modes/_profile.md`

Read the security profile template from this skill's `templates/modes/_profile.md`.

If `modes/_profile.md` already exists in career-ops, ask before overwriting:
> "You already have a _profile.md. Want me to replace it with the security version, or merge the security archetypes into your existing file?"

If it doesn't exist or user says replace, copy the template.

If user says merge, read both files and intelligently combine:
- Add security archetypes to the archetype table
- Add security detection signals
- Add clearance-aware evaluation rules
- Add Firecrawl tool overrides section
- Keep any existing user customizations

### 2. Copy `portals.yml`

Read the security portals template from `templates/portals.yml`.

If `portals.yml` already exists, ask:
> "You have an existing portals.yml. Want me to replace it with security employers, or add security employers to your existing list?"

### 3. Copy `sync-to-obsidian.mjs`

Copy `scripts/sync-to-obsidian.mjs` to the career-ops root.

### 4. Update `.gitignore`

Add `.firecrawl/` if not already present.

### 5. Update `config/profile.yml`

If profile.yml exists, update the archetypes section with security roles.
If not, copy from `templates/profile.yml` and run onboarding.

### 6. Fix Windows dashboard (if on Windows)

Check `dashboard/main.go` for the Windows URL-opening bug. If the `"windows"` case is missing from the `runtime.GOOS` switch, add it:

```go
case "windows":
    cmd = exec.Command("cmd", "/c", "start", url)
```

---

## `vault` — Set Up Obsidian Career Vault

### 1. Determine vault location

Ask user or use defaults:
- **With OneDrive**: `~/OneDrive/Obsidian/career_vault/`
- **Without OneDrive**: `~/Obsidian/career_vault/`
- **Custom**: User specifies path

### 2. Create vault structure

```
career_vault/
  .gitignore
  VAULT-INDEX.md
  Templates/
    application-note.md
    company-note.md
  Companies/
  Applications/
  Reports/
  Analytics/
    pipeline-status.md
    score-distribution.md
    archetype-breakdown.md
    clearance-roles.md
  Stories/
```

Copy all files from `templates/obsidian/` to the vault.

### 3. Set up git (optional)

If user wants version control:
- **With OneDrive**: Use bare git repo pattern (`git init --bare` outside OneDrive, `core.worktree` pointing to vault)
- **Without OneDrive**: Regular `git init` inside vault

### 4. Confirm

```
Obsidian career vault created at: {path}

Open it in Obsidian and install the Dataview plugin for analytics queries.
Run /security-career-ops sync after evaluations to populate the vault.
```

---

## `sync` — Run Obsidian Sync

Find the career-ops directory and run:
```bash
node sync-to-obsidian.mjs
```

If `sync-to-obsidian.mjs` doesn't exist, copy it from this skill's `scripts/` directory first.

---

## `status` — Check Installation Status

Check and report:

| Component | Check | Status |
|-----------|-------|--------|
| career-ops | Directory exists, `package.json` present | ✅/❌ |
| Node.js | `node --version` >= 18 | ✅/❌ |
| Playwright | Chromium installed | ✅/❌ |
| Profile | `config/profile.yml` exists | ✅/❌ |
| CV | `cv.md` exists | ✅/❌ |
| Security overlay | `modes/_profile.md` has security archetypes | ✅/❌ |
| Portals | `portals.yml` has security employers | ✅/❌ |
| Obsidian sync | `sync-to-obsidian.mjs` exists | ✅/❌ |
| Obsidian vault | Vault directory exists | ✅/❌ |
| Firecrawl | `/firecrawl` skill available | ✅/❌ |
| Go dashboard | `dashboard/career-dashboard` binary exists | ✅/❌ |
| Version | `node update-system.mjs check` | current/outdated |

---

## `portals` — View/Edit Security Employers

Read `portals.yml` and show a summary:

```
Tracked Security Employers (24)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Federal/Defense (9):
  ✅ Booz Allen Hamilton    ✅ Leidos         ✅ SAIC
  ✅ Northrop Grumman       ✅ RTX            ✅ GDIT
  ✅ ManTech                ✅ CACI           ✅ Peraton

Cloud Security (4):
  ✅ CrowdStrike            ✅ Palo Alto      ✅ Wiz
  ✅ Zscaler

...

Options:
  • "swap to [preset]" — Load a portal preset (see below)
  • "add [company]" — Add a company to track
  • "remove [company]" — Stop tracking a company
  • "enable/disable [company]" — Toggle without removing
  • "reset" — Restore default security portals
```

### Portal Presets

Portal presets match the archetype presets — each includes title_filter keywords, search queries, and tracked companies tailored to that security specialization.

Read the preset from `templates/presets/portals/{preset}.yml` and apply it to `portals.yml`.

| Preset | Companies | Focus |
|--------|:---------:|-------|
| `default` | ~24 | Defense primes, cloud security vendors, 3PAOs, AI safety |
| `grc` | ~20 | Defense primes, 3PAOs, GRC platforms, federal consulting |
| `offensive` | ~17 | Offensive security firms, bug bounty platforms, IR consultancies |
| `cloud` | ~18 | Cloud providers, CNAPP/CSPM vendors, identity, DevSecOps |
| `ai-security` | ~17 | AI labs, AI security startups, AI governance, defense AI |
| `soc` | ~17 | SIEM/SOAR vendors, MDR providers, EDR vendors, IR firms |
| `leadership` | ~21 | Fortune 500 tech, finance, healthcare, SaaS, defense, consulting |

When loading a portal preset:
1. Read the preset YAML from `templates/presets/portals/{name}.yml`
2. Show the user: "This will replace your portals with {N} companies focused on {focus}. Replace or merge?"
3. **Replace**: Overwrite `portals.yml` entirely
4. **Merge**: Keep existing companies, add new ones, merge title_filter keywords, append search queries (dedup by name)
5. Write updated `portals.yml`

### Syncing Archetypes + Portals

When a user swaps archetype presets via `/security-career-ops archetypes`, suggest matching portals:
> "You switched to the offensive archetype pack. Want me to also swap your portals to match? This would replace your tracked companies with pentesting/red team employers."

This keeps archetypes and portals aligned. Users can decline and keep their current portals.

### Adding Companies

When the user says "add [company]":

1. Search for the company's career page URL (WebSearch or Firecrawl)
2. Detect the ATS platform (Greenhouse, Ashby, Lever, Workday, custom)
3. Build the YAML entry:
   ```yaml
   - name: "Company Name"
     careers_url: https://detected-url
     api: https://boards-api.greenhouse.io/v1/boards/slug/jobs  # if Greenhouse
     notes: "Brief description"
     enabled: true
   ```
4. Append to `tracked_companies` in `portals.yml`
5. Optionally add a search query targeting this company

---

## `archetypes` — View/Edit Security Archetypes

Read `modes/_profile.md` and show the current archetype table.

Then offer:

```
Current Archetypes:
  1. Cleared GRC / Compliance Engineer  [primary]
  2. Cloud Security Engineer (AWS)      [primary]
  3. AI Security / AI Governance        [primary]
  4. DevSecOps / Compliance Automation  [secondary]
  5. Security Architect                 [secondary]
  6. FedRAMP Consultant / Assessor      [adjacent]

Options:
  • "swap to [preset]" — Load a preset archetype pack (see below)
  • "add [role]" — Add a custom archetype
  • "remove [number]" — Remove an archetype
  • "edit [number]" — Modify an existing archetype
  • "reorder" — Change priority/fit levels
  • "reset" — Restore default security archetypes
```

### Archetype Presets

Users can load a preset pack that replaces or merges with their archetypes. Each preset includes the archetype table, detection signals, adaptive framing, and matching portals/search queries.

Read the preset from `templates/presets/{preset}.md` and apply it to `modes/_profile.md`.

| Preset | Archetypes | Best For |
|--------|------------|----------|
| `grc` | Cleared GRC, ISSM/ISSO, RMF Analyst, FedRAMP Consultant, Compliance Automation, Audit/Assessment | Federal compliance professionals |
| `offensive` | Penetration Tester, Red Team Operator, Exploit Developer, AppSec Engineer, Bug Bounty Hunter, Threat Researcher | Offensive security professionals |
| `cloud` | Cloud Security Engineer, Cloud Architect (Security), DevSecOps, CSPM Engineer, Container Security, Identity Engineer | Cloud-native security professionals |
| `ai-security` | AI Security Engineer, AI Governance Lead, ML Security Researcher, AI Red Teamer, Responsible AI PM, LLM Security Engineer | AI/ML security professionals |
| `soc` | SOC Analyst, Detection Engineer, Incident Responder, Threat Hunter, SIEM Engineer, Forensics Analyst | Security operations professionals |
| `leadership` | CISO, Security Director, VP Security, Security Program Manager, GRC Director, Security Operations Manager | Security leadership |
| `default` | The original 6 archetypes (GRC, Cloud, AI, DevSecOps, Architect, FedRAMP) | General security/compliance |

When loading a preset:
1. Read the preset file from `templates/presets/{name}.md`
2. Show the user what will change
3. Ask: "Replace your current archetypes, or merge with them?"
4. Update `modes/_profile.md` — archetype table, detection signals, adaptive framing
5. Update `portals.yml` — title_filter.positive keywords and search_queries to match
6. Update `config/profile.yml` — target_roles and archetypes sections

### Custom Archetypes

When the user says "add [role]", build a new archetype interactively:

1. **Name**: The archetype label (e.g., "Penetration Tester")
2. **Thematic axes**: Key skills/domains (e.g., "OWASP Top 10, web app testing, network pentest, Burp Suite")
3. **What they buy**: What employers are looking for (e.g., "Someone who finds vulnerabilities before attackers do")
4. **Detection signals**: Keywords that identify this role in JDs
5. **Fit level**: primary, secondary, or adjacent
6. **Proof points**: Which parts of the user's CV map to this archetype

Then write to `modes/_profile.md`:
- Add row to archetype table
- Add row to detection signals table
- Add row to adaptive framing table

### Editing Archetypes

When the user says "edit [number]" or describes a change:
- Read `modes/_profile.md`
- Find the archetype by number or name
- Show current values
- Ask what to change
- Update all three tables (archetype, detection, framing) consistently

All changes go to `modes/_profile.md` (User Layer) — never `modes/_shared.md`.
