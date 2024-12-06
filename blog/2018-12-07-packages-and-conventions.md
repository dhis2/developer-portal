---
slug: 2018/12/packages-and-conventions
title: Packages and style conventions
authors: varl
tags: [js, style, packages, code-style]
date: 2018-12-07
---

Style conventions are always a topic for debate. Everyone agrees that
conventions are good, and simultaneously prefers their own conventions.
Tools like Prettier were built in that particular kind of bikeshed. In
that spirit, allow me to introduce two tools that consolidate our
JavaScript conventions.

<!--truncate-->

> **EDIT MARCH 28, 2019** - While the concepts in this post still very much hold true, the **code-style** and **packages** (with the exception of `packages exec`) are being deprecated. Please use [d2](2019-03-28-introducing-d2.md) instead of these older stand-alone tools where possible!

# 1 - [code-style](https://github.com/dhis2/code-style)

**code-style** comes with two scripts, `code-style.js` and `commit-style.js`.

`code-style.js` does a couple of things related to your codebase:

-   Runs **Prettier** on your staged, or all with `--all`, files with the DHIS2 Prettier
    configuration.
-   Removes any existing [Prettier
    configuration](https://prettier.io/docs/en/configuration.html).
-   Copies the official Prettier config file to the repo so tools can
    find it by default.
-   Adds the official Browerslist config file to the repo so other tools
    (Babel, etc.) can easily find it.
-   Stages all the re-formatted files.

`commit-style.js` orients its existence around making sure that commit
messages follow a structured format:

-   Passes the commit message through **commitlint** and validates it with
    our chosen configuration.

**code-style** is designed to function standalone and as a plugin to
**packages**, so even if you are not using **packages** to manage your
app or lib, it is still advisable to use **code-style** to format your
code and commit messages.

If you are using **packages** then you get access to **code-style**
functionality automatically. If you want to only use **code-style**, see
the [README](https://github.com/dhis2/code-style/blob/master/README.md)
for specific instructions.

# 2 - [packages](https://github.com/dhis2/packages)

**packages** is a commandline tool that comes with a set of built-in
commands and extends its functionality with plugins.

When a project is setup using **packages** and e.g.
[Husky](https://github.com/typicode/husky) to manage Git hooks, the
benefits are:

-   :heart: Standardised code formatting
-   :green_heart: Structured commit messages
-   :blue_heart: Automatic CHANGELOG generation
-   :yellow_heart: Automatic semantic version bumps
-   :purple_heart: Monorepo management with flatpaks

Since **packages** includes **code-style**, we can focus on setting up the
former.

# General setup

If you set up the `scripts` property in `package.json` as below you can
simplify your life significantly, but you are free to use the `packages`
commands manually as well if you install **packages** globally.

```shell
npm install --save-dev @dhis2/packages
npm install --save-dev husky
```

Regardless of whether the project is a monorepo or a standard repo and whether it uses Yarn
or NPM you will want to set up your `package.json` with the following
properties:

```
{
  "scripts": {
    "format": "packages code-style",
    "release": "packages release"
  },
  "husky": {
    "hooks": {
      "commit-msg": "packages commit-style",
      "pre-commit": "packages code-style"
    }
  }
}
```

For more information about how to setup **packages** for a monorepo
check the [docs in the packages
repo](https://github.com/dhis2/packages/blob/master/docs/setup-monorepos.md).

There is also [information on how to migrate from Lerna to
Packages](https://github.com/dhis2/packages/blob/master/docs/migration-guide-from-lerna.md).

---

# Apply the code style

The default operational mode of `code-style` is to only format your
staged files to allow you to split up commits without interference from
the tool staging changes that were meant to be deferred.

Of course, this won't do when the intention is to convert a project to
use the standard formatting rules. To apply the code format to all files
in a project:

```
packages code-style --all
```

Now the changes can be commited.

---

# Generating an initial CHANGELOG

After the general setup has been completed you can generate a changelog
for your repo.

The first time you run this command, use the `--first-release` flag:

```
packages release --first-release
```

This generates the `CHANGELOG.md` file in the repo, but does not bump
the version for the project.

As you create new commits according to the `commit-style` format, the
changelog can be filled out automatically based on the information
embedded in the VCS history.

We adhere to the [conventional commit
standard](https://github.com/marionebl/commitlint/tree/master/@commitlint/config-conventional).

---

# Writing commit messages

In general all commit messages must conform to the format:

```
type(scope?): subject # note: scope is optional
```

-   Common types to use: `docs`, `fix`, `feat`, `refactor`, `style`,
    `test`, `chore`.
-   All [valid types](https://github.com/marionebl/commitlint/tree/master/@commitlint/config-conventional#type-enum)
-   More information can be found in the [Conventional Commits
    specification](https://www.conventionalcommits.org/en/v1.0.0-beta.2/#specification)

Some real world examples would be:

A bugfix for the headerbar component in **d2-ui**:

```
fix(headerbar): allow logo to collapse on smaller screens
```

A commit message for a feature containing subject, body, and footer:

```
feat: implement new schemas

New schemas which require bla bla bla

fixes DHIS2-xxxx
```

A breaking change must include the string `BREAKING CHANGE:` followed by
a description in either the body or the footer of the message:

```
feat: update to new api version

BREAKING CHANGE: new api /v31 used to access features x, y, and z needed
to fix DHIS2-xxxx
```

---

# Cut a release

When the time comes to cut a new release, run the command:

```
packages release
```

This command will do the following:

### 1. Set a new version

This scans your commits for information about what version to bump the
`package.json` to. Based on that information, a new version will be
chosen automatically; breaking changes bump the _major_ position, features
bump the _minor_ position, and fixes bump the _patch_ position.

### 2. Generate the CHANGELOG

It also generates a new `CHANGELOG.md` with sections for the different
changes, an example can be found in
[ui/CHANGELOG.md](https://github.com/dhis2/ui/blob/master/CHANGELOG.md).

### 3. Commit changed files

The `package.json` and `CHANGELOG.md` are commited.

### 4. Tag the release

Finally, **packages** creates the tags for the release.

## Control handed back to developer

At this point, all changes are done to the local Git repo so feel free
to check if everything looks right, and once you are ready to trigger
the build process (which publishes the release automatically) run the
command:

```shell
git push --follow-tags origin master
```

Once the tags land on Github, Travis will pick up the tag and start
building, and eventually publish the build artifact to NPM using the
**[deploy-build](https://github.com/dhis2/deploy-build)** tool (which
will get its own blog post shortly).

---

# Recap :triumph:

At this point the project is set up to:

-   Re-format any staged code before it's commited
-   Validate the commit message before it's commited
-   Automatically cut a release
-   _Optional: Monorepo dependency management_

That's it! :tada:

_Thanks to @jenniferarnesen and @Birkbjo for corrections and improvements
to the text._
