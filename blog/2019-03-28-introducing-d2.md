---
slug: introducing-d2
title: Introducing d2, the DHIS2 CLI
author: Austin McGee
author_url: https://github.com/amcgee
author_image_url: https://avatars.githubusercontent.com/u/947888?s=400&u=2051953d3237171aee830b7b3ee266a10995dcb2&v=4
tags: [cli, developer tools, best practices, style, packages]
---

Today we are excited to announce the stable v1.0 release of `d2`, the [DHIS2 CLI](https://www.npmjs.com/package/@dhis2/cli)!

`d2` is a modular, standardized, and consolidated tool to make developing in the DHIS2 ecosystem as painless as possible.

<!--truncate-->

# What can you do with d2?

There's quite a lot here, and more features coming soon!

I'll dive deeper into some advanced `d2` features in another post, but here's a quick sampling of what you might want to do with it today.

1. `d2 utils uid generate` - this replaces the one function of the old `dhis2-cli` tool, if you don't know what that is you probably don't need it.

2. `d2 style js apply --all --no-stage` - Apply the DHIS2 code-style to all the javascript in a directory without staging the modified files in `git`

3. `d2 cluster up dev --seed` - Create a local docker cluster including a DHIS2 core instance (the latest dev version), an NGINX gateway, and a Postgres database seeded with the [Sierra Leone demodb](https://github.com/dhis2/dhis2-demo-db/tree/master/sierra-leone) This requires [Docker](https://www.docker.com/products/docker-desktop) running locally for now. See [d2-cluster](https://github.com/dhis2/cli/tree/master/packages/cluster) for details, or stay tuned for another post!

4. `d2 style commit check "feat: this is a test"` - check whether or not a string matches the [conventional commits](http://conventionalcommits.org/) specification (this is handy [in a git hook](https://github.com/dhis2/cli/blob/master/package.json#L19)!)

5. `d2 create cli my-cli-module` - Create a new CLI module. This module can be published and run stand-alone, or included as a sub-module of `d2`

6. Explore! You can run `d2 --help` to list all the commands and namespaces available, then `d2 style --help` and all the way down to `d2 style js install --help`.

---

# How do you install it?

The pre-requisites for `d2` are [nodejs](https://nodejs.org/en/download/) and the package manager [yarn](https://yarnpkg.com/lang/en/docs/install/).

```shell
> yarn global add @dhis2/cli
> d2 --help
d2 <command>

Commands:
  d2 app                   Front-end application and library commands
  d2 cluster               Manage DHIS2 Docker clusters             [aliases: c]
  d2 create <type> [name]  Create various DHIS2 components from templates
  d2 style                 DHIS2 programmatic style for commit msgs/code
                                                                    [aliases: s]
  d2 utils                 Utils for miscellaneous operations
  d2 debug                 Debug local d2 installation

Options:
  --version   Show version number                                      [boolean]
  --config    Path to JSON config file
  -h, --help  Show help                                                [boolean]
```

If you just want to run a single command without installing `d2` globally, you can use `npx`, for instance both commands above are equivalent to `npx @dhis2/cli --help`

**NB** installation with `npm install -g @dhis2/cli` should also work but yarn is recommended.

**NB** there is an open issue tracking support for zero-dependency binary executables (which wouldn't require `node` be pre-installed).

If either installing `d2` with `npm` or just by downloading an executable appeals to you, please indicate your support on [issue #34](https://github.com/dhis2/cli/issues/34) in the `cli` repository

---

# What about other command-line utilites?

The goal of `@dhis2/cli` is to consolidate and standardize the various fragmented command-line utilities in the `dhis2` ecosystem. If possible, other tools which can be implemented as Node.js scripts should be ported to `d2` namespaces moving forward.

As an initial example of this transition, the code-style and packages tools introduced by Viktor Varland [in an earlier post](./packages-and-conventions) are now deprecated in favor of their `d2` equivalents (`d2 style` instead of `code-style`. Yarn workspaces should be used instead of `packages` for simple mono-repo support, and `d2 utils release` replaces `packages release`, although this should only need to run in CI environments like [travis](https://www.travis-ci.com))

**Note** The `packages` command `packages exec` which multiplexes commands across a mono-repo has not yet been ported to `d2`, so you might still need to use `packages` to run i.e. `packages exec yarn build`

---

# Contributing and building your own CLI modules

Please contribute! The CLI is modular in design, so it's built to be easily extensible and repurposed. Here's how you can help `d2`, and how `d2` can help you:

1. If you find a bug, report it or help fix it!
2. If you are familiar with command-line tools used in the DHIS2 ecosystem, particularly in development environments, and you think it might belong in the DHIS2 cli please [let us know](https://github.com/dhis2/cli/issues/new)
3. If you'd like to contribute to CLI development yourself, check it out [on GitHub](https://github.com/dhis2/cli)
4. If you want to build a DHIS2 command-line tool with Node, whether or not it fits as a command or namespace in `d2`, you can use the `d2 create cli` too which will bootstrap a simple CLI module project. This module will include the dependency [@dhis2/cli-helpers-engine](https://github.com/dhis2/cli-helpers-engine)

## cli-helpers-engine (for curious technical folks)

This helper library provides low-level primitives like:

- `namespace` for declaring groups of commands
- `makeEntryPoint` for turning a command or namespace into an executable program
- `reporter` which supports console output to stderr and stdout at different log levels, including support for `--verbose` and `--quiet` CLI options
- `cache` which is a bit more complex but supports local caching of downloaded files and archives for use in the CLI program. See `d2 debug cache --help` to manage your local cache and the [d2 cluster source](https://github.com/dhis2/cli/tree/master/packages/cluster/src/commands) for an example of the cache in action.
