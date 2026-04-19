# Contributing to Wheelchair Taxi Pro

Welcome. This guide gets a new developer from a clean machine to a committed + pushed first change in about 30 minutes.

> **Contents**
> 1. [Prerequisites](#1-prerequisites)
> 2. [Clone the repo over SSH (multi-GitHub-account setup)](#2-clone-the-repo-over-ssh-multi-github-account-setup)
> 3. [Set your per-repo git identity](#3-set-your-per-repo-git-identity)
> 4. [Install dependencies and verify your toolchain](#4-install-dependencies-and-verify-your-toolchain)
> 5. [Branching model (GitFlow)](#5-branching-model-gitflow)
> 6. [Commit, push, and open a PR](#6-commit-push-and-open-a-pr)
> 7. [Code conventions](#7-code-conventions)
> 8. [Troubleshooting](#8-troubleshooting)

---

## 1. Prerequisites

Install these before touching the repo.

| Tool | Version | Verify |
|------|---------|--------|
| **Git** | 2.40+ | `git --version` |
| **Node.js** | **22 LTS** (or 20.19+) | `node --version` |
| **Angular CLI** | **21.x** | `npm i -g @angular/cli@21` then `ng version` |
| **.NET SDK** | **10.0 LTS** | `dotnet --list-sdks` |
| **OpenSSH client** | Any modern | `ssh -V` |

All version choices are documented in [`README.md`](README.md#support-windows). If you need the *why*, see [`initial-design/15-phase1-build-order.md`](initial-design/15-phase1-build-order.md).

You will also need:

- A **GitHub account** that has been granted access to https://github.com/WheelChairTaxiPro/git-wheelchairtaxipro1 by an owner of the `WheelChairTaxiPro` organization.
- That account's **primary or noreply email** (see §3 below).

---

## 2. Clone the repo over SSH (multi-GitHub-account setup)

This project's `origin` remote uses **SSH with a GitHub host alias** — not plain `github.com`. This lets a single machine hold multiple GitHub accounts without them colliding.

### 2.1 Generate a dedicated SSH key for this project

Run from any directory:

```powershell
ssh-keygen -t ed25519 -C "wheelchairtaxipro-<your-name>" -f $HOME\.ssh\id_ed25519_wheelchairtaxipro
```

- Leave the passphrase blank if you prefer convenience, or set one for stronger security.
- You'll get two files: `id_ed25519_wheelchairtaxipro` (**private — never share**) and `id_ed25519_wheelchairtaxipro.pub` (public).

### 2.2 Add the public key to your GitHub account

1. Copy the public key: `Get-Content $HOME\.ssh\id_ed25519_wheelchairtaxipro.pub | Set-Clipboard`
2. Sign into the GitHub account you want to commit as → **Settings → SSH and GPG keys → New SSH key**
3. Title: `<your-machine> — WheelChairTaxiPro`
4. Key type: **Authentication Key**
5. Paste the clipboard content and save.

### 2.3 Configure `~/.ssh/config` with a host alias

Open (or create) `$HOME\.ssh\config` and add the following block. If you already have other GitHub accounts with aliases, just append this one.

```sshconfig
Host github-wheelchairtaxipro
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_wheelchairtaxipro
  IdentitiesOnly yes
```

**Explanation of each line:**

| Line | What it does |
|------|--------------|
| `Host github-wheelchairtaxipro` | The alias you'll type in URLs — replaces `github.com` in remote URLs for this project |
| `HostName github.com` | Real server SSH actually connects to |
| `User git` | GitHub's required SSH username is always `git` |
| `IdentityFile ...` | The specific private key to offer for this alias |
| `IdentitiesOnly yes` | Prevents SSH from trying every key in your agent — critical on multi-account machines |

### 2.4 Verify SSH authentication

```powershell
ssh -T git@github-wheelchairtaxipro
```

Expected output:

```
Hi <your-github-username>! You've successfully authenticated, but GitHub does not provide shell access.
```

**Check the `<your-github-username>` value.** It must match the account you intend to commit as. If it shows a different account, you added the key to the wrong one — see [§8 Troubleshooting](#8-troubleshooting).

### 2.5 Clone the repo using the alias

```powershell
cd C:\Users\<you>\MyWorks
git clone git@github-wheelchairtaxipro:WheelChairTaxiPro/git-wheelchairtaxipro1.git
cd git-wheelchairtaxipro1
```

Notice the URL uses `github-wheelchairtaxipro:` (the alias), **not** `github.com:`. That's the whole trick — SSH resolves the alias through your `~/.ssh/config`, picks the right key, and connects to GitHub as the correct account.

Confirm the remote:

```powershell
git remote -v
# origin  git@github-wheelchairtaxipro:WheelChairTaxiPro/git-wheelchairtaxipro1.git (fetch)
# origin  git@github-wheelchairtaxipro:WheelChairTaxiPro/git-wheelchairtaxipro1.git (push)
```

---

## 3. Set your per-repo git identity

Because most developers on this project also have personal GitHub accounts on the same machine, set identity **locally** (per-repo), **not globally**. This prevents your personal email leaking into client commits and vice versa.

### 3.1 Pick your email

**Recommended: use GitHub's noreply email** to keep your real address out of commit history.

1. Sign into the WheelChairTaxiPro-authorized GitHub account
2. Go to https://github.com/settings/emails
3. Enable **"Keep my email addresses private"**
4. Copy the address shown — format: `NNNNNNN+<username>@users.noreply.github.com`

Alternatives:
- Your primary GitHub email — commits link to your profile, but your real address is public in the git log forever
- A dedicated client email (e.g. `you@wheelchairtaxipro.com`) — only works as attribution if that email is registered on a GitHub account

### 3.2 Set the values

```powershell
# Replace <your-name> and <your-github-noreply-email> with real values
git config --local user.name  "<your-name>"
git config --local user.email "<your-github-noreply-email>"

# Verify
git config --local --list | Select-String "^user\."
```

Expected output (example with placeholders):

```
user.name=<your-name>
user.email=<your-github-noreply-email>
```

### 3.3 Why `--local` and not `--global`?

- `--global` writes to `~/.gitconfig` and applies to **every** git repo on your machine
- `--local` writes to `.git/config` inside this repo and applies only here
- If you're working on multiple client projects / personal repos / open source under different identities, always use `--local`. Global is only safe if you use exactly one identity across everything.

---

## 4. Install dependencies and verify your toolchain

> The `frontend/` and `backend/` projects are scaffolded per [`initial-design/15-phase1-build-order.md`](initial-design/15-phase1-build-order.md) Step 0. If they don't exist yet, skip this section until they do.

### Frontend

```powershell
cd frontend
npm install
ng serve          # http://localhost:4200 — should load the app
```

### Backend

```powershell
cd backend\src\API
dotnet restore
dotnet run        # http://localhost:5000 — Swagger at /swagger
```

### End-to-end smoke test

With both running: open `http://localhost:4200` on your phone (same Wi-Fi) and confirm it successfully fetches `http://localhost:5000/api/health`.

---

## 5. Branching model (GitFlow)

Long-lived branches on the remote:

| Branch | Role | Who pushes |
|--------|------|-----------|
| `main` | Production. Every commit on `main` is released. | Release PR merges only — never push direct. |
| `staging` | Pre-production. Mirrors what's about to go live. | Release PRs from `develop`. |
| `develop` | Integration branch. All features land here. | Feature PRs merge here. |

Short-lived branches you create:

| Prefix | Purpose | Example | Merges into |
|--------|---------|---------|-------------|
| `feature/<kebab-name>` | New feature or slice | `feature/booking-form` | `develop` |
| `fix/<kebab-name>` | Non-urgent bug fix | `fix/map-marker-alignment` | `develop` |
| `hotfix/<kebab-name>` | Urgent production bug | `hotfix/email-not-sending` | `main` **and** `develop` |
| `release/<version>` | Release prep (version bump, changelog) | `release/0.2.0` | `main` and `develop` |

### Starting a new feature

```powershell
# 1. Make sure develop is up to date
git checkout develop
git pull

# 2. Branch off develop
git checkout -b feature/<short-descriptive-name>

# 3. Do the work, commit as you go (see §6)

# 4. Push with -u the first time (sets upstream tracking)
git push -u origin feature/<short-descriptive-name>
```

### Keeping your branch fresh

If `develop` moves while you're working, rebase on top of it — keeps history linear.

```powershell
git fetch origin
git rebase origin/develop
# Resolve any conflicts, then:
git push --force-with-lease    # --force-with-lease is safer than --force
```

---

## 6. Commit, push, and open a PR

### Commit-message conventions

- **Subject**: imperative, ≤ 72 chars, no trailing period
  - ✅ `Add booking form submit handler`
  - ✅ `Fix off-by-one in distance calc`
  - ❌ `Added some stuff.`
- **Body** (optional, separated by blank line): explain *why*, not *what* — the diff already shows *what*
- One logical change per commit when practical. Don't combine "add feature X" and "refactor unrelated util" in one commit.

### Opening a pull request

1. Push your feature branch (see §5)
2. Visit https://github.com/WheelChairTaxiPro/git-wheelchairtaxipro1/pulls
3. Click **Compare & pull request** on the banner GitHub shows
4. **Set base branch to `develop`** — not `main`. This is the #1 PR mistake on GitFlow projects.
5. Fill in a concise description:
   - What changed
   - Why (link design doc or issue if relevant)
   - How to test manually
6. Request review; wait for green CI (when CI is set up)

### After merge

- Delete the remote feature branch (GitHub has a button for this on the merged PR)
- Delete your local copy: `git branch -d feature/<name>`

---

## 7. Code conventions

Short version — see the linked docs for full detail.

### Frontend (Angular 21)
- Vertical slices under `frontend/src/app/features/<slice>/` — see [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md)
- Angular 21 suffix-less filenames (`home.ts`, not `home.component.ts`)
- Unit/component tests colocated as `*.spec.ts`
- E2E tests in `frontend/e2e/` (sibling of `src/`, never inside `src/app/`)
- Bilingual by default: any user-visible copy ships in both zh-HK and en
- Prefer feature isolation over premature abstraction

### Backend (.NET 10)
- Vertical slices under `backend/src/Features/<Slice>/` — see [`initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md`](initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md)
- Flow: `Controller → Handler → Service/Interface → External`
- **No MediatR** in Phase 1 — simple handlers with direct DI
- `Core/` holds interfaces; `Infrastructure/` holds implementations
- xUnit tests in a parallel `tests/` project (Phase 2+)

### General
- No secrets in commits — `.env`, `*.key`, `appsettings.Local.json` are `.gitignore`d by default
- Don't commit generated files (`dist/`, `bin/`, `obj/`, `node_modules/`) — already ignored
- PRs should be reviewable: target < 400 changed lines. Split bigger work into multiple PRs.

---

## 8. Troubleshooting

### `ssh -T git@github-wheelchairtaxipro` says `Hi <wrong-account>!`

You added the SSH key to the wrong GitHub account. Fix:
1. Sign into the wrong account → Settings → SSH and GPG keys → delete the key you just added.
2. Sign into the WheelChairTaxiPro-authorized account → add the key there.
3. Re-run `ssh -T git@github-wheelchairtaxipro` to confirm.

### `Permission denied (publickey)` on push or fetch

- Verify the key exists: `Test-Path $HOME\.ssh\id_ed25519_wheelchairtaxipro`
- Verify `~/.ssh/config` has the block from §2.3 (alias, `IdentityFile`, `IdentitiesOnly yes`)
- Verify the public key is registered on the correct GitHub account: https://github.com/settings/keys
- Debug with verbose output: `ssh -vT git@github-wheelchairtaxipro 2>&1 | Select-String -Pattern "Offering|Authenticating|identity|Permission|accepted"`

### `fatal: unable to auto-detect email address`

You didn't set `user.email` — go back to §3.2.

### Commits show up under the wrong name / email on GitHub

- Run `git config --local --list | Select-String "^user\."` — confirm values
- Local values override global values. If you see your personal email, check `git config --global --list`.
- Already-committed history keeps whatever identity it was made with. To fix past commits, `git rebase -i` and amend, or just set identity correctly going forward.

### Push asks for a username and password

Your remote URL is HTTPS, not SSH. Fix:

```powershell
git remote set-url origin git@github-wheelchairtaxipro:WheelChairTaxiPro/git-wheelchairtaxipro1.git
```

### `warning: LF will be replaced by CRLF`

Harmless on Windows. Git is normalizing line endings according to `core.autocrlf`. Nothing to do.

---

## 9. Further reading

| Topic | Document |
|-------|----------|
| Project overview & tech stack | [`README.md`](README.md) |
| Phase 1 build order (what to build first) | [`initial-design/15-phase1-build-order.md`](initial-design/15-phase1-build-order.md) |
| Frontend folder layout & conventions | [`frontend/ARCHITECTURE.md`](frontend/ARCHITECTURE.md) |
| Backend vertical slice architecture | [`initial-design/14-Backend-…_no_mediat_r.md`](initial-design/14-Backend-wheelchair_taxi_pro_backend_plan_v_2_no_mediat_r.md) |
| Hosting strategy (Cloudflare Pages + prerender) | [`docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md`](docs/LearningNotes/hosting-an-seo-first-angular-pwa-on-cloudflare-pages.md) |
| Phase 1 wireframe (UI source of truth) | [`initial-design/13-3-wireframe-phase1.jpeg`](initial-design/13-3-wireframe-phase1.jpeg) |
| Phase 1 frontend scope | [`initial-design/13-1-Frontend-phase1.md`](initial-design/13-1-Frontend-phase1.md) |
| Communication integration (tel / WhatsApp / WeChat) | [`initial-design/WheelchairTaxiPro_Communication.md`](initial-design/WheelchairTaxiPro_Communication.md) |

Welcome aboard. If something in this guide is wrong or unclear, **update it in the same PR** as your first real change — the guide improving with the project is the whole point.
