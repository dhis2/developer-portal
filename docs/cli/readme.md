---
title: Getting started with the D2 CLI
sidebar_label: Getting Started
slug: "/cli"
---
To get started with the DHIS2 CLI, you need to install it on your machine. The CLI is available as an npm package, and can be installed using either npm or yarn.

To install globally with yarn:
```bash
yarn global add @dhis2/cli
```

Or to install with globally with npm:
```bash
npm install --global @dhis2/cli
```

# Verify that it is available on PATH

```bash
d2 --version
```
This should return the version of the CLI that you have installed, such as `4.2.3`.

## Functionalities
Once you have installed the CLI, you should be able to run the `d2` command in your terminal. This will show you the available commands and options.

There are several sections within the CLI, and each has its own set of commands and options. The sections are:

- [`d2 app`](/docs/app-platform/getting-started): Front-end application and library commands
- [`d2 cluster`](/docs/cli/cluster): Manage DHIS2 Docker clusters.
- `d2 create`: Create various DHIS2 components from templates
- [`d2 style`](cli/style/getting-started): DHIS2 programmatic style for commit messages/code
- [`d2 utils cypress`](/docs/cli/cypress/getting-started): DHIS2 Cypress configuration and utility helper.
- `d2 debug`: Debug local d2 installation.