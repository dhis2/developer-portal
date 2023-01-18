---
id: dhis2-docker
title: DHIS2 Docker
---

## Overview

-   Install D2 CLI
-   Launch development cluster
-   System cleanup (_Optional_)


## Install D2 CLI

Can be installed using Yarn (recommended):

```
yarn global add @dhis2/cli
```

> :information_source: NPM can be used, but is [not
> recommended](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally)
> for many reasons. If Yarn is unacceptable, use `npx @dhis2/cli` instead.

Add the global Yarn packages `.bin` directory to your `PATH` so that you can
easily execute the commands:

```
tee -a ~/.bash_profile <<EOF
if [ -d "\$HOME/.config/yarn/global/node_modules/.bin" ] ; then
    PATH="\$HOME/.config/yarn/global/node_modules/.bin:\$PATH"
fi
EOF
```

For shells other than Bash, a different `.profile` file is needed, e.g.
`.zsh_profile` for ZSH. If no shell specific profile file is found or used,
then `.profile` would work in most cases.

### D2 configuration file (_Optional_)

```
mkdir -p ~/.config/d2
tee ~/.config/d2/config.js <<EOF
module.exports = {
    cluster: {
        channel: 'stable',
        clusters: {
            dev: {
                channel: 'dev',
                dbVersion: 'dev',
                dhis2Version: 'master',
                customContext: false, // true if using nginx as a reverse proxy
                port: 8080
            },
        },
    },
}
EOF
```

## Launch the development cluster

If you have the `~/.config/d2/config.js` file, starting is as easy as:

```
d2 cluster up dev
```

Without the configuration file, the equivalent is:

```
d2 cluster up dev \
    --channel dev \
    --dhis2-version master \
    --db-version dev \
    --port 8080
```

## System cleanup (_Optional_)

```
sudo apt-get autoremove
```
