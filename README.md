# 🚀 Comprehensive CI/CD Pipeline Setup

This repository is a fully functional demonstration of a production-grade CI/CD (Continuous Integration / Continuous Deployment) pipeline. It hosts a simple Express.js application designed specifically to act as an integration target for various DevOps and Automation workflows.

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/jmpangilinan/cicd-practice-app/ci.yml?branch=main&label=CI%20Pipeline&logo=github&style=for-the-badge)
![SonarCloud Quality Gate](https://img.shields.io/sonar/quality_gate/jmpangilinan_cicd-practice-app?server=https%3A%2F%2Fsonarcloud.io&style=for-the-badge&logo=sonarcloud)
![Docker Image Size](https://img.shields.io/docker/image-size/jmpangilinan/cicd-practice-app/latest?style=for-the-badge&logo=docker)

---

## 🏗️ Architecture & Workflows

This project utilizes **GitHub Actions** as its core automation engine, executing four powerful, interconnected workflows:

### 1. 🛡️ Continuous Integration (`ci.yml`)
*Trigger: Pushes to `main` and all Pull Requests*
This is the primary defense mechanism against broken code logic. It runs matrix testing across Node.js versions (18.x and 20.x) and guarantees high code fidelity before any merges are permitted.
- **Linting:** Enforces strict code styling using **ESLint**.
- **Unit & Integration Testing:** Executes test suites using **Jest** and **Supertest** to validate internal module logic and API endpoints. Fails PRs if the global code coverage drops below `80%`.
- **E2E Browser Testing:** Launches Headless Chromium via **Playwright**, navigating through the application frontend to guarantee user-facing UI functions correctly.
- **Static Application Security Testing (SAST):** Uploads coverage maps to **SonarCloud** to detect Bugs, Code Smells, and Hardcoded Secrets. The pipeline is bound by a strict SonarCloud Quality Gate that blocks PRs containing "C" rated logic or vulnerabilities.

### 2. 🐳 Containerization & Registry (`docker.yml`)
*Trigger: Pushes to `main` (Post-Merge)*
Once code officially reaches the production branch, this workflow takes over.
- Builds an optimized, isolated Docker image of the Express.js application using a multi-stage `Dockerfile`.
- Uses `docker login ghcr.io` (via GitHub default secrets) to authenticate against the GitHub Container Registry.
- Pushes the image strictly under the `latest` tag and matches the active commit SHA.

### 3. 🚀 Continuous Deployment (`deploy.yml`)
*Trigger: Successfully completing the `docker.yml` workflow*
This workflow implements true local/server Continuous Deployment using a **Self-Hosted Runner**.
- The job targets a runner sitting physically on a local machine/VM (e.g., `runs-on: self-hosted`).
- It securely pulls the latest Docker image from GHCR using an authenticated Personal Access Token (`CR_PAT`).
- Gracefully shuts down the old application container and spins up the brand-new one on port `3000` with zero-touch deployment.

### 4. 🏷️ Semantic Releasing (`release.yml`)
*Trigger: Manual Workflow Dispatch & Tagging*
This workflow handles the manual cutting of official software versions to maintain a pristine history.
- Prompts the user to specify a semantic `patch`, `minor`, or `major` release.
- Executes `npm version` to bump the `package.json` file in-memory.
- Safely overrides branch protection by pushing the modified version bump commit and the new Git Tag directly to `main` utilizing a scoped Administrator Token.
- Generates a fully automated **Changelog** based on recent commit history and publishes an official GitHub Release.

---

## 🔒 Security & Branch Protection

The `main` branch is entirely locked down using GitHub Branch Protection:
- **No Direct Pushes:** All changes must originate from a dedicated feature branch.
- **Status Checks Required:** The `Lint & Test` job (encompassing ESLint, Jest, Playwright, and SonarCloud) must finish with a `0` exit code before the Merge button unlocks.
- **Bypass Overrides:** Administrator tokens are strictly passed through explicit HTTPS URL injection `https://x-access-token:${CR_PAT}@github.com...` during automated pipeline pushes to override default `GITHUB_TOKEN` branch blocking cleanly.

---

## 🛠️ Technology Stack
- **Backend:** Node.js, Express.js
- **Testing:** Jest, Supertest, Playwright
- **CI/CD:** GitHub Actions, SonarCloud
- **Infrastructure:** Docker, Self-Hosted Runners, GitHub Container Registry (GHCR)

*Built as a functional milestone demonstrating modern software engineering deployment pipelines.*
