---
slug: 2019/06/managing-multiple-repositories
title: Command a fleet of repositories
authors: varl
tags: [cli, developer tools]
---

As a developer you operate on many repositories. To keep all of the
repositories up-to-date there are as many strategies as there are
developers. Personally I have gone from doing it manually, to writing
scripts (e.g. [1](https://github.com/varl/scripts/blob/master/clone-apps.sh), [2](https://github.com/varl/scripts/blob/master/apps.sh)),
trying different tools (e.g. [1](https://github.com/mateodelnorte/meta)), and the latter is what this post is about.

<!--truncate-->

# Enter, stage left: _myrepos_

[myrepos](https://myrepos.branchable.com/) is a command-line tool which
adds the `mr` command to your environment. `mr` does not care about
different version control systems, it supports all of them.

The standard way to use `mr` is to go into each one of your repositories
and run the command `mr register` for `mr` to add it to your
configuration file in `~/.mrconfig`.

This is a bit tedious, though it can easily be automated. After all the
repositories have been registered with `mr`, then it can pull off its
party tricks. :tada:

The first trick is to clone all the repos into a nice hierarchy, with a
single command: `mr checkout`.

The next trick is to update all of the repos: `mr update`. This is just
the start, however, first you must install the `mr` command.

---

# Install _myrepos_

`mr` is a Perl script, and it is available anywhere Perl runs. To name
a few ways to install it:

- Git: `git clone git://myrepos.branchable.com/ myrepos`
- Debian/Ubuntu: `apt install myrepos`
- Arch: `pacman -Sy myrepos`
- Alpine: `apk add myrepos`
- Nix: `nix-env -i mr`
- FreeBSD: `pkg install myrepos`
- Homebrew: `brew install mr`

---

# Recursive commands

If a command, for example `mr update`, is run in e.g.
`~/dev/dhis2/apps/usage-analytics`, then `mr` only runs it on that
repository.

If it is run in the parent, e.g.
`~/dev/dhis2/apps`, then it only runs the `update` command in all children
of that directory. In this case, it would run `update` in all the app
repositories.

If the command is run on a higher level, e.g. in `~/dev/dhis2` then the
command applies to all registered repositories in `dhis2/`.

Through this hierarchical structure, it is possible to manage all of
your repositories using a single configuration file, both personal and
work related, simply by running your commands in the relevant directory.

---

# Standard operations

The primary commands you will want to use are:

- `mr checkout` clones any repositories which don't already exist
- `mr update` updates all the repositories
- `mr clean` prints the ignored/untracked files in repos, use `-f` to
  remove files as well
- `mr status` shows you the status of each repo; handy to figure out if
  any repos have pending changes
- `mr diff` shows you the diffs from all repos
- `mr run` allows you to run an arbitrary command in all repos

Check out the manual of `myrepos`, it is not long and has some nice
tidbits about parallel execution. Alright, I will give up that last one:
use the switch `mr -j 5` to run 5 concurrent jobs.

---

# Custom operations

This is where the tool starts to shine, not only is this a full-featured
repository manager; it also gives you tools to do batch operations
across multiple repositories.

Custom commands under the `[DEFAULT]` section only apply to the
repositories which are _under_ that section. This is why all the custom
commands are placed at the very top of the `.mrconfig` file.

Some examples I use it for are:

## Purge Node modules

To save on space I have a `mr nuke` command set up which removes the
`node_modules` from all repositories:

```
[DEFAULT]
nuke = if [ -d ./node_modules ]; then rm -rf ./node_modules; else echo "Skipping ... No node_modules/"; fi
```

## Generate bundle reports

It is easy to extend this to e.g. run `yarn install` in all
repositories. Or, generate bundle reports of all the apps using
[`source-map-explorer`](https://github.com/danvk/source-map-explorer):

```
report =
    yarn
    GENERATE_SOURCEMAP=true yarn build
    mkdir $HOME/reports
    source-map-explorer build/**/*.js --html > "${HOME}/reports/$(basename $(pwd))-$(git rev-parse --short HEAD).html"
```

I use this to serve a [listing of bundle
reports](https://dhis2.vardevs.se/reports/) for analysis.

## Check out the common ancestor of multiple branches

It is possible to teach `mr` a lot of tricks, some handier than others,
for example [figuring out the merge-base for different branches](./docs/conceptual/git-workflow):

```
octo = git checkout $(git merge-base --octopus $(for b in "$@"; do echo "origin/${b}"; done))
```

Which can be used as: `mr octo master v32` and it will give you the
merge-base between `origin/master` and `origin/v32` and check it out for
you.

This simplifies backporting bugfixes a bit.

---

# Some other ideas for scripts to try and set up

- `mr unlink`: Remove any symlinks (created through e.g. `yarn link`) between packages
- `mr link <package>`: Create a symlink to a specific package and link
  it to all packages that depend on it.
- `mr boil`: Setup all the standards for code, repos, packages,
  continuous integration on a new branch, commit the changes, and push
  the new branch to origin in a new PR.

---

# Future work

At some point it might make sense to integrate this type of
functionality into `d2`, but for now, `mr` is a very handy tool for
developers who have to deal with multiple repositories.

---

# Shared configuration

This is my full configuration at the time of writing. You can use it to
get started, or set up your own from scratch with only the repos and
target directories you need.

<script src="https://gist.github.com/varl/4a853e6394ad2ebcf4a77c5ea0ff623a.js"></script>

Do you have any useful ideas for a command? Please comment on the Gist. :kissing_heart:
