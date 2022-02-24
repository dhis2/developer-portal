---
id: code-style
title: How to set up code style for DHIS2
---

It can be very helpful to follow the DHIS2 style to ensure that you write clean, readable, and functional code for your DHIS2 applications.

To do this, the [DHIS2 CLI style](https://cli-style.dhis2.nu/#/) provides a tool that checks and fixes the style of JavaScript and text files in your repository.

The `d2-style` runs [prettier](https://prettier.io/) and [eslint](https://eslint.org) under the hood with [a standardized configuration](https://github.com/dhis2/cli-style/tree/master/config/js).

It also installs git hooks with [husky](https://github.com/typicode/husky) which will automatically check your code style before making a `git` commit!

## 1. Add `d2-style`

First, add `d2-style` as a development dependency:

```shell
yarn add @dhis2/cli-style --dev
```

## 2. Set up a pre-configured project

`d2-style` comes with code style for a range of presets. The preset `project/react` should be a good starting point for a React project, as it adds `eslint-plugin-react`.

Run this command to automatically set up the project to follow the DHIS2 code style:

```shell
yarn d2-style install project/react
```

## 3. Set up scripts

Then, add the following scripts to `package.json`:

```shell
// package.json
{
    // ...
    "scripts": {
        // ...
        "lint": "d2-style check js && d2-style check text",
        "format": "d2-style apply js && d2-style apply text"
    }
}
```

**Try out your new scripts!**

```shell
yarn lint
yarn format
```
