# Security Policy

## Supported Versions

| Version | Supported        |
|--------|------------------|
| 1.x    | ✅                |
| < 1.0  | ❌                |

## Reporting a Vulnerability

The **NSSPIP platform** is modeled as a critical national security and smart policing application.  
We take security vulnerabilities extremely seriously.

### How to Report

**Do not** report security vulnerabilities through public GitHub issues or pull requests.

Instead, please report them privately:

1. **Email**: Contact the maintainers (see GitHub profile or project metadata) with details.
2. **GitHub Security Advisories**: Use the “Report a vulnerability” option in the repository’s **Security** tab.

### What to Include

- A clear description of the vulnerability.
- Steps to reproduce the issue.
- The potential impact (e.g., data exposure, privilege escalation, disruption).
- Any suggested mitigations or fixes, if you have them.

### Response Timeline (Target)

| Stage            | Timeline         |
|------------------|------------------|
| Initial response | Within 24 hours  |
| Status update    | Within 72 hours  |
| Resolution goal  | 7–14 days (severity dependent) |

### What to Expect

1. **Acknowledgment** – We confirm receipt of your report.
2. **Assessment** – We investigate and prioritize based on severity and impact.
3. **Resolution** – We develop, test, and deploy a fix.
4. **Disclosure** – We coordinate public disclosure timing with you, where appropriate.

## Security Best Practices for Contributors

When contributing to NSSPIP:

- **Never commit credentials or secrets** (API keys, database URLs with passwords, tokens).
- **Never include real operational data** – use mock or synthetic datasets only.
- **Avoid logging sensitive information** such as full names, ID numbers, or raw GPS traces linked to individuals.
- **Keep dependencies updated** and avoid introducing unmaintained or risky packages.
- **Evaluate security impact** of changes that touch authentication, authorization, data access, or audit logging.

## Scope

This security policy covers:

- The NSSPIP codebase.
- Associated documentation and configuration files.
- Build and deployment automation (e.g., GitHub Actions workflows).

## Recognition

We appreciate responsible security research.  
With your permission, we may acknowledge valid vulnerability reporters in future security notes or release documentation.

---

*NSSPIP is currently a demonstration and research platform. A production deployment should be accompanied by formal security reviews, monitoring, and incident response processes managed by the operating agency.*

