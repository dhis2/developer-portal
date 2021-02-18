---
id: spin-up-local-instance
title: Spin up a DHIS2 local instance 
---

This is a quick guide on how to easily create a DHIS2 instance on your local machine and setup the DHIS2 CLI.

> These steps will help you quickly spin up a server and get you started with DHIS2 application development!

## 1. Installation

First, make sure to install the following 👇

-   Install [yarn](https://classic.yarnpkg.com/en/docs/install/) and [Node.js](https://nodejs.org/en/)
-   Download [Docker](https://www.docker.com/)
-   Install the DHIS2 [CLI](https://cli.dhis2.nu/#/getting-started) globally:

```shell
yarn global add @dhis2/cli
```

-   Check the `d2` command-line tool with `d2 --help` for more information on available commands.

## 2. Run d2 cluster

-   The [d2 cluster](https://cli.dhis2.nu/#/commands/d2-cluster) command will allow you to launch a new cluster and create a DHIS2 instance using Docker containers. In your terminal, run the following:

```shell
d2 cluster up <name>
# or:
d2 cluster up 2.35.0 --db-vesion 2.35 —-seed
# this will populate a database with sample data
```

-   You can check your newly created cluster that's running locally with `d2 cluster list` 

> If you want to test against different DHIS2 and database versions or build your own custom DHIS2 Docker image, please refer to the [DHIS2 CLI](https://cli.dhis2.nu/#/commands/d2-cluster) docs.
-   For more d2 cluster commands, run `d2 cluster --help`.

-   Finally, go to [http://localhost:8080/](http://localhost:8080/) and login to your instance:

```
username: admin
password: district
```

### Congratulations! Now you're all set! 🎊