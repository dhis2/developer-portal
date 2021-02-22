---
id: dhis2-advanced-setup
title: Advanced DHIS2 setup
---

# DHIS2 versions

There are two different ways to get a specific version of DHIS2 (omitting tools like docker):

1. [Github](https://github.com/dhis2/dhis2-core)
2. [Dhis2.org](https://www.dhis2.org/downloads)

The most versatile option is Github, which allows you not only to clone and easily switch between versions and even commits, but it allows you to access the newest changes as soon as they are available. On Github, we create a new branch for each new release and currently have all versions from 2.21 available. When using Github for fetching and switching between versions, you need to recompile the code each time.

The WAR files available on dhis2.org is for versions 2.23 and newer, and changes made on Github will not be reflected in these WAR files until they have been tested and built by [Jenkins](https://ci.dhis2.org/). Switching between versions using WAR files and tomcat can be tedious, but some tips and tricks on how to maintain multiple instances of DHIS2 running at the same time with Tomcat will come in the Tomcat section.

# Databases in general

Testing different versions, different amount of data or debugging problems for users are some of the use-cases for maintaining multiple databases. Here are some key tips for you too keep in mind:

1. Naming conventions on databases to easily identify which one you want
2. When working with a specific version of DHIS2, remember to use the demo-database of the same version
3. Running a newer version of DHIS2 on an older versions database will upgrade the database. In some cases, that will make it unusable on the older version. (To fix this, re-import the database)
4. Changing the database connection information in `dhis.conf` only requires you to restart the application to take effect.

# Jetty

The fastest way to get a DHIS2 instance up and running, is using the built-in Jetty server. Assuming you have compiled the dhis2 and dhis-web folders of the project as covered in the basic setup guide, you can follow up with these commands to start Jetty:

```sh
$ cd dhis-web-portal/
$ mvn jetty:run-war
```

With Jetty, you can only run a single instance at the time. To switch between versions, you need to checkout the correct branch on Github, compile the project and start jetty again. To switch between databases, you need to update your `dhis.conf` and just restart Jetty.

# Tomcat (WIP!)

Tomcat takes some time to set up properly, but also has the possibility to run multiple different versions of DHIS2 in parallel with their own databases. Since setting up Tomcat is covered in the basic setup guide, I will point out the steps to setting up multiple instances with multiple databases here.

More detailed information about how to setup multiple instances of Tomcat is available [in the implementer docs](https://docs.dhis2.org/master/en/implementer/html/install_server_setup.html#install_tomcat_dhis2_installation).

An outline of the steps required for each instance you want to run:

1. Aquire a WAR file of the DHIS2 version you want to run
2. Create a new folder on your system, which will be the `DHIS2_HOME` folder of the new instance. (This folder cannot be shared by instances you want to have a different configuration)
3. Create a new `dhis.conf` in the folder you just created, and put in the configuration you want to use for this instance (For example a new database)
4. Create a new namespace in Tomcat to run the new instance and add the WAR file
5. Update the `setenv.sh` file for the new directory, and set `JAVA_HOME` and `DHIS2_HOME` here. Remember to set `DHIS2_HOME` to point to the new directory you created in step 2.
6. Start/restart the new instance.

Repeat this process until you have all the instances you want running.

# Getting multi-instance Tomcat to work on server

Make sure the users are in the same groups!

```sh
$ sudo usermod --append --groups www-data dhis
$ sudo usermod --gid www-data dhis

$ sudo usermod --append --groups www-data tomcat8
$ sudo usermod --gid www-data tomcat8
```

`/etc/nginx/sites-available/dhis2.vardevs.se.conf`:

```nginx
server {
        listen 80;
        server_name .dhis2.vardevs.se;
        charset utf-8;

        client_max_body_size       10m;
        client_body_buffer_size    128k;

        proxy_buffer_size          4k;
        proxy_buffers              4 32k;
        proxy_busy_buffers_size    64k;
        proxy_temp_file_write_size 64k;

        gzip on; # Enables compression, incl Web API content-types
        gzip_types
                "application/json;charset=utf-8" application/json
                "application/javascript;charset=utf-8" application/javascript text/javascript
                "application/xml;charset=utf-8" application/xml text/xml
                "text/css;charset=utf-8" text/css
                "text/plain;charset=utf-8" text/plain;

        # i'm serving some static stuff from this server so i want this
        root /srv/www/;
        index index.html;

        # the last fragment (dev) needs to match the filename of
        # the deployed war-file, e.g. dev.war -> /dev
        #
        # this is so tomcat and nginx agree on the baseurls and
        # links are kept intact without doing rewrite magic
        #
        # `location /dev`        -> what pattern should nginx pass to what tc
        # `root ../webapps/dev`  -> where will tc unpack the war (default
        #                           is to the same folder as the WAR-file name)
        # `mv dhis2.war dev.war` -> make sure our war is deployed to the
        #                           /dev context
        location /dev {
                root /opt/dhis2/tcs/dhis2-master/webapps/dev;
                proxy_pass                http://localhost:8080/;
                proxy_redirect            off;
                proxy_set_header          Host               $host;
                proxy_set_header          X-Real-IP          $remote_addr;
                proxy_set_header          X-Forwarded-For    $proxy_add_x_forwarded_for;
                proxy_set_header          X-Forwarded-Proto  http;
        }
        # same deal here, `/228` ->
        location /228 {
                root /opt/dhis2/tcs/dhis2-master/webapps/228;
                proxy_pass                http://localhost:8081/228;
                proxy_redirect            off;
                proxy_set_header          Host               $host;
                proxy_set_header          X-Real-IP          $remote_addr;
                proxy_set_header          X-Forwarded-For    $proxy_add_x_forwarded_for;
                proxy_set_header          X-Forwarded-Proto  http;
        }
}
```

To deploy `dev`:

```sh
$ cp \
/opt/dhis2/dhis2-core/dhis-2/dhis-web/dhis-web-portal/target/dhis.war \
/opt/dhis2/tcs/dhis2-master/webapps/dev.war
```

Create a new instance `228`:

```sh
$ tomcat8-instance-create dhis2-228
```

Automatically get 228.war every night from the CI server as the user `dhis`.

```sh
$ sudo -u dhis crontab -e
% 0 0 * * *       curl -o /opt/dhis2/tcs/dhis-228/webapps/228.war https://ci.dhis2.org/job/dhis2-2.28/lastSuccessfulBuild/artifact/dhis-2/dhis-web/dhis-web-portal/target/dhis.war
```

Correct the permissions (for safety)!

```sh
sudo chown -R dhis:www-data /opt/dhis2
sudo chmod -R 775 /opt/dhis2
```

Update the home folder, and create a new `dhis.conf` in it with new connection strings for the database, and then
update the `setenv.sh` for your tomcat instance.

```sh
$ vim /opt/dhis2/tcs/dhis-228/bin/setenv.sh
...
% export DHIS2_HOME=/opt/dhis2/home/228
```

Change the Tomcat ports for your new instance in `/opt/dhis2/tcs/dhis2-228/conf/server.xml`:

```xml
...
<Server port="<new port>" shutdown="SHUTDOWN">
...
<Connector port="8081" protocol="HTTP/1.1"
               connectionTimeout="20000"
               URIEncoding="UTF-8"
               redirectPort="8443" />
...
```

Start your new instance `./opt/dhis2/tcs/dhis2-228/bin/startup.sh`
