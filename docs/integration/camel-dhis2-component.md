---
title: Camel DHIS2 Component
sidebar_label: Camel DHIS2 Component
slug: "/integration/camel-dhis2-component"
---

The Camel DHIS2 Component leverages the DHIS2 Java SDK to integrate Apache Camel with DHIS2. The component is distributed with Apache Camel and can be added to a Maven project POM like so:

```xml
<dependency>
    <groupId>org.apache.camel</groupId>
    <artifactId>camel-dhis2</artifactId>
    <version>x.x.x</version>
    <!-- use the same version as your Camel core version -->
</dependency>
```

## Getting started

:::note
A basic understanding of Apache Camel and endpoints is assumed. Visit the [Apache Camel pagel](/docs/integration/apache-camel) to learn the fundamental Camel concepts. All Camel route examples given in this page are expressed in the Java-based DSL.
:::

A DHIS2 endpoint is declared in a route using the following URI format:

```
dhis2:apiName/methodName?[parameters]
```

### Endpoint parameters

Parameters common across all APIs are listed below:

#### baseApiUrl

DHIS2 server base API URL to sends requests to.

#### username

Username of the DHIS2 user to operate as.

#### password

Password of the DHIS2 username.

#### pat

Personal access token to authenticate with DHIS2. This option is mutually exclusive to `username` and `password`

#### client

Reference to the underlying client communicating with the DHIS2 server. Referencing a client avoids the need to duplicate the base API URL and credentials when declaring multiple DHIS2 endpoints. Duplicating the base API URL and credentials is negatively impacts run-time performance because an identical DHIS2 Java SDK client is created for each endpoint. This option is mutually exclusive to `baseApiUrl`, `username`, `password`, and `pat`. The subsequent example demonstrates how to (1) create the client, (2) register it with Camel, and then (3) reference the client from a DHIS2 endpoint:

```java
...
...

public class MyRouteBuilder extends RouteBuilder {

    public void configure() {
        org.hisp.dhis.integration.sdk.api.Dhis2Client dhis2Client = org.hisp.dhis.integration.sdk.Dhis2ClientBuilder.newClient("https://play.dhis2.org/40.2.2/api", "admin", "district").build();
        getCamelContext().getRegistry().bind("dhis2Client", dhis2Client);

        from("direct:resourceTablesAnalytics")
            .to("dhis2://resourceTables/analytics?skipAggregate=true&skipEvents=true&lastYears=1&client=#dhis2Client");
    }
}
```

:::note
Visit the [DHIS2 Java SDK page](/docs/integration/dhis2-java-sdk) to learn more about the DHIS2 Java SDK.
:::

The `client` parameter in the above route snippet is set to `#dhis2Client`. `#dhis2Client` is an entry in Camel registry which is bound to an instance of `Dhis2Client` thanks to the following line of code:

`getCamelContext().getRegistry().bind("dhis2Client", dhis2Client);`

The `Dhis2Client` instance is created with:

`org.hisp.dhis.integration.sdk.api.Dhis2Client dhis2Client = org.hisp.dhis.integration.sdk.Dhis2ClientBuilder.newClient("https://play.dhis2.org/40.2.2/api", "admin", "district").build();`

### HTTP query parameters

Besides the endpoint parameters, custom HTTP query parameters can be set from the message header using the `CamelDhis2.queryParams` key. Here is a Camel route snippet that adds the HTTP query parameters `ou` and `program` to the message before sending a request to DHIS2:

```java
...
.setHeader( "CamelDhis2.queryParams", () -> Map.of( "ou", "DiszpKrYNg8", "program", "IpHINAT79UW" ) )
.to("dhis2://...")
...
```

HTTP query parameter lists are also supported as shown in the next snippet:

```java
...
.setHeader( "CamelDhis2.queryParams", () -> Map.of( "ou", List.of( "DiszpKrYNg8", "fdc6uOvgoji" ), "program", "IpHINAT79UW" ) )
.to("dhis2://...")
...
```

In URL terms, the request sent to DHIS2 in this example will have these query parameters: `...?ou=DiszpKrYNg8&ou=fdc6uOvgoji&program=IpHINAT79UW`.

## Endpoint APIs & Methods

The endpoint API name and supported method names are described below:

### get

Specify `get` for the API name to fetch a DHIS2 resource or a collection of DHIS2 resources. A resource is fetched with the `resource` method name as shown next:

```java
from("direct:getResource")
    .to("dhis2://get/resource?path=organisationUnits/O6uvpzGd5pu&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api");
```

The `path` parameter identifies the path where the resource is located in DHIS2: `organisationUnits/O6uvpzGd5pu`. The type of the message body produced from `dhis2://get/resource` is `java.io.InputStream`. The raw JSON stream can be deserialised into a POJO like this:

```java
from("direct:getResource")
    .to("dhis2://get/resource?path=organisationUnits/O6uvpzGd5pu&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .unmarshal()
    .json(org.hisp.dhis.api.model.v40_0.OrganisationUnit.class);
```

:::note
The POJO class may be user-defined or a resource class included in the DHIS2 Java SDK.
:::

A collection of resources is fetched with the `collection` method name, for example:

```java
from("direct:getCollection")
    .to("dhis2://get/collection?path=organisationUnits&arrayName=organisationUnits&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api");
```

Apart from the `path` parameter, `dhis2://get/collection` has a specific parameter called `arrayName`. This required parameter is the name of the JSON property containing the resource collection in the reply (e.g., `organisationUnits`). The type of the message body produced from `dhis2://get/collection` is `java.util.Iterator<org.apache.camel.component.dhis2.api.Dhis2Resource>`. `Dhis2Resource` is essentially a `java.util.HashMap`. One can choose to iterate over the body using a [splitter](https://camel.apache.org/components/4.0.x/eips/split-eip.html), like so:

```java
from("direct:getCollection")
    .to("dhis2://get/collection?path=organisationUnits&arrayName=organisationUnits&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .split().body()
    .log("${body}");
```

Converting a `Dhis2Resource` item into POJO is accomplished with [`convertBodyTo(...)`](https://camel.apache.org/components/4.0.x/eips/convertBodyTo-eip.html):

```java
from("direct:getCollection")
    .to("dhis2://get/collection?path=organisationUnits&arrayName=organisationUnits&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .split().body()
    .convertBodyTo(org.hisp.dhis.api.model.v40_0.OrganisationUnit.class)
    .log("${body}");
```

By default, paging is disabled. Paging can be enabled by setting the `paging` parameter to `true`: 

```java
from("direct:getCollection")
    .to("dhis2://get/collection?path=organisationUnits&arrayName=organisationUnits&paging=true&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .split().body()
    .convertBodyTo(org.hisp.dhis.api.model.v40_0.OrganisationUnit.class)
    .log("${body}");
```

#### filter

Both the `resource` and `collection` methods accept one or more `filter` parameters to select results with [DHIS2's object filter](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/metadata.html#webapi_metadata_object_filter). The `filter` endpoint parameter in the following example is set to `phoneNumber:!null:` in order to fetch DHIS2 users which have a phone number:

```java
from("direct:getCollection")
    .to("dhis2://get/collection?path=users&filter=phoneNumber:!null:&arrayName=users&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .split().body()
    .convertBodyTo(org.hisp.dhis.api.model.v40_0.User.class)
    .log("${body}");
```

#### fields

Both the `resource` and `collection` methods accept the `fields` parameter to select the resource fields that are fetched. The `fields` endpoint parameter in the following example is set to `*` in order to select all the organisation unit resource fields:

```java
from("direct:getResource")
    .to("dhis2://get/resource?path=organisationUnits/O6uvpzGd5pu&fields=*&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .unmarshal()
    .json(org.hisp.dhis.api.model.v40_0.OrganisationUnit.class);
```

#### rootJunction

Both the `resource` and `collection` methods accept the `rootJunction` parameter to [set the logic junction used between filters](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/metadata-gist.html#gist_parameters_rootJunction). The `rootJunction` endpoint parameter in the following example is set to `AND` in order to fetch users that have both a phone and WhatsApp number:

```java
from("direct:getCollection")
    .to("dhis2://get/collection?path=users&filter=phoneNumber:!null:&filter=whatsApp:!null:&rootJunction=AND&arrayName=users&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .split().body()
    .convertBodyTo(org.hisp.dhis.api.model.v40_0.User.class)
    .log("${body}");
```

### post

Specify `post` for the API name and `resource` for the method name to save a DHIS2 resource as demonstrated in this route:

```java
from("direct:postResource")
    .setBody(exchange -> new org.hisp.dhis.api.model.v40_0.DataValueSet()
                        .withCompleteDate(ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT))
                        .withOrgUnit("O6uvpzGd5pu")
                        .withDataSet("lyLU2wR22tC")
                        .withPeriod(org.hisp.dhis.integration.sdk.support.period.PeriodBuilder.monthOf(new Date(), -1))
                        .withDataValues(List.of(new org.hisp.dhis.api.model.v40_0.DataValue().withDataElement("aIJZ2d2QgVV").withValue("20"))))
    .to("dhis2://post/resource?path=dataValueSets&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .unmarshal().json(org.hisp.dhis.api.model.v40_0.WebMessage.class)
    .choice().when(exchange -> !exchange.getMessage().getBody(org.hisp.dhis.api.model.v40_0.WebMessage.class).getStatus().equals(org.hisp.dhis.api.model.v40_0.WebMessage.Status.OK))
        .log(LoggingLevel.ERROR, "Import error from DHIS2 while saving data value set => ${body}")
    .end();
```

In the above route, the message body is set to a data value set with:

`setBody(exchange -> new org.hisp.dhis.api.model.v40_0.DataValueSet()
    .withCompleteDate(ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT))
    .withOrgUnit("O6uvpzGd5pu")
    .withDataSet("lyLU2wR22tC")
    .withPeriod(org.hisp.dhis.integration.sdk.support.period.PeriodBuilder.monthOf(new Date(), -1))
    .withDataValues(List.of(new org.hisp.dhis.api.model.v40_0.DataValue().withDataElement("aIJZ2d2QgVV").withValue("20"))))`

This data value set is saved in DHIS2 thanks to a `dhis2://post/resource` endpoint:

`to("dhis2://post/resource?path=dataValueSets&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")`

`dataValueSets` is the `path` parameter which identifies the path where the resource will be saved. `dhis2://post/resource` expects the message body to contain the resource to be sent to DHIS2. The body produced from the endpoint is of type `java.io.InputStream`. In this example, the route deserialises the reply into a `WebMessage` object with:

`unmarshal().json(org.hisp.dhis.api.model.v40_0.WebMessage.class)`

### put

Specify `put` for the API name and `resource` for the method name to update a DHIS2 resource as demonstrated in this route:

```java
from("direct:putResource")
    .setBody(exchange -> new org.hisp.dhis.api.model.v40_0.OrganisationUnit().withName("Acme").withShortName("Acme").withOpeningDate(new Date()))
    .to("dhis2://put/resource?path=organisationUnits/jUb8gELQApl&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .unmarshal().json(org.hisp.dhis.api.model.v40_0.WebMessage.class)
    .choice()
    .when(exchange -> !exchange.getMessage().getBody(org.hisp.dhis.api.model.v40_0.WebMessage.class).getStatus().equals(org.hisp.dhis.api.model.v40_0.WebMessage.Status.OK))
        .log(LoggingLevel.ERROR, "Import error from DHIS2 while updating org unit => ${body}")
    .end();
```

In the above route, the message body is set to an organisation unit with:

`setBody(exchange -> new org.hisp.dhis.api.model.v40_0.OrganisationUnit().withName("Acme").withShortName("Acme").withOpeningDate(new Date()))`

The organisation unit `jUb8gELQApl` in DHIS2 is updated with the organisation unit in the message body thanks to a `dhis2://put/resource` endpoint:

`to("dhis2://put/resource?path=organisationUnits/jUb8gELQApl&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")`

`organisationUnits/jUb8gELQApl` is the `path` parameter which identifies the path where the resource to be updated is located in DHIS2. `dhis2://put/resource` expects the message body to contain the resource to be sent to DHIS2. The body produced from the endpoint is of type `java.io.InputStream`. In this example, the route deserialises the reply into a `WebMessage` object with:

`unmarshal().json(org.hisp.dhis.api.model.v40_0.WebMessage.class)`

### delete

Specify `delete` for the API name and `resource` for the method name to delete a DHIS2 resource as demonstrated in this route:

```java
from("direct:deleteResource")
    .to("dhis2://delete/resource?path=organisationUnits/jUb8gELQApl&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")
    .unmarshal().json(org.hisp.dhis.api.model.v40_0.WebMessage.class)
    .choice()
    .when(exchange -> !exchange.getMessage().getBody(org.hisp.dhis.api.model.v40_0.WebMessage.class).getStatus().equals(org.hisp.dhis.api.model.v40_0.WebMessage.Status.OK))
        .log(LoggingLevel.ERROR, "Import error from DHIS2 while deleting org unit => ${body}")
    .end();
```

The above route deletes the organisation unit `jUb8gELQApl` in DHIS2 thanks to the `dhis2://delete/resource` endpoint:

`to("dhis2://delete/resource?path=organisationUnits/jUb8gELQApl&username=admin&password=district&baseApiUrl=https://play.dhis2.org/40.2.1/api")`

`organisationUnits/jUb8gELQApl` is the `path` parameter which identifies the path where the resource to be deleted is located in DHIS2. A resource can be added to the HTTP request sent by setting the message body to the resource. The body produced from `dhis2://put/resource` is of type `java.io.InputStream`. In this example, the route deserialises the reply into a `WebMessage` object with:

`unmarshal().json(org.hisp.dhis.api.model.v40_0.WebMessage.class)`

### resourceTables

Specify `resourceTables` for the API name and `analytics` for the method name to run analytics on DHIS2 as demonstrated in this route:

```java
from("direct:resourceTablesAnalytics")
    .to("dhis2://resourceTables/analytics?skipAggregate=false&skipEvents=true&lastYears=1&username=admin&password=district&baseApiUrl=https://play.dhis2.org/2.39.1/api");
```

`dhis2://resourceTables/analytics` does not produce a new message body. The following table describes the parameters specific to `dhis2://resourceTables/analytics`:

| **Parameter Name** |                              **Description**                             |
|:------------------:|:------------------------------------------------------------------------:|
|    skipAggregate   | Skip generation of aggregate data and completeness data.                 |
|     skipEvents     | Skip generation of event data.                                           |
|      lastYears     | Number of last years of data to include.                                 |
|      interval      | Duration in milliseconds between completeness checks. Default is `30000` |
|        async       | Whether to block until analytics is complete. Default is `false`.        |





