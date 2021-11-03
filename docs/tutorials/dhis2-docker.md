---
id: dhis2-docker
title: DHIS2 Docker
---

This guide is written with Debian as a starting point, but with minor
adaptations will work on any Debian-based system e.g. Ubuntu or Kali.

The steps themselves apply to any system so with some know-how and elbow grease
this can be applied to MacOS X or other Linux flavors.

Guide tested on:

-   Linux 4.19.0-6-cloud-amd64 #1 SMP Debian 4.19.67-2+deb10u1 (2019-09-20) x86_64 GNU/Linux
-   Linux 4.19.0-6-amd64 #1 SMP Debian 4.19.67-2+deb10u2 (2019-11-11) x86_64 GNU/Linux

## Overview

-   Update system
-   Setup user account
-   Install Node
-   Install Yarn
-   Install Docker
-   Install Nginx (_Optional_)
-   Install Certbot (_Optional_)
-   Install D2 CLI
-   Launch development cluster
-   System cleanup (_Optional_)

## Make sure the system is updated

```shell
sudo apt-get update
sudo apt-get upgrade
```

Install the base dependencies we are going to need.

```shell
sudo apt-get install gnupg curl
```

## Setup a user account for yourself

New user:

```shell
USER=myuser
sudo useradd -U -G sudo -b /home $USER
sudo passwd $USER
```

Existing user:

```shell
USER=myuser
usermod -a -G sudo $USER
newgrp sudo
```

## Install Node

Abbreviated instructions below, if any problems occur see the full Node
[installation instructions](https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions).

Set up the sources.

```shell
curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -

VERSION=node_12.x
DISTRO="$(lsb_release -s -c)"

echo "deb https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee /etc/apt/sources.list.d/nodesource.list
echo "deb-src https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee -a /etc/apt/sources.list.d/nodesource.list
```

> :information_source: After adding a new source to `apt`, we need to run the `update` command.

Install Node.

```shell
sudo apt-get update
sudo apt-get install nodejs
```

Test the Node install with:

```
which node
node --version
```

## Install Yarn

[Full installation instructions](https://yarnpkg.com/lang/en/docs/install/#debian-stable)

Add the Apt sources.

```shell
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
```

Install Yarn.

```
sudo apt-get update
sudo apt-get install yarn
```

Test the Yarn install with:

```
which yarn
yarn --version
```

## Install Docker

While Docker exists in the standard repositories, the versions for
Docker and Docker Compose that are considered stable by Debian are too old for
us to use, so we need to install the versions that Docker considers stable.

Other distros (e.g. Ubuntu) are faster about adopting new versions, so they may
be current enough. Either way, using the Docker repos guarantees functionality,
and faster security patches. Which you do want considering what Docker does and
fundamentally is.

Installing Docker is more involved than the other commands, the full
instructions used for the abbreviated set are provided here:

-   [Install Docker](https://docs.docker.com/install/linux/docker-ce/debian/)
-   [Post-installation](https://docs.docker.com/install/linux/linux-postinstall/)
-   [Install Docker Compose](https://docs.docker.com/compose/install/)

Install the dependencies.

```shell
sudo apt-get update
sudo apt-get install \
     apt-transport-https \
     ca-certificates \
     software-properties-common
```

Add the Docker source repository to Apt.

```shell
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
sudo add-apt-repository \
     "deb [arch=amd64] https://download.docker.com/linux/debian \
     $(lsb_release -cs) \
     stable"
```

Install the Docker packages.

```shell
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

Set up a group for Docker. Tt may already exist and if so, that's OK. Simply
proceed with the commands after `groupadd`.

```shell
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

If these commands fail, that's OK. If you run into permission errors down the
line, come back and run these again.

```shell
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R
```

### Change the Docker data root location (_Optional_)

If you do not want all the Docker data on your main partition (`/opt/docker`)
as it may consume a lot of space, you can change that adding some configuration
to the Docker daemon config file in `/etc/docker/daemon.json`:

```shell
echo "{ \"data-root\": \"/custom/docker/data/dir\", \"exec-root\": \"/custom/docker/dir\" }" | sudo tee /etc/docker/daemon.json
```

### Control the Docker service

```shell
sudo systemctl start docker
```

To configure if Docker starts on boot or not:

```shell
sudo systemctl enable docker
sudo systemctl disable docker
```

### Install Docker Compose

Docker Compose is a single binary that we can just download and plop into our
`/usr/local/bin` directory. Note that the directory varies from distro to
distro, you want the local binary directory for userland.

```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

Mark it as executable after inspecting the binary.

```
sudo chmod +x /usr/local/bin/docker-compose
```

Test out the install with:

```
which docker-compose
docker-compose --version
```

## Install Nginx (_Optional_)

The standard package for Nginx is solid and stable.

```
sudo apt-get update
sudo apt-get install nginx
```

### Setup default site configuration

This overwrites the Nginx default site. If you want to preserve that, [add this
as a new vhost](https://www.digitalocean.com/community/tutorials/how-to-set-up-nginx-server-blocks-virtual-hosts-on-ubuntu-16-04).

```
sudo tee /etc/nginx/sites-available/default <<EOF
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name _;
        charset utf-8;

        client_max_body_size       10m;
        client_body_buffer_size    128k;

        proxy_buffer_size          4k;
        proxy_buffers              4 32k;
        proxy_busy_buffers_size    64k;
        proxy_temp_file_write_size 64k;

        gzip on;
        gzip_types
                "application/json;charset=utf-8" application/json
                "application/javascript;charset=utf-8" application/javascript text/javascript
                "application/xml;charset=utf-8" application/xml text/xml
                "text/css;charset=utf-8" text/css
                "text/plain;charset=utf-8" text/plain;

        root /srv/www/;
        index index.html;

        location /dev {
                proxy_pass                http://localhost:8080/dev;
                proxy_redirect            off;
                proxy_set_header          Host               \$host;
                proxy_set_header          X-Real-IP          \$remote_addr;
                proxy_set_header          X-Forwarded-For    \$proxy_add_x_forwarded_for;
                proxy_set_header          X-Forwarded-Proto  https;
        }
}
EOF
```

Start the Nginx service and enable it to start on boot.

```
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Install certbot (_Optional_)

[Full installation instructions for `certbot`](https://certbot.eff.org/lets-encrypt/debianbuster-nginx).

```
sudo apt-get install certbot python-certbot-nginx
```

Run the tool to setup certificates for sites configured in Nginx:

```
sudo certbot --nginx
```

> :information_source: After setting up a certificate with certbot, usually I
> have to clean up my Nginx `default` config manually.

To simulate a renewal, use:

```
sudo certbot renew --dry-run
```

For the real deal run without the `--dry-run` switch. You will want to do this
every month or so.

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
