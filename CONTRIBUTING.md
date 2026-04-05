# Contributing to NCTIRS

Thank you for your interest in contributing to the **AI-Powered National Security and Smart Policing Intelligence Platform (NCTIRS)**. This document provides guidelines and instructions for contributing in a way that preserves security, reliability, and clarity.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Security Considerations](#security-considerations)
- [Governance & Compliance](#governance--compliance)

## Code of Conduct

By participating in this project, you agree to abide by our community standards.  
If a `CODE_OF_CONDUCT.md` file is present in the repository, please read it before contributing.

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Python 3.9 (for the AI engine components)
- Git

### Local Development Setup

1. **Fork the repository**

   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/NCTIRS.git
   cd NCTIRS
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **(Optional) Set up the Python AI engine**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install -r requirements-local.txt
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open the dashboard**

   Navigate to `http://localhost:3000` in your browser.

## Development Workflow

### Branch Naming Convention

- `feature/` – New features (e.g., `feature/add-risk-heatmap`)
- `fix/` – Bug fixes (e.g., `fix/incident-list-overflow`)
- `docs/` – Documentation changes
- `refactor/` – Code refactoring
- `test/` – Test additions or modifications

### Commit Messages

We recommend following [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

**Examples:**

```text
feat(dashboard): add live incident heatmap
fix(risk-engine): prevent NaN scores on empty dataset
docs(readme): update installation instructions
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code.
- Keep strict type checking enabled.
- Prefer explicit types; avoid `any` whenever possible.

### React Components

- Use functional components with hooks.
- Keep components focused, small, and reusable.
- Follow the existing patterns in the `app` and `components` directories.

### Styling

- Use Tailwind CSS utility classes.
- Follow the design system configured for the project (e.g., Shadcn UI).
- Ensure layouts are responsive and accessible.

### Code Quality

Before submitting changes, run:

```bash
npm run lint
npm run build
```

This helps catch TypeScript and ESLint issues early.

## Pull Request Process

1. **Create a feature branch** from `main`.
2. **Make your changes** following the coding standards above.
3. **Run checks locally**:

   ```bash
   npm run lint
   npm run build
   ```

4. **Update documentation** if your change affects user-facing behavior.
5. **Open a Pull Request** with:
   - A clear, concise title.
   - A description of the problem and the solution.
   - Screenshots for UI changes where helpful.

### PR Requirements

- [ ] Code follows project style guidelines.
- [ ] Self-review completed.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Tests added or updated where applicable.
- [ ] Related issue linked (if applicable).

### Review Process

- PRs require at least one maintainer approval.
- Address all review comments or questions.
- Keep PRs focused and reasonably sized. Large, multi-purpose PRs are harder to review.

## Security Considerations

NCTIRS models **real national security and policing workflows**. Treat it accordingly:

- **Never commit secrets**: API keys, credentials, database URLs with passwords, or real PII.
- **Use mock/synthetic data only**: The repository must not contain real operational data.
- **Follow secure coding practices**: Input validation, least-privilege access, and defense-in-depth.
- **Report vulnerabilities privately**: Follow the process in `SECURITY.md` instead of opening public issues.

## Governance & Compliance

To maintain a high-integrity security posture:

- Critical paths (e.g., `lib/`, `api/`, `ai-models/`) may require review from core maintainers.
- CI enforces:
  - `lint` (ESLint)
  - `build` (Next.js production build)
  - Optional: semantic-release for versioning on `main`
- Branch protection should prevent direct pushes to `main` by non-admins; changes flow through PRs.

If you have questions about how best to contribute:

1. Check existing issues and discussions.
2. Open a new issue with the "question" label.
3. Contact the maintainers if your question relates to security or governance.

---

Thank you for contributing to a safer, more intelligent national security and smart policing platform. 🇰🇪

