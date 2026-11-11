# Contribute to the Developer Portal

Check the information below on how to set up the environment and contribute.

## Fork and Open a Pull Request

Fork the repository under your account and propose your changes from there.

This will allow you to commit your proposed changes to a fork of this repo. It will also create a new branch in your fork, and then you will be able to submit a pull request.

## Run locally

Clone the repository:

`git clone https://github.com/dhis2/developer-portal.git`

### Installation

```console
yarn install
```

### Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### LLM-friendly output

The build also generates files for LLMs and AI coding tools (see [src/plugins/llms](src/plugins/llms)), but only in `yarn build`, not in `yarn start`:

-   `/llms.txt`: an index of all pages following the [llms.txt](https://llmstxt.org) convention
-   `/llms-full.txt`: all docs pages in a single Markdown file, plus `/llms-full-<area>.txt` files split per area (e.g. `llms-full-reference-docs-app-runtime.txt`)
-   `/<page>.md`: a clean Markdown version of every docs page and blog post (e.g. `/docs/quickstart.md`), linked from each page's HTML with `<link rel="alternate" type="text/markdown">`

The `llms.txt` sections follow the sidebars, so new pages are picked up automatically. A page's `description` front matter is used as its summary in `llms.txt`, so adding a good one helps. The content types for these files on Netlify are set in [static/\_headers](static/_headers).

## Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.
