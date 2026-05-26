---
id: ai-development
title: AI-assisted App Development
sidebar_label: AI-assisted Development
---

:::warning
AI tooling is moving fast and is still highly experimental. The recommendations on this page are a snapshot of what works at the time of writing. Use AI agents with caution and validate every change they make to your code.
:::

So you have an idea for a DHIS2 app and you want to use an AI coding agent to try it out? This guide walks you through getting started. It is aimed at DHIS2 developers and implementers who are comfortable in a terminal and want to prototype an app idea with an AI agent. Think of it as a way to explore an idea, not a path to a production-ready app, but something you can run against a DHIS2 instance and iterate on.

A short warning before you start: general-purpose AI agents are not yet reliable to work out of the box on DHIS2. They tend to reach for outdated information, hallucinate Web API endpoints, and use generic patterns instead of DHIS2 App Platform conventions. The [Devotta](https://devotta.no/)-maintained [`dhis2-app-skills`](https://github.com/devotta-labs/dhis2-app-skills) project was created to close this gap. See the May 2026 developer meetup post [introducing the skill](https://community.dhis2.org/t/may-2026-developer-meetup-ai-agent-skill-for-dhis2-app-development-and-other-tips/72140) for the motivation. The rest of this page is about how to use skills, and how to handle the parts the agent still gets wrong.

The advice below is opinionated and shaped by hands-on use of Claude Code together with the DHIS2 app development skill, since that is the combination we have the most experience with. Other agents such as Cursor or GitHub Copilot can do the same job, and the underlying ideas (working in small steps, prompting narrowly, managing your context, and reviewing everything) apply to all of them. The specific commands and recommendations below are written with Claude Code in mind.

## Before you start

You need a working development environment. If you have not set one up yet, follow these first:

-   [Initial Setup](/docs/quickstart): install the tools you need
-   [Creating a DHIS2 Web app](/docs/quickstart/quickstart-web): scaffold a project with `create-app`
-   [Spin up a local DHIS2 instance](/docs/guides/spin-up-local-instance): so your app has something to talk to

Scaffold your project with `create-app` before bringing in the agent. Letting the agent generate the project from scratch is one of the easier ways to end up with a non-standard structure.

## Pick a coding agent

A coding agent is a tool that can read and edit files in your project, run commands, and iterate based on what it sees. Several options exist, with different trade-offs:

-   [Claude Code](https://docs.claude.com/en/docs/claude-code/overview): a CLI agent from Anthropic that runs in your terminal and reads from a project directory. This is the agent the DHIS2 skill is primarily tested with.
-   [Cursor](https://docs.cursor.com/): an IDE that wraps editing and chat together, with built-in agent modes.
-   [GitHub Copilot](https://docs.github.com/en/copilot): available as an inline assistant in many editors and as a more autonomous agent mode.

For occasional questions or quick lookups, a chat assistant in the browser is fine. For real feature work, use an agent that has direct access to your files so it can read what is already there before suggesting changes.

## Install the DHIS2 app development skill

A _skill_ is a small package of instructions and reference material that you install into a coding agent. When invoked, it gives the agent focused knowledge of a topic so it stops guessing. See Anthropic's [Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) for a fuller description of the format.

Install the [Devotta](https://devotta.no/)-maintained skill from [devotta-labs/dhis2-app-skills](https://github.com/devotta-labs/dhis2-app-skills):

```sh
npx skills add devotta-labs/dhis2-app-skills
```

Then invoke it inside your agent at the start of each new chat:

```
/dhis2-app-development
```

The skill provides curated guidance for the [DHIS2 App Platform](/docs/app-platform/getting-started), the [App Runtime](/docs/app-runtime/getting-started) data layer, and the [`@dhis2/ui` component library](/docs/tutorials/ui-library), so the agent uses the right tools instead of writing its own.

:::note
The install script sometimes places the skill in `.agents/` even when your agent reads from `.claude/` (or vice versa). If `/dhis2-app-development` is not recognised, move the skill directory to the location your agent expects.
:::

### Other skills worth knowing

You can install more than one skill, and combining a domain skill with a general-purpose one can help. One example is [`grill-me`](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md), which makes the agent interrogate your assumptions before it implements anything. It is a useful counterweight to an agent that would otherwise take your phrasing at face value and run with the first interpretation.

## Work in small steps

The most common failure mode is to write one long prompt that describes a whole feature, run it, and then spend an hour patching the result. Working in smaller increments avoids that:

1. Ask the agent to outline the change in plain words. Do not let it write code yet.
2. Read the outline and adjust it. Decide what is in scope for this step and what is not.
3. Work out the spec of the application with the agent before having it write any code.
4. Let the agent make the smallest useful change: one component, one query, one mutation.
5. Run the app and check that the change works.
6. Move to the next step.

A useful prompt at the start of a task is something like: _"Do not write code yet. Describe the smallest change that would add X, and list the files you would touch."_

When you do ask for code, be specific about which DHIS2 libraries to use. Name the [`@dhis2/ui`](/docs/tutorials/ui-library) component (`DataTable`, `Button`, `AlertBar`) and the [App Runtime](/docs/app-runtime/getting-started) hook (`useDataQuery`, `useDataMutation`). If you do not, the agent may default to plain HTML or pull in unrelated libraries, not because it always does, but because there is no reason for it not to. Being explicit is what gets you DHIS2-shaped output reliably.

If you are not sure which component or hook is right, the [UI Library tutorial](/docs/tutorials/ui-library), the [App Runtime guides](/docs/app-runtime/getting-started), and the [Data Query Playground](/docs/guides/query-playground) are good places to look before prompting.

## Managing the session

A common piece of older advice was to start a new chat for every feature. The picture is more nuanced now. Modern coding agents carry very large context windows (Claude Sonnet 4.6 in Claude Code has a [1 million token context window](https://www.anthropic.com/news/claude-sonnet-4-6)) and are state-of-the-art at long-context retrieval. A single session can comfortably span a substantial chunk of work. What matters is keeping the context _clean_, not necessarily _short_.

As a conversation grows, attention spreads thinner and earlier instructions, including your skill, start to lose their effect. This is the phenomenon called _context rot_. See MindStudio's [practical overview](https://www.mindstudio.ai/blog/context-rot-ai-coding-agents-explained) and the original [_Lost in the Middle_](https://aclanthology.org/2024.tacl-1.9/) paper for the mechanics.

[Anthropic's rule of thumb for Claude Code](https://claude.com/blog/using-claude-code-session-management-and-1m-context) is: when you start a new _task_, start a new session. A related cluster of work, such as implementing a feature and then writing its docs, is fine to keep together. Switching to an unrelated task is the signal to reset.

In practice you have more than one tool:

| Situation                                                      | Try                 | Why                                                 |
| -------------------------------------------------------------- | ------------------- | --------------------------------------------------- |
| Same task, context still relevant                              | Just continue       | What is loaded is still load-bearing                |
| Agent went down a wrong path                                   | `/rewind` (Esc Esc) | Drop the failed attempt; keep the useful file reads |
| Mid-task but the session feels bloated                         | `/compact <hint>`   | The agent summarises; you can steer it with a hint  |
| Genuinely new task                                             | `/clear`            | You decide what carries forward                     |
| Next step will generate output you only need the conclusion of | Subagent            | Intermediate output stays in the child context      |

The reliable signal to reset or compact is the agent's own behaviour, not a clock or a message count. Watch for:

-   Suggestions that repeat an approach already tried earlier in the session
-   References to file paths, function names, or variables that no longer exist
-   Contradictions with earlier decisions, without acknowledging them
-   Hallucinated imports or methods
-   Noticeably shallower or hedgier responses

When you see two or three of these together, that is the moment to `/compact`, `/clear`, or delegate to a subagent.

A few habits also help across any session:

-   Avoid pasting whole files into the prompt. The agent can read them itself when needed.
-   If a chat has become long but you want to keep going, ask the agent to summarise the decisions so far before you `/compact` or open a fresh session.

It is important to be mindful that the agent will follow your context-management principles when you ask it to, but it won't usually save you from yourself. The discipline has to come from you, or from setup you do once at the start. Once a chat is running, the agent has no strong incentive to suggest you leave it.

## Review what the agent changes

Treat AI output as a pull request from someone who has never worked on DHIS2 before. Before you keep a change:

-   Read the full diff, not just the file you asked it to edit.
-   Run the app locally and click through the affected screens (see [Debug common development errors](/docs/guides/debug-instance) if something refuses to load).
-   Run lint and formatting checks. The [Code style guide](/docs/guides/code-style) describes the project conventions.
-   Check that imports and dependencies are real and necessary.
-   Check that Web API endpoints exist for the DHIS2 version you are targeting. The [Web API documentation](https://docs.dhis2.org/) and the [OpenAPI spec](https://dhis2.stoplight.io/docs/dhis2/) are the references to compare against.

## Sensitive data

DHIS2 is used to manage health data and other sensitive information. Data-handling policies vary substantially between AI services and plans, so the right answer depends on what you are using:

-   Most major commercial paid plans (for example, Anthropic's [Team, Enterprise, and API plans](https://privacy.claude.com/en/articles/10023548-how-long-do-you-store-my-data)) do not use your messages to train models by default and offer stronger retention controls.
-   Free and consumer tiers vary more, and some do use messages for service improvement unless you opt out.
-   Locally hosted models keep data on your own infrastructure.

Even with a well-protected plan, a few rules are worth keeping:

-   Do not paste real patient records, identifying information, or full database exports into a prompt unless you have explicitly cleared this against your organisation's policy.
-   Do not paste production credentials, API tokens, or `.env` contents. If the agent needs to know that a variable exists, tell it the name, not the value.
-   Use the [play instances](https://im.dhis2.org/public/instances) or anonymised local data when you need realistic-looking examples.
-   Check the relevant policies before sending DHIS2-derived data through any external service. The [DHIS2 & AI](https://dhis2.org/ai/) page is a useful starting point alongside your organisation's own rules.

## When the agent gets DHIS2 wrong

A few things go wrong often enough to recognise on sight:

-   _Made-up Web API endpoints_ or endpoints from older DHIS2 versions. Compare against the [Web API docs](https://docs.dhis2.org/) and confirm the resource and parameters exist on your version.
-   _Plain HTML where [`@dhis2/ui`](/docs/tutorials/ui-library) should be used._ Point the agent at the [UI Library tutorial](/docs/tutorials/ui-library) and the [component recipes](/docs/ui/recipes), and name the component you want.
-   _Incorrect [App Runtime](/docs/app-runtime/getting-started) usage_: hand-rolled `fetch` calls, missing query variables, confusing queries with mutations. The [App Runtime guides](/docs/app-runtime/getting-started) and the [Data Query Playground](/docs/guides/query-playground) are the references to lean on.
-   _Custom routing or state management_ that fights with the [App Platform](/docs/app-platform/getting-started) shell. Push back and ask the agent to use what the platform already provides.
-   _Outdated package manager assumptions._ Older training data assumes `yarn` classic. The current recommendation is `pnpm`. See [Creating a DHIS2 Web app](/docs/quickstart/quickstart-web).

When you have something that works and you are ready to share it, the [App Hub submission guide](/docs/guides/submit-apphub) and the [App Hub guidelines](/docs/guides/apphub-guidelines) cover what is expected from a finished app.

## Rules of thumb

A short list to keep nearby once you are working.

-   Scaffold the project with [`create-app`](/docs/quickstart/quickstart-web), not with the agent.
-   Invoke the [DHIS2 skill](https://github.com/devotta-labs/dhis2-app-skills) at the start of every new chat.
-   Plan in words before letting the agent edit code.
-   Make one small change at a time and verify it before moving on.
-   Name the [`@dhis2/ui`](/docs/tutorials/ui-library) component and [App Runtime](/docs/app-runtime/getting-started) hook you want.
-   Read every diff before keeping it (lint with [`d2 style`](/docs/guides/code-style), then run the app).
-   Start a new session when you switch to an unrelated task, and reach for `/compact` or `/clear` when you spot [context rot](https://www.mindstudio.ai/blog/context-rot-ai-coding-agents-explained) symptoms (repeated suggestions, hallucinated names, contradictions).
-   Check the data policy of the AI service you are using before sending anything DHIS2-derived through it (see [DHIS2 & AI](https://dhis2.org/ai/)).

## Further reading

-   [DHIS2 & AI](https://dhis2.org/ai/): DHIS2's overview of AI across the platform
-   [devotta-labs/dhis2-app-skills](https://github.com/devotta-labs/dhis2-app-skills): the recommended agent skill, with its own README and changelog
-   [Anthropic Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview): what a skill is and how the format works
