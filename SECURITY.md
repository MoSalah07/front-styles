# Security policy

## Supported versions

| Version        | Supported                                             |
| -------------- | ----------------------------------------------------- |
| Latest major   | Fixes and security                                    |
| Previous major | Security only, for 6 months after the new major ships |
| Older          | Unsupported                                           |

See [VERSIONING.md](./VERSIONING.md) for the full support window.

## Reporting a vulnerability

**Do not open a public issue.** Use GitHub's private vulnerability reporting on
this repository: **Security → Report a vulnerability**. That opens a private
advisory visible only to the maintainers.

Please include what you can:

- the affected package and version
- a minimal reproduction, or the exact source path
- what an attacker gets out of it

You should get a first response within 5 working days, and an assessment within 10. If a fix is needed, it ships as a patch release on the supported majors, and
the advisory is published once the fix is out.

## Scope

This is a component library: most of its surface is markup and CSS, so the
realistic classes of issue are cross-site scripting through a prop that reaches
`dangerouslySetInnerHTML`, a URL prop that is not scheme-checked, a dependency
advisory, or the CLI writing outside the directory the user pointed it at.

In scope: `@design-eg/tokens`, `@design-eg/ui`, `@design-eg/cli`,
`@design-eg/mcp`, the published registry JSON, and the documentation site.

Out of scope: vulnerabilities in a consuming application's own code, findings
that require a hostile local machine, and automated scanner output with no
demonstrated impact.
