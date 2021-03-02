---
id: getting-started
title: Getting started with DHIS2  
sidebar_label: Getting started with DHIS2 
slug: /

---

#### Introduction
You can start developing a DHIS2 app on OSX, Windows or Linux using Docker and the DHIS command line interface (CLI). In this guide, you will install the prerequisites, start up a local DHIS2 instance and create a new app. Your app will connect to the local DHIS2 instance.

#### Installing prerequisites
If you are using Debian Linux, 
1. Follow the [DHIS2 Docker guide](./tutorials/dhis2-docker) to install the prerequisites

If you are using OSX or Windows,
1. Install [Docker](https://docs.docker.com/get-docker/)
3. Install [yarn](https://classic.yarnpkg.com/en/docs/install)
4. From the command line or terminal, install the DHIS [CLI](https://cli.dhis2.nu/#/getting-started) globally
```shell
yarn global add @dhis2/cli
```

Now that you have installed Docker and the DHIS CLI you are ready to start up DHIS2.

### Starting a local DHIS2 instance

1. From the terminal, start up DHIS2 and seed the database
```shell
d2 cluster up 2.35.0 --db-version 2.35 --seed
```
2. From the browser, navigate to [http://localhost:8080](http://localhost:8080). If DHIS2 is running, you should see the following page: 

![Login Page](./assets/quickstart_guides/image-of-login.png)

Sign in as `admin` (username) and `district` (password). If you can load DHIS2 in the browser, you are ready to create a new app. 

### Creating a new app
1. From the terminal, create a new DHIS2 app called "my-app"

```shell
d2 app scripts init my-app
```
2. Change directories to `/my-app` and start the app

```shell
cd my-app && yarn start
```

### Connecting your app to DHIS2
1. From the browser, navigate to [http://localhost:3000](http://localhost:3000). You will see the following page: 

![](./assets/quickstart_guides/new-app-login-page.png)

2. Enter your DHIS2 server URL and the username and password of the default admin user
```
server: http://localhost:8080
username: admin
password: district
```
3. You will see the default admin user name and a welcome message

![](./assets/quickstart_guides/new-app-login-success.png)


Congratulations! You are ready to start developing a DHIS2 app 🎊 

### Next steps
Now that you have created a DHIS2 app and connected it to a local DHIS2 instance you can learn more about developing apps on DHIS2. 
- Learn more about DHIS2 apps from the [developer documentation](https://docs.dhis2.org/dhis2_developer_manual/apps.html)
- Watch training videos from the [developer academy](https://www.youtube.com/playlist?list=PLo6Seh-066RynhjhnJNUITOZykA7397We)