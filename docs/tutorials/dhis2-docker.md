---
id: dhis2-docker
title: DHIS2 in Docker
---

## Prerequisites

Make sure you have the following tools installed
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)
* [d2 cluster CLI](https://cli.dhis2.nu/#/commands/d2-cluster) (_only needed if you want to use `d2 cluster` for running DHIS2 in Docker_)

## Overview

- [Run DHIS2 in Docker with Docker Compose](#run-dhis2-in-docker-with-docker-compose)
- [Run DHIS2 in Docker with d2 cluster CLI](#run-dhis2-in-docker-with-d2-cluster-cli)


## Run DHIS2 in Docker with Docker Compose

Running DHIS2 with Docker Compose is very straightforward, [see the dhis2-core README](https://github.com/dhis2/dhis2-core#run-dhis2-in-docker) for more details. 
```shell
DHIS2_IMAGE=dhis2/core:2.39.0.1 DHIS2_DB_DUMP=https://databases.dhis2.org/sierra-leone/2.39.0/dhis2-db-sierra-leone.sql.gz docker compose up
```

This is the preferred way if you want a simple setup that consist of DHIS2 and a database. You can either clone the [`dhis2-core`](https://github.com/dhis2/dhis2-core) repository or download only the [`docker-compose.yml`](https://github.com/dhis2/dhis2-core/blob/master/docker-compose.yml) file.

## Run DHIS2 in Docker with d2 cluster CLI

Running DHIS2 with the `d2 cluster` CLI is also very simple, [see the DHIS2 CLI docs](https://cli.dhis2.nu/#/commands/d2-cluster) for more details.

```shell
d2 cluster up 2.39.0.1 --db-version 2.39 --seed
```

This way of running DHIS2 provides extra features like running multiple DHIS2 "clusters" at once, saving different configuration combinations and more.
