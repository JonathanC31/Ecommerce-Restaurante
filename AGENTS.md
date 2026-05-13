\# AGENTS.md



\## Project rules for AI agents



This repository may be modified by AI-assisted development tools.



\## Safety rules



\- Do not modify files outside this workspace.

\- Do not read or modify `.env`, `.env.\*`, private keys, certificates, keystores, or credentials.

\- Do not run destructive commands.

\- Do not run `git reset --hard`.

\- Do not run `git clean -fdx`.

\- Do not delete directories without explicit user approval.

\- Do not install new dependencies without explicit user approval.

\- Do not make commits unless explicitly requested.

\- Do not push to remote repositories unless explicitly requested.

\- Always explain terminal commands before requesting permission to run them.



\## Workflow rules



Before changing code:



1\. Analyze the project structure.

2\. Identify the stack.

3\. Propose a short plan.

4\. List the files you intend to modify.

5\. Wait for approval.



After changing code:



1\. Summarize changed files.

2\. Explain how to test.

3\. Mention any risks or follow-up work.

4\. Do not commit automatically.



\## Branching rules



\- Work must happen on a feature branch.

\- Never work directly on `main` or `master` unless explicitly allowed.

\- Branch names for AI work should start with `ai/`.



\## Dependency rules



\- Node: ask before modifying `package.json`.

\- Java: ask before modifying `pom.xml` or `build.gradle`.

\- Docker: ask before modifying Dockerfiles or compose files.

\- Database: ask before modifying migrations or schema files.



\## Security-sensitive files



Do not modify or inspect:



\- `.env`

\- `.env.local`

\- `.env.production`

\- `.npmrc`

\- `.pypirc`

\- `application-prod.properties`

\- `application-prod.yml`

\- private keys

\- certificates

\- keystores

\- SSH keys

