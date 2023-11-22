---
id: dhis2-docker
title: DHIS2 in Docker
---

## Prerequisites

Make sure you have the following tools installed
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [d2 cluster CLI](/docs/cli/cluster) (_only needed if you want to use `d2 cluster` for running DHIS2 in Docker_)

## Overview

- [Run DHIS2 in Docker with d2 cluster CLI](#run-dhis2-in-docker-with-d2-cluster-cli)
- [Run DHIS2 in Docker with Docker Compose](#run-dhis2-in-docker-with-docker-compose)
- [DHIS2 in Docker in production](#dhis2-in-docker-in-production)

## Run DHIS2 in Docker with `d2 cluster` CLI

Running DHIS2 with the `d2 cluster` CLI is very simple:

```shell
d2 cluster up 2.40.0.1 --db-version 2.40 --seed
```

This way of running DHIS2 provides extra features like running multiple DHIS2 "clusters" at once, saving different configuration combinations and more.

:::info

[See the DHIS2 CLI docs](/docs/cli/cluster/) for more examples and details.

:::

## Run DHIS2 in Docker with Docker Compose

Running DHIS2 with Docker Compose is also straightforward:

```shell
DHIS2_IMAGE=dhis2/core:2.40.0.1 DHIS2_DB_DUMP_URL=https://databases.dhis2.org/sierra-leone/2.39.1/dhis2-db-sierra-leone.sql.gz docker compose up
```

This is the preferred way if you want a simple setup that consist of DHIS2 and a database.

:::info

[See the dhis2/dhis2-core README](https://github.com/dhis2/dhis2-core#run-dhis2-in-docker) for more examples and details.

:::



## DHIS2 in Docker in production

We cannot recommend [the DHIS2 Docker images](https://github.com/dhis2/dhis2-core#pre-built-images) for use in production. At this point we don’t have enough experience and therefore can’t vouch for their stability for “mission critical” production use. We are not saying that someone experienced with running Docker in production shouldn’t use them.  
In other words, anyone deciding to use DHIS2 in Docker should be aware that they are doing so at their own risk. If you decide to go for it, make sure you perform enough security, performance and stress testing.
