---
id: contribute-dev-portal
title: Contribute to the Developer Portal
---

Thank you in advance for your contributions! 🙌

Check the information below on how to set up the environment and contribute to the Developer Portal.

The process is a very simple one so we hope to get your contributions on our GitHub repository!

## Fork and Open a Pull Request

First, you will need to [fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the [Developer Portal repository](https://github.com/dhis2/developer-portal) under your GitHub account and propose your changes from there.

This will allow you to commit your proposed changes to a fork of this repository.

It will also create a new branch in your fork, and then you will be able to [create and submit a pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

After you've opened a pull request we will review it, provide feedback if needed and approve it.

:::note
This process is the same if you click on "Edit this page" - a link that can be found at the bottom of most pages on the Developer Portal. We welcome your submissions! 🙏
:::

## Run locally

Clone the repository from your terminal:

```shell
git clone https://github.com/dhis2/developer-portal.git
```

### Installation

You will need to run the following command to install all dependencies:

```shell
yarn install
```

### Local Development

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server:

```shell
yarn start
```

### Build

```shell
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.
