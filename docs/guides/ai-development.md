---
id: ai-development
title: AI-assisted App Development
sidebar_label: AI-assisted Development
---

:::warning
AI tooling is moving fast and is still highly experimental. The recommendations on this page are a snapshot of what works as of June 22, 2026. Use AI agents with caution and validate every change they make to your code.
:::

You have an idea for a DHIS2 app and want to try building it with an AI coding agent. This guide is for DHIS2 developers and implementers who are comfortable in a terminal, and much of it is useful whether you write code daily or not. Non-technical implementers can use these tools to build quality prototypes, but at the time of publishing the DHIS2 development team's stance is that a human developer is necessary to make secure and sustainable production-ready apps. Treat this as a way to explore an idea and iterate against a DHIS2 instance, not a path to a production-ready app.

A short warning before you start: general-purpose AI agents are not yet reliable to work out of the box on DHIS2. They tend to reach for outdated information, hallucinate Web API endpoints, and use generic patterns instead of DHIS2 App Platform conventions. The DHIS2-maintained [`ai-devtools`](https://github.com/dhis2/ai-devtools) project was created to close this gap. See the May 2026 developer meetup post about [introducing the related devotta-maintained skill](https://community.dhis2.org/t/may-2026-developer-meetup-ai-agent-skill-for-dhis2-app-development-and-other-tips/72140). The rest of this page is about how to use AI-agents, and how to handle the parts the agent still gets wrong.

The advice below is opinionated and shaped by hands-on use of Claude Code together with the DHIS2 app development skill, since that is the combination we have the most experience with. Other agents such as Cursor, GitHub Copilot, Codex, or open-source tools like Aider can do similar jobs. Some commands and examples below use syntax particular to Claude Code, but all major agents share similar tools, and the principles outlined here are common to all of them.

One recommendation worth stating up front for frontend DHIS2 development is to have the AI agent use TypeScript. AI agents lean heavily on type checking as a feedback loop, especially in React. Having types in your project makes the agent more predictable. It can catch its own mistakes, like wrong props or bad API shapes, by running the type checker after each change instead of discovering them at runtime. If you use the DHIS2 skill mentioned below, it can scaffolds a TypeScript app for you.

## Before you start

You need a working development environment. If you have not set one up yet, follow these first:

-   [Initial Setup](/docs/quickstart): install the tools you need
-   [Creating a DHIS2 Web app](/docs/quickstart/quickstart-web): scaffold a project with `create-app`
-   [Spin up a local DHIS2 instance](/docs/guides/spin-up-local-instance): so your app has something to talk to

You also need a scaffolded project to work in, and there are two ways to get one. If you plan to use the DHIS2 app development skill (below), the skill scaffolds the project for you as part of its workflow. This is the easier path and a good first taste of what skills do. Otherwise, scaffold it yourself with [`create-app`](/docs/quickstart/quickstart-web) before bringing in the agent. Either way, do not let a general-purpose agent generate the project from scratch, which is one of the easier ways to end up with a non-standard structure.

## Pick a coding agent

A coding agent is a tool that can read and edit files in your project, run commands, and iterate based on what it sees. Several options exist, with different trade-offs:

-   [Claude Code](https://docs.claude.com/en/docs/claude-code/overview): a CLI agent from Anthropic that runs in your terminal and reads from a project directory. This is the agent the DHIS2 skill is primarily tested with.
-   [Cursor](https://docs.cursor.com/): an IDE that wraps editing and chat together, with built-in agent modes.
-   [GitHub Copilot](https://docs.github.com/en/copilot): available as an inline assistant in many editors and as a more autonomous agent mode.
-   [OpenAI Codex](https://developers.openai.com/codex/cli): a terminal-first CLI agent from OpenAI that reads your project, proposes changes, and runs commands behind an approval workflow.
-   [Aider](https://aider.chat/): an open-source, terminal-based AI partner that works with almost any model (including local ones) and can commit changes to git.

For occasional questions or quick lookups, a chat assistant in the browser is fine. For real feature work, use an agent that has direct access to your files so it can read what is already there before suggesting changes.

## Install the DHIS2 app development skill

A _skill_ is a small package of instructions and reference material that you install into a coding agent. When invoked, it gives the agent focused knowledge of a topic so it stops guessing. See Anthropic's [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) for a fuller description of the format.

Install the DHIS2-maintained skill from [`dhis2/ai-devtools`](https://github.com/dhis2/ai-devtools). The `dhis2-apps` skill is published as `@dhis2/skill-dhis2-apps`:

```sh
# Pick from all skills in the repo (interactive prompt)
npx skills add dhis2/ai-devtools

# Or install the app development skill directly by name
npx skills add dhis2/ai-devtools --skill dhis2-apps
```

> **Attribution** — `@dhis2/skill-dhis2-apps` is based on [dhis2-app-skills](https://github.com/devotta-labs/dhis2-app-skills) by [Eirik Haugstulen](https://github.com/eirikur-haugstulen) at [Devotta Labs](https://github.com/devotta-labs).

In principle the agent loads the skill automatically when your request looks like DHIS2 work, since the skill's description tells it when to apply. In practice we have found this does not always trigger, so the reliable approach is to invoke it explicitly at the start of a DHIS2 task:

```
/dhis2-apps
```

The skill encodes the conventions of the [DHIS2 App Platform](/docs/app-platform/getting-started), the [App Runtime](/docs/app-runtime/getting-started) data layer, and the [`@dhis2/ui` component library](/docs/tutorials/ui-library), so the agent reaches for the right tools instead of writing its own. It is opinionated by design: rather than just describing the platform, it pins down a specific, vetted setup, reflecting the choices of an experienced DHIS2 developer who works closely with AI agents. That means some of the patterns it enforces are stronger than the platform defaults. A few worth knowing about:

-   It scaffolds an opinionated stack: TypeScript, `pnpm`, and Vite, with React Router and TanStack Query v4 wired in.
-   It has the agent fetch data through a custom `useApiDataQuery` wrapper rather than calling `useDataQuery` from the App Runtime directly. It also reads the code in the DHIS2 core to understand the workings of the API.
-   It enforces conventions you would otherwise have to remember yourself: React 18 only, `@dhis2/ui` for all components, `i18n.t()` for user-facing strings, `displayName` for metadata, CSS Modules with DHIS2 design tokens, and a lint and type-check pass after each change.

This is part of why a skill helps. Left to its own devices, and without you spelling everything out, an agent tends to fall back on whatever its training data assumes, which for DHIS2 is often outdated: `yarn` classic instead of `pnpm`, deprecated endpoints, generic React patterns. A skill pins down the steps that matter, so the agent behaves more consistently from one run to the next.

:::note
The install script sometimes places the skill in `.agents/` even when your agent reads from `.claude/` (or vice versa). If `/dhis2-apps` is not recognised, move the skill directory to the location your agent expects.
:::

### Other skills worth knowing

You can install more than one skill, and combining a domain skill with a general-purpose one can help. One example is [`grill-me`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), which makes the agent interrogate your assumptions before it implements anything. It is a useful counterweight to an agent that would otherwise take your phrasing at face value and run with the first interpretation.

## Work in small steps

The most common failure mode is to write one long prompt that describes a whole feature, run it, and then spend an hour patching the result. Working in smaller increments avoids that:

1. Ask the agent to outline the change in plain words. Do not let it write code yet.
2. Read the outline and adjust it. Decide what is in scope for this step and what is not.
3. Let the agent make the smallest useful change, like implementing one single component or a query.
4. Run the app and check that the change works, then move to the next step.

A useful pattern at the start of a task is to invoke `/dhis2-apps` and other skills you might have installed, then ask for a plan before any code: _"Do not write code yet. Describe the smallest change that would add X and list the files you would touch. Use grill-me to challenge my assumptions first."_

When you do ask for code, be specific about which DHIS2 libraries to use. If you are using the skill, it already enforces the platform's conventions, including its own data-fetching wrapper, so you can mostly describe what you want. Without the skill, name the [`@dhis2/ui`](/docs/tutorials/ui-library) component (`DataTable`, `Button`, `AlertBar`) and the [App Runtime](/docs/app-runtime/getting-started) hook (`useDataQuery`, `useDataMutation`) you want. Otherwise the agent may default to outdated structures or pull in unrelated libraries, not because it always does, but because there is no reason for it not to. Being explicit is what gets you DHIS2-shaped output reliably.

If you are not sure which component or hook is right, the [UI Library tutorial](/docs/tutorials/ui-library), the [App Runtime guides](/docs/app-runtime/getting-started), and the [Data Query Playground](/docs/guides/query-playground) are good places to look before prompting.

## Managing the session

A common piece of older advice was to start a new chat for every feature. The picture is more nuanced now. Modern coding agents carry very large context windows (Claude Sonnet 4.6 in Claude Code has a [1 million token context window](https://www.anthropic.com/news/claude-sonnet-4-6)) and are good at long-context retrieval. A single session can comfortably span a substantial chunk of work. What matters is keeping the context _clean_, not necessarily _short_.

As a conversation grows, attention spreads thinner and earlier instructions, including your skill, start to lose their effect. This is the phenomenon called _context rot_. See MindStudio's [practical overview](https://www.mindstudio.ai/blog/context-rot-ai-coding-agents-explained) and the original [_Lost in the Middle_](https://aclanthology.org/2024.tacl-1.9/) paper for the mechanics.

[Anthropic's rule of thumb for Claude Code](https://claude.com/blog/using-claude-code-session-management-and-1m-context) is: when you start a new _task_, start a new session. A related cluster of work, such as implementing a feature and then writing its docs, is fine to keep together. Switching to an unrelated task is the signal to reset.

In practice you have more than one tool. The conceptual moves are the same across agents; only the commands differ.

| Situation | What to do | Why |
| --- | --- | --- |
| Same task, context still relevant | Keep going | What is loaded is still load-bearing |
| Agent went down a wrong path | Roll back to before the detour | Drop the failed attempt; keep the useful file reads |
| Mid-task but the session feels bloated | Summarise and compact the context | The summary replaces the bloat |
| Genuinely new task | Clear the context and start fresh | You decide what carries forward |
| Next step produces output you only need the conclusion of | Delegate it to a subagent | Intermediate output stays in the child context |

How each agent exposes these actions differs, and the commands change often, so treat this as a starting point and check the agent's own docs:

| Action | Claude Code | Cursor | GitHub Copilot | Codex CLI | Aider |
| --- | --- | --- | --- | --- | --- |
| Clear / start fresh | `/clear` | New Chat (Cmd/Ctrl+N) | New Chat | `/clear` or `/new` | `/clear` |
| Roll back a failed attempt | `/rewind` (Esc Esc) | Restore Checkpoint | Restore Checkpoint, or Undo Last Edit | none (use git) | `/undo` |
| Summarise / compact context | `/compact` | `/summarize` (also automatic) | `/compact` (also automatic) | `/compact` | none (manage manually with `/drop`, `/tokens`) |
| Delegate to a subagent | subagents | Cloud Agents | Copilot coding agent | `/agent` | none |

The reliable signal to reset or compact is the agent's own behaviour. Watch for:

-   Suggestions that repeat an approach already tried earlier in the session
-   References to file paths, function names, or variables that no longer exist
-   Contradictions with earlier decisions, without acknowledging them
-   Hallucinated imports or methods
-   Noticeably shallower or hedgier responses

When you see two or three of these together, that is the moment to compact, clear, or delegate to a subagent.

A few habits also help across any session:

-   Avoid pasting whole files into the prompt. The agent can read them itself when needed.
-   If a chat has become long but you want to keep going, ask the agent to summarise the decisions so far before you compact or open a fresh session.

The agent will follow your context-management instructions when you ask, but it won't save you from yourself. Once a chat is running, it has no incentive to suggest you leave it, so the discipline has to come from you, or from setup you do once at the start.

### Document your workflow in an instructions file

Repeated instructions belong in an agent instructions file at the root of your project. This contains which libraries to use, the project layout, and the commands to build and test. Most agents read such a file automatically at the start of every session (Claude Code uses `CLAUDE.md`, Cursor uses its rules files, and several tools read `AGENTS.md`), so it survives starting a fresh session and does not degrade the way mid-conversation instructions do. Start small and expand it as you notice the agent repeating the same mistakes, and ask the agent to draft or update it when that helps.

## Review what the agent changes

Treat AI output as a pull request from someone who has never worked on DHIS2 before, and go through all of it yourself. A good rule of thumb is to manually review every AI-suggested change before you approve it, and never let an agent make unsupervised changes to your code base. Before you keep a change:

-   Do the commits yourself, rather than letting the agent commit for you. That keeps you reading the full diff, not just the file you asked it to edit, and owning what lands in the history.
-   Run the app locally and click through the affected screens (see [Debug common development errors](/docs/guides/debug-instance) if something refuses to load).
-   Run lint and formatting checks. The [Code style guide](/docs/guides/code-style) describes the project conventions.
-   Check that imports and dependencies are real and necessary.
-   Check that Web API endpoints exist for the DHIS2 version you are targeting. The [Web API documentation](https://docs.dhis2.org/) and the [OpenAPI spec](https://dhis2.stoplight.io/docs/dhis2/) are the references to compare against.
-   Ask the agent to write tests for the change, and review those too. A generated test can pass by asserting the wrong thing.
-   Be transparent about AI use. Note where AI-generated code went into a change so teammates and reviewers know. For example, you can add a Co-Authored-By trailer to a git commit mesage to reference your AI agent.

## Sensitive data

DHIS2 is used to manage health data and other sensitive information, so where your prompts go and how they are stored matters. Before sending anything DHIS2-derived through an external service, check the relevant policies, both your organisation's and the AI provider's. The [DHIS2 & AI](https://dhis2.org/ai/) page is a useful starting point alongside your own organisation's rules. Policies vary substantially between services and plans and change often, so do your own research on the current terms rather than relying on a general reputation for being safe.

A few things worth understanding:

-   Consumer and free tiers increasingly train on your conversations by default unless you opt out, and may retain that data for years. Several major providers have moved in this direction.
-   Even if business, enterprise, and API plans often advertise stronger protections, you should still treat it with caution. Whether your prompts are used for training, how long data is retained, and who can access it all depend on the specific contract and settings. Research the exact terms that apply to you before sending anything sensitive.
-   Locally hosted models keep data on your own infrastructure.
-   If you handle personal data of EU/EEA residents, GDPR applies whichever tool you pick. It affects what you may send to a third-party service, where that data is processed and stored, and what agreements (such as a data processing agreement) you need in place. Your organisation's data-protection rules take precedence over any convenience.

Whatever plan you are on, a few rules are worth keeping:

-   Do not paste real patient records, identifying information, or full database exports into a prompt unless you have explicitly cleared this against your organisation's policy.
-   Do not paste production credentials, API tokens, or `.env` contents. If the agent needs to know that a variable exists, tell it the name, not the value.
-   Use the [DHIS2 play instances](https://im.dhis2.org/public/instances), a demo database (such as Sierra Leone or HMIS), or anonymised local data when you need realistic-looking examples.

## When the agent gets DHIS2 wrong

A few things go wrong often enough to recognise on sight:

-   _Made-up Web API endpoints_ or endpoints from older DHIS2 versions. Compare against the [Web API docs](https://docs.dhis2.org/) and confirm the resource and parameters exist on your version.
-   _Plain HTML where [`@dhis2/ui`](/docs/tutorials/ui-library) should be used._ Point the agent at the [UI Library tutorial](/docs/tutorials/ui-library) and the [component recipes](/docs/ui/recipes), and name the component you want.
-   _Incorrect [App Runtime](/docs/app-runtime/getting-started) usage_: hand-rolled `fetch` calls, missing query variables, confusing queries with mutations. The [App Runtime guides](/docs/app-runtime/getting-started) and the [Data Query Playground](/docs/guides/query-playground) are the references to lean on.
-   _Custom routing or state management_ that fights with the [App Platform](/docs/app-platform/getting-started) shell. Push back and ask the agent to use what the platform already provides.
-   _Outdated package manager assumptions._ Older training data assumes `yarn` classic. The current recommendation is `pnpm`. See [Creating a DHIS2 Web app](/docs/quickstart/quickstart-web).

When you have something that works and you are ready to share it, the [App Hub guidelines](/docs/guides/apphub-guidelines) cover what is expected from a finished app.

## Rules of thumb

A short list to keep nearby once you are working.

-   If you use the [DHIS2 skill](https://github.com/dhis2/ai-devtools), the agent can scaffold the project for you following current best practice. If you are not, scaffold it yourself with [`create-app`](/docs/quickstart/quickstart-web) rather than letting the agent improvise.
-   Invoke the [DHIS2 skill](https://github.com/dhis2/ai-devtools) with `/dhis2-apps` at the start of a DHIS2 task.
-   Plan in words before letting the agent edit code.
-   Make one small change at a time and verify it before moving on.
-   Name the [`@dhis2/ui`](/docs/tutorials/ui-library) component and [App Runtime](/docs/app-runtime/getting-started) hook you want.
-   Read every diff before keeping it, do the commits yourself, and ask for tests (lint with [`d2 style`](/docs/guides/code-style), then run the app).
-   Be transparent about AI use.
-   Document your workflow in an agent instructions file (such as `CLAUDE.md` or `AGENTS.md`) so repeated instructions carry across sessions.
-   Start a new session when you switch to an unrelated task, and clear or compact the context when you spot [context rot](https://www.mindstudio.ai/blog/context-rot-ai-coding-agents-explained) symptoms (like repeated suggestions or hallucinated names).
- AI agents can often leave outdated code in your project, especially if you go through many iterations in each session. Make sure to clean up any unused code. 
-   Check the data policy of the AI service you are using before sending anything DHIS2-derived through it (see [DHIS2 & AI](https://dhis2.org/ai/)).

## Further reading

-   [DHIS2 & AI](https://dhis2.org/ai/): DHIS2's overview of AI across the platform
-   [dhis2/ai-devtools](https://github.com/dhis2/ai-devtools): the recommended agent skill (`@dhis2/skill-dhis2-apps`), with its own README and changelog. Based on [dhis2-app-skills](https://github.com/devotta-labs/dhis2-app-skills) by Eirik Haugstulen at Devotta Labs.
-   [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview): what a skill is and how the format works
-   [Blog post about developing a DHIS2 app using AI](https://developers.dhis2.org/blog/2026/05/my-first-app)
