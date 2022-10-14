---
id: dhis2-basic-setup
title: Basic DHIS2 setup
---

# You will need

-   Java 8
-   Tomcat 8
-   PostgreSQL 9.6.5
-   Git 2.7
-   Maven 3.5
-   (MacOS) [Homebrew](https://brew.sh/)

## Mac OSX

```sh
brew install postgres
brew install tomcat
brew install maven
```

### Install Java for Mac OSX manually

-   Install JDK 8, [get it here](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

-   Set your JAVA_HOME to jdk 8 (9 will not work), i.e. add the following line to your `~/.profile`:

```shell
export JAVA_HOME=`/System/Library/Frameworks/JavaVM.framework/Versions/Current/commands/java_home`
```

## Debian 9

```sh
sudo apt update
sudo apt install maven openjdk-8 openjdk-8-jre git curl unzip postgresql-9.6 tomcat8

-- enable some services to autostart, and start them
$ sudo systemctl enable postgresql@9.6-main.service
$ sudo systemctl start postgresql@9.6-main.service

$ sudo systemctl enable tomcat8
$ sudo systemctl start tomcat8

-- add a dhis user and create dhis2 folders
-- useful if you are setting up dhis2 on a server
$ sudo adduser dhis
$ mkdir /path/to/dhis2

$ sudo chown dhis:tomcat8 /path/to/dhis2
$ sudo chmod -R 775 /path/to/dhis2
```

# Create your `DHIS2_HOME` environment variable

Applications (e.g. DHIS2, D2) read their configuration from this folder.

```sh
$ mkdir /path/to/dhis2/home
$ export DHIS2_HOME=/path/to/dhis2/home
```

**Frontend** uses `$DHIS2_HOME/config.json` to get the URL to your DHIS2 instance and uses basic auth with a base64 encoded username/password
in the format of `user:pass`. The example below is the base64 encode of `admin:district`.

Create the file `$DHIS2_HOME/config.json` and add the following:

```json
{
    "baseUrl": "http://localhost:8080/dhis",
    "authorization": "Basic YWRtaW46ZGlzdHJpY3Q="
}
```

**Backend** uses `$DHIS2_HOME/dhis.conf` to get for example, configuration to the database. It will not start without this file.

```properties
connection.dialect = org.hibernate.dialect.PostgreSQLDialect
connection.driver_class = org.postgresql.Driver
connection.url = jdbc:postgresql://localhost/dhis2
connection.username = dhis
connection.password = dhis
# Database schema behavior, can be validate, update, create, create-drop
connection.schema = update

encryption.password = xxxx
```

# Setup the database

Create a Postgres Database with name, role and password from `$DHIS2_HOME/dhis.conf`.

This example assumes name, role and password to be **dhis**.

### Linux e.g.

Open the `psql` client as the `postgres` user:

```
sudo -u postgres psql
```

And then create the database:

```
create user 'dhis' with password 'dhis';
create database "dhis2" with owner dhis;
\q
```

## Load demo data into database

Import one of the databases shared at [dhis2-demo-db](https://github.com/dhis2/dhis2-demo-db).

If this step is skipped a clean DHIS2 instance will installed and will work properly, the default login for a fresh instance is `admin:district`.

### Linux e.g.

```sh
$ curl -o dhis2-demo.zip https://www.dhis2.org/download/resources/2.28/dhis2-demo.zip
$ unzip dhis2-demo.zip
$ sudo -u postgres psql -d dhis2 -U dhis -f demo.sql
```

## Update 2.28 database to 2.29

This is a temporary step, but illustrates how to update a 2.28 database to a 2.29 database. If you imported a demo database for
2.29, or are starting from a fresh db, you can skip this step.

### Linux e.g.

```sh
$ curl -o upgrade-229.sql https://raw.githubusercontent.com/dhis2/dhis2-utils/master/resources/sql/upgrade-229.sql
$ sudo -u postgres psql -d dhis2 -U dhis -f upgrade-229.sql
```

# Building DHIS2 WAR-file

This will clone the [dhis2-core](https://github.com/dhis2/dhis2-core) repo to your machine, and build the `master` branch. If you need
functionality on a separate branch, switch to that branch before running the `mvn` commands.

It is common for frontend developers to develop against `master` branch of DHIS2.

```sh
$ git clone git@github.com:dhis2/dhis2-core.git /path/to/dhis2-core
$ cd /path/to/dhis2-core/dhis-2
$ mvn clean install

-- build the `dhis.war` under `dhis-web/dhis-web-portal/target`
$ cd dhis-web
$ mvn clean install

-- to skip tests run
$ mvn clean install -Pdev
-- or
$ mvn clean install -DskipTests
-- or
$ mvn -Dmaven.test.failure.ignore=true clean install
```

# Tomcat

You can either install Tomcat manually by downloading it as a standalone zip-file, or install it using your package manager.

If you have followed this guide these should be your paths:

| Directory  | Debian 9                   | Mac OSX                                 |
| ---------- | -------------------------- | --------------------------------------- |
| `webapps/` | `/var/lib/tomcat8/webapps` | `/usr/local/opt/tomcat/libexec/webapps` |
| `config/`  | `/etc/tomcat8`             | `/usr/local/opt/tomcat/libexec/config`  |
| `logs/`    | `/var/log/tomcat8`         | `/usr/local/opt/tomcat/libexec/logs`    |
| `bin/`     | `/usr/share/tomcat8/bin`   | `/usr/local/opt/tomcat/libexec/bin`     |

If you cannot figure out your Tomcat paths on Mac OSX try:

```
$ brew ls tomcat
-- or
$ catalina.sh -h
...
Using CATALINA_BASE:   /usr/share/tomcat8
Using CATALINA_HOME:   /usr/share/tomcat8
...
```

## Running Tomcat as another user

If you plan on running Tomcat as a different user, you need to use `$CATALINA_BASE/bin/setenv.sh` to set the `DHIS2_HOME` variable.

```sh
$ echo "export DHIS2_HOME=/path/to/dhis2/home" >> $CATALINA_BASE/bin/setenv.sh
$ chmod +x $CATALINA_BASE/bin/setenv.sh
```

## Access the Tomcat Manager GUI

You need to give a user access to the web manager which can start and stop the app.

Go to your Tomcat config folder and update the `tomcat-users.xml` file.

Add the lines below before the end of the XML file:

```xml
<role rolename="manager-gui"/>
<user username="tomcat" password="tomcat" roles="manager-gui"/>
```

If you have a running Tomcat restart it now.

### Linux e.g.

```sh
-- if running as a service
$ sudo systemctl restart tomcat8
```

### Mac OSX e.g.

```sh
-- if running as a service
brew services stop tomcat
brew services start tomcat
```

## Deploy by dropping a WAR-file in Tomcat's `webapps/`

In Tomcat there is a folder called `webapps/`. Tomcat monitors this folder for WAR-files, which it automatically deploys as it finds them to the context path (by default) matching the WAR-file name.

So `dhis.war` will be deployed to the context path `/dhis`, and is therefor available at `http://localhost:8080/dhis`. You can name the WAR-file anything you want and it will be deployed with the context path of the name you gave the WAR-file, e.g. `dev.war` becomes `/dev` and `foobar.war` is mounted to `/foobar`.

:::note
There is a special case for if you name your WAR-file `ROOT.war`, then your context path will be `/`.
:::

Tomcat redeploys an overwritten WAR-file, so you don't need to remove the old WAR-file before dropping in the updated WAR-file.

In `catalina.out` you will see when it starts deploying and when it has finished deploying the context:

```
-- started deploy of dhis.war
25-Jan-2018 10:29:22.161 INFO [localhost-startStop-3] org.apache.catalina.start
up.HostConfig.deployWAR Deploying web application archive /var/lib/tomcat8/weba
pps/dhis.war
...
-- completed deploy of dhis.war
25-Jan-2018 10:30:45.970 INFO [localhost-startStop-3] org.apache.catalina.start
up.HostConfig.deployWAR Deployment of web application archive /var/lib/tomcat8/
webapps/dhis.war has finished in 83,809 ms
```

### Linux e.g.

```sh
$ sudo cp /path/to/dhis2-core/dhis-2/dhis-web/dhis-web-portal/target/dhis.war /var/lib/tomcat8/webapps/

-- monitor the deployment
$ sudo tail -f /var/log/tomcat8/catalina.out
```

## Manual start

At your Tomcat bin folder create a `setenv.sh` file where you define the `$DHIS2_HOME` environment variable which will point to necessary config: `export DHIS2_HOME=/path/to/dhis2/home`

Start your tomcat and monitor the logs: `./startup.sh && tail -f ../logs/catalina.out`);

## Autostart

When you reboot, tomcat will not start automatically. If you want tomcat to start upon login, and you have installed it via homebrew, you can do `brew services start tomcat`.

# Test that DHIS2 is available

At this point your Tomcat is serving DHIS2 on http://localhost:8080/dhis and you can use this URL for your frontend apps in `$DHIS2_HOME/config.json`.

Go to [http://localhost:8080/dhis](http://localhost:8080/dhis) to visit your local instance of dhis2-core.

Or if you are using a headless server:

```sh
-- test that everything works
$ curl -i -L http://localhost:8080/dhis

HTTP/1.1 302
...

HTTP/1.1 200
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Set-Cookie: JSESSIONID=A0F13BCD6E81A5FDD5C66EAFEBE8DCE4; Path=/dhis; HttpOnly
Cache-Control: no-cache, no-store, max-age=0, must-revalidate
Login-Page: true
Content-Type: text/html;charset=UTF-8
Transfer-Encoding: chunked
Date: Thu, 25 Jan 2018 10:36:12 GMT

<!DOCTYPE HTML>
...
```

# Congratulations!

Your very own DHIS2 instance is up and running. :tada:

# Now what?

If you want, you can take a look at the [advanced DHIS2 environment setup](./dhis2-advanced-setup) for running multiple databases, DHIS2 instances, different application servers, and more.
