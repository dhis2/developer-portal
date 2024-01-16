---
title: DHIS2 Java SDK
sidebar_label: DHIS2 Java SDK
slug: "/integration/dhis2-java-sdk"
---

DHIS2 Java SDK is a lightweight library that hides the nuts and bolts of DHIS2 Web API interactions behind a fluent Java API and type-safe resource models. The SDK code is open-source and [hosted on GitHub](https://github.com/dhis2/dhis2-java-sdk). Contributions from the DHIS2 community are more than welcome. 

## Contents

1. [Basics](#basics)
   1. [Getting started](#getting-started)
   2. [Creating a DHIS2 client](#creating-a-dhis2-client)
   3. [Dhis2Client](#dhis2client)
2. [Remote operations](#remote-operations)
   1. [Fetching](#fetching)
      1. [withField](#withfield)
      2. [withFields](#withfields)
      3. [Collections](#collections)
         1. [withFilter](#withfilter)
         2. [withAndRootJunction](#withandrootjunction)
         3. [withOrRootJunction](#withorrootjunction)
   2. [Saving](#saving)
   3. [Updating](#updating)
   4. [Deleting](#deleting)
3. [Runtime errors](#remote-operations)
   1. [Dhis2ClientException](#dhis2clientexception)
   2. [RemoteDhis2ClientException](#remotedhis2clientexception)

## Basics

### Getting started

:::important
DHIS2 Java SDK is compatible with Java 8 and later versions.
:::

The DHIS2 Java SDK can be built from source, however, binaries of the SDK releases are distributed on the Sonatype Maven repository and can be added to your project's Java class path with Maven. The following is a template for declaring the SDK as dependencies in your Maven project's POM:

```xml
<project>
    ...
    <dependencies>
        <dependency>
            <groupId>org.hisp.dhis.integration.sdk</groupId>
            <artifactId>dhis2-java-sdk</artifactId>
            <version>x.y.z</version>
        </dependency>

        <!-- exclude for Android -->
        <dependency>
            <groupId>org.hisp.dhis.integration.sdk</groupId>
            <artifactId>jackson-resource-model</artifactId>
            <classifier>[v40.0|v2.39.1|v2.38.1|v2.37.7|v2.36.11|v2.35.13]</classifier>        
            <version>x.y.z</version>
        </dependency>

        <!-- include for Android -->
        <dependency>
            <groupId>org.hisp.dhis.integration.sdk</groupId>
            <artifactId>android-jackson-resource-model</artifactId>
            <classifier>[v40.0|v2.39.1|v2.38.1|v2.37.7|v2.36.11|v2.35.13]</classifier>
            <version>x.y.z</version>
        </dependency>
        ...
    </dependencies>
</project>
```

The `dhis2-java-sdk` artifact contains the DHIS2 client and helper classes while the `jackson-resource-model` artifact contains the Jackson-annotated classes representing the DHIS2 API resources. The `android-jackson-resource-model` artifact is similar to `jackson-resource-model` with the exception that it is compatible with Android. `jackson-resource-model` should be omitted from your POM if you are building for Android.

The `x.y.z` version in the above template should to be replaced with the [latest version of the SDK](https://mvnrepository.com/artifact/org.hisp.dhis.integration.sdk/dhis2-java-sdk). The `jackson-resource-model` or `android-jackson-resource-model` artifact classifier should bet set to one of the shown DHIS2 versions (i.e., `v40.0` or `v2.39.1` or `v2.38.1` or `v2.37.7` or `v2.36.11` or `v2.35.13`). The classifier should closely match the DHIS2 version you are integrating with. You can have multiple `jackson-resource-model` dependencies with different classifiers: one for each DHIS2 version you are integrating with. For instance:

```xml
<project>
    ...
    <dependencies>
        <dependency>
            <groupId>org.hisp.dhis.integration.sdk</groupId>
            <artifactId>dhis2-java-sdk</artifactId>
            <version>2.1.0</version>
        </dependency>
        <dependency>
            <groupId>org.hisp.dhis.integration.sdk</groupId>
            <artifactId>jackson-resource-model</artifactId>
            <classifier>v40.0</classifier>
            <version>2.1.0</version>
        </dependency>
        <dependency>
            <groupId>org.hisp.dhis.integration.sdk</groupId>
            <artifactId>jackson-resource-model</artifactId>
            <classifier>v2.35.13</classifier>
            <version>2.1.0</version>
        </dependency>
    </dependencies>
</project>
```

Having multiple `jackson-resource-model` dependencies will not create a conflict as long as each dependency has a distinct classifier. The classes within `jackson-resource-model` v40.0 are located inside package `org.hisp.dhis.api.model.v40_0`,  the ones within `jackson-resource-model` v2.39.1 are located inside package `org.hisp.dhis.api.model.v2_39_1`, and so on.

### Creating a DHIS2 client

The SDK client for exchanging data with a DHIS2 server is constructed programmatically with `Dhis2ClientBuilder`:

```java
org.hisp.dhis.integration.sdk.api.Dhis2Client dhis2Client = org.hisp.dhis.integration.sdk.Dhis2ClientBuilder.newClient(...).build();
```

`Dhis2ClientBuilder` has a static method called `newClient` that expects as parameters the DHIS2 server base API URL together with the DHIS2 user account's username and password or PAT. In the following example, a `Dhis2Client` is built that will transmit requests to `https://play.dhis2.org/40.2.0/api/` using the PAT `d2pat_apheulkR1x7ac8vr9vcxrFkXlgeRiFc94200032556` for authentication:

```java
Dhis2Client dhis2Client = Dhis2ClientBuilder.newClient( "https://play.dhis2.org/40.2.0/api/", "d2pat_apheulkR1x7ac8vr9vcxrFkXlgeRiFc94200032556" ).build();
```

:::note
It is not necessary to terminate the base API URL with a slash.
:::

Apart from the mandatory parameters, `Dhis2Client` can have its connection parameters tweaked with `Dhis2ClientBuilder`. What follows is a table describing the connection parameters.

|  **Parameter Name**  |     **Method Name**    |                                                                                                            **Description**                                                                                                            |       **Default**      | **Java type** |
|:--------------------:|:----------------------:|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|:----------------------:|:-------------:|
| Max idle connections | `withMaxIdleConnections` | The maximum number of idle connections in the HTTP connection pool.                                                                                                                                                                   |            5           | int           |
|  Keep alive duration |  `withKeepAliveDuration` | Time to keep the connection alive in the pool before closing it.                                                                                                                                                                      |       30 seconds       | long          |
|     Call timeout     |     `withCallTimeout`    | The call timeout spans the entire call: resolving DNS, connecting, writing the request body, server processing, and reading the response body. If the call requires redirects or retries all must complete within one timeout period. | 0 seconds (no timeout) | long          |
|     Read timeout     |     `withReadTimeout`    | The read timeout is applied to both the TCP socket and for individual read IO operations including on Source of the Response.                                                                                                         |       10 seconds       | long          |
|     Write timeout    |    `withWriteTimeout`    | The write timeout is applied for individual write IO operations.                                                                                                                                                                      |       10 seconds       | long          |
|    Connect timeout   |   `withConnectTimeout`   | The connect timeout is applied when connecting a TCP socket to the target host.                                                                                                                                                       |       10 seconds       |      long     |


### Dhis2Client

A `Dhis2Client` method chain assembles a request for retrieving or sending a DHIS2 resource. The first method of a `Dhis2Client` method chain identifies the HTTP method of the request. This can be one of the following:

* get
* post
* put
* delete

Each of the above methods expects at least one parameter that denotes the relative URL path the request is for. For example:

```java
dhis2Client.get( "organisationUnits/fdc6uOvgoji" );
```

Assuming the base API URL is `https://play.dhis2.org/40.2.0/api`, the absolute URL path for the GET request in the example is `https://play.dhis2.org/40.2.0/api/organisationUnits/fdc6uOvgoji`.

Alternatively, instead of having a hard-coded URL path, you can name the variable parts of the path. The names can be then bound to values in the parameter list of the method:

```java
dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" );
```

`Dhis2Client` replaces `{id}` with `fdc6uOvgoji` in the above snippet. Query parameters can be added to the request using various methods depending on the HTTP method but `withParameter` is a method that is available across all HTTP methods:

```java
dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).withParameter("fields", "name").withParameter("filter", "level:eq:3");
```

`withParameters` is similar to `withParameter` with the notable difference that it accepts a map of parameters:

```java
dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).withParameters(Map.of("fields", "name", "filter", "level:eq:3"));
```

A method chain should always have a `transfer()` method in order to send the assembled request over the wire and wait for a response:

```java
dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer();
```

If the response is successful, you can either choose to ignore or read the JSON result. Ignoring the result without closing the call could lead to a memory leak so it is always good practice to terminate the method chain with `close()` after transferring a request:

```java
dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().close();
```

However, typically you would want to read the resource after fetching it. There are a number of different ways on how to accomplish this. The recommended way is to deserialise the reply body into a POJO with `returnAs(...)`: 

```java
org.hisp.dhis.api.model.v2_37_7.OrganisationUnit organisationUnit = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().returnAs( org.hisp.dhis.api.model.v2_37_7.OrganisationUnit.class );
```

:::note
`returnAs(...)` implicitly closes the response.
:::

`OrganisationUnit` is one of the many POJO classes bundled with the `jackson-resource-model` JAR. Most of the DHIS2 resources are available as classes from this JAR. Having said this, you are free to desrialise the body into a `java.util.Map`:

```java
Map<String, Object> organisationUnitAsMap = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().returnAs( Map.class );
```

You could also obtain the raw JSON content like so:

```java
String organisationUnitAsJson = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().returnAs( String.class );
```

For large payloads, you might want to stream the result rather than reading it all into memory. In this case, it is better to use the `read()` method at the end of the chain in order to obtain an input stream:

```java
InputStream organisationUnitAsStream = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().read();
```

## Remote Operations

### Fetching

A DHIS2 resource is fetched with `Dhis2Client#get(...)` as shown in the next example:

```java
OrganisationUnit orgUnit = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().returnAs( OrganisationUnit.class );
```

#### withField

The fields of a resource can be selected using the `withField(...)` method:

```java
OrganisationUnit orgUnit = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).withField( "*" ).transfer().returnAs( OrganisationUnit.class );
```

:::note
More than one `withField(...)` method can be included in a method chain.
:::

#### withFields

Multiple `withField(...)` methods can be combined into a single `withFields(...)` method like so:

```java
OrganisationUnit orgUnit = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).withFields( "id", "name" ).transfer().returnAs( OrganisationUnit.class );
```

#### Collections

Fetching a non-paginated resource collection is accomplished by including `withoutPaging()` in the method chain:

```java
Iterable<OrganisationUnit> orgUnits = dhis2Client.get( "organisationUnits" ).withoutPaging().transfer().returnAs( OrganisationUnit.class, "organisationUnits" );
```

Observe that `returnAs(...)` has an extra parameter specifying the array field name holding the collection in the reply.

Fetching a resource collection with pagination is accomplished by including `withPaging()` instead of `withoutPaging()` in the method chain:

```java
Iterable<OrganisationUnit> orgUnits = dhis2Client.get( "organisationUnits" ).withPaging().transfer().returnAs( OrganisationUnit.class, "organisationUnits" );
```

The `Iterable` object returned from `returnAs` is lazy when `withPaging()` is used. The client will transparently fetch the next page, if there is one, when the iterator reaches the last item in the current page.

##### withFilter

Filtering collections with [DHIS2's object filter](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/metadata.html#webapi_metadata_object_filter) is possible using `withFilter(...)`: 

```java 
Iterable<OrganisationUnit> organisationUnits = dhis2Client.get( "organisationUnits" ).withFilter( "level:eq:3" ).withPaging().transfer().returnAs( OrganisationUnit.class, "organisationUnits" );
```

The above snippet fetches organisation units situated at the third level of the organisation hierarchy.

:::note
More than one `withFilter(...)` method can be included in a method chain.
:::

###### withAndRootJunction

The [AND logical operator](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/metadata.html#webapi_metadata_logical_operator) is applied to multiple filters using the `withAndRootJunction()` method:

```java 
Iterable<DataElement> dataElements = dhis2Client.get( "dataElements" ).withFilter( "id:in:[id1,id2]" ).withFilter( "code:eq:code1" ).withAndRootJunction().withPaging().transfer().returnAs( DataElement.class, "dataElements" );
```

###### withOrRootJunction

The [OR logical operator](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/metadata.html#webapi_metadata_logical_operator) is applied to multiple filters using the `withOrRootJunction()` method:

```java 
Iterable<DataElement> dataElements = dhis2Client.get( "dataElements" ).withFilter( "id:in:[id1,id2]" ).withFilter( "code:eq:code1" ).withOrRootJunction().withPaging().transfer().returnAs( DataElement.class, "dataElements" );
```

### Saving

A DHIS2 resource is saved with `Dhis2Client#post(...)` as shown in the next example:

```java
WebMessage webMessage = dhis2Client.post( "organisationUnits" ).withResource( new OrganisationUnit().withName( "Acme" ).withCode( "ACME" ).withShortName( "Acme" ).withOpeningDate( new Date( 964866178L ) ) ).transfer().returnAs( WebMessage.class );
```

A `post(...)` is usually followed by a `withResource(...)` method to set the body of the request. The request body in the above snippet is set to an organisation unit POJO. Apart from POJOs, `withResource(...)` accepts JSON strings.

### Updating

A DHIS2 resource is updated with `Dhis2Client#put(...)` as shown in the next example:

```java
WebMessage webMessage = dhis2Client.post( "organisationUnits" ).withResource( new OrganisationUnit().withName( "Acme" ).withCode( "ACME" ).withShortName( "Acme" ).withOpeningDate( new Date( 964866178L ) ) ).transfer().returnAs( WebMessage.class );
```

A `put(...)` is usually followed by a `withResource(...)` method to set the body of the request. The request body in the above snippet is set to an organisation unit POJO. Apart from POJOs, `withResource(...)` accepts JSON strings.


### Deleting

A DHIS2 resource is deleted with `Dhis2Client#delete(...)` as shown in the next example:

```java
dhis2Client.delete( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().close();
```

A `delete(...)` can be followed by a `withResource(...)` method to set the body of the request. The request body in the above snippet is set to an organisation unit POJO. Apart from POJOs, `withResource(...)` accepts JSON strings.

## Runtime errors

An application should be prepared to handle `Dhis2ClientException` and `RemoteDhis2ClientException` unchecked exceptions when invoking DHIS2 Java SDK methods.

### Dhis2ClientException

`Dhis2ClientException` exception represents any error that is not originating from the server. This includes network timeouts. You can extract the error message and the cause from the caught exception:

```java
try {
    org.hisp.dhis.api.model.v2_37_7.OrganisationUnit organisationUnit = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().returnAs( org.hisp.dhis.api.model.v2_37_7.OrganisationUnit.class );
} catch (org.hisp.dhis.integration.sdk.api.Dhis2ClientException e) {
    System.out.println(e.getMessage());
}
```

### RemoteDhis2ClientException

`RemoteDhis2ClientException` is a special type of `Dhis2ClientException` that occurs when the server returns a reply with an HTTP status code that is unsuccessful (i.e., not 2xx). While `Dhis2ClientException` contains the error message and the cause, `RemoteDhis2ClientException` adds the HTTP status code and the HTTP response body:

```java
try {
    org.hisp.dhis.api.model.v2_37_7.OrganisationUnit organisationUnit = dhis2Client.get( "organisationUnits/{id}", "fdc6uOvgoji" ).transfer().returnAs( org.hisp.dhis.api.model.v2_37_7.OrganisationUnit.class );
} catch (org.hisp.dhis.integration.sdk.api.RemoteDhis2ClientException e) {
    System.out.println(e.getHttpStatusCode() + " => " + e.getHttpStatusCode().getBody());
}
```