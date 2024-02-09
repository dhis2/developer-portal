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

After the installation is complete, you will need to fetch external documentation. This is a separate command because it's not required every compile for local development.

```
yarn fetch-external-docs
```

### Local Development

```console
yarn start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

Need to fetch external documentation? Run `yarn fetch-external-docs` and then `yarn start`.

### Build

```console
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service. It will also automatically update external documentation.

## Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.
