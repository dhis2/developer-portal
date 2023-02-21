---
slug: 2023/02/introducing-the-dhis2-java-sdk
title: Introducing the DHIS2 Java SDK
authors: claudemamo
tags: [dhis2-java-sdk, integration]
---

At HISP Centre, we've been engineering numerous run-of–the-mill integration projects where data is exchanged back and forth with DHIS2 through its [Web API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-239/introduction.html). Typically, this data is filtered, mapped, transformed, enriched, and routed to or from an application which could be the same DHIS2 instance, a different instance, or even a distinct application altogether. Our programming language of choice for these projects is usually Java. Java has an [excellent ecosystem](https://camel.apache.org/), but in each project, we kept reinventing the wheel in terms of shipping the data out of and into DHIS2. Our productivity was being disturbed with the donkey work of writing code to serialise in-memory objects, deserialise JSON, handle failures, authenticate, log events, pool remote connections, retry HTTP errors, and so on. We needed a lightweight flexible library that implemented the low-level plumbing. To this end, the DHIS2 Java SDK was born.

[DHIS2 Java SDK](https://github.com/dhis2/dhis2-java-sdk) is a small open-source non-opinionated library that aims to provide the nuts and bolts for consuming the DHIS2 Web API. Specifically, it provides a fluent-like interface for creating, fetching, modifying, and deleting DHIS2 resources. The application developer can focus on the domain logic and not get bogged down with low-level details concerning DHIS2 API communication like authentication, retries, and pagination. Furthermore, with its type-safe resource model, the SDK aids application developers in writing client code that is compatible with the version of DHIS2 they’re integrating with. 

The DHIS2 Java SDK binary and its dependencies are available for download from the Maven central repository. From your Maven project, add the SDK to the [dependencies section](https://maven.apache.org/pom.html#Dependencies) inside the _POM_ like this:

```xml
<dependencies>
    ...
    <dependency>
        <groupId>org.hisp.dhis.integration.sdk</groupId>
        <artifactId>dhis2-java-sdk</artifactId>
        <version>1.0.0</version>
    </dependency>
    ...
</dependencies>
```

The version we’re referencing in the POM is `1.0.0` but you can always look up the latest version of the SDK from its GitHub repository [README](https://github.com/dhis2/dhis2-java-sdk/blob/main/README.md).

Let’s take a deep dive into the SDK. Consider a standard integration app fetching data value sets from a DHIS2 instance and saving them to a different DHIS2 instance. Leveraging the DHIS2 Java SDK, the app's code to construct the DHIS2 client for the source instance is as follows:

```java
...
import org.hisp.dhis.integration.sdk.Dhis2ClientBuilder;
import org.hisp.dhis.integration.sdk.api.Dhis2Client;

public class IntegrationApp {
    public static void main( String[] args ) {
        Dhis2Client sourceDhis2Client = Dhis2ClientBuilder.newClient( "https://source.dhis2.org/api", "d2pat_5xVA12xyUbWNedQxy4ohH77WlxRGVvZZ1151814092" ).build();
    }
}
```

The above is arguably trivial. `Dhis2ClientBuilder` builds a `Dhis2Client` to send requests to `https://source.dhis2.org/api` using the PAT `d2pat_5xVA12xyUbWNedQxy4ohH77WlxRGVvZZ1151814092` for authentication. 

:::info
`Dhis2ClientBuilder` can also build a `Dhis2Client` to authenticate with basic credentials as shown below:

```java
Dhis2ClientBuilder.newClient( "https://source.dhis2.org/api", "admin", "district" ).build();
```
:::

The next line of code references the previous `sourceDhis2Client` to fetch the data value sets from the source DHIS2 server:

```java
DataValueSet dataValueSet = sourceDhis2Client.get( "dataValueSets" )
    .withParameter( "dataSet", "BfMAe6Itzgt" )
    .withParameter( "period", "202302" )
    .withParameter( "orgUnit", "PLq9sJluXvc" )
    .transfer()
    .returnAs( DataValueSet.class );
```

Here's a breakdown of the method chain:

* `sourceDhis2Client.get(...)` denotes the HTTP verb that will be used for the HTTP call. If we were to _POST_ a resource, the method invoked would be `sourceDhis2Client.post(...)`.

* The parameter value inside the `get` method represents the URL path of the API endpoint (i.e., `dataValueSets`).

* `withParameter(...)` sets a URL query parameter. In this example, we're requesting the data value set given the query parameters data set ID `BfMAe6Itzgt`, period `202302`, and organisation unit ID `PLq9sJluXvc`.

* `transfer()` executes the HTTP call, that is, sends the request to the DHIS2 server.

* `returnAs(...)` deserialises the HTTP response JSON body into a POJO of type `DataValueSet` since we are expecting a data value set from `https://source.dhis2.org/api/dataValueSets`.

:::info
By default, a `get(...)` call assumes that a single resource is being fetched. Fetching a list of resources from a collection endpoint is accomplished by appending `withPaging()` or `withoutPaging()` to `get(...)`. For instance, if we wanted to retrieve the list of organisation units in pages, then the method chain would be written as:

```java
Iterable<OrganisationUnit> orgUnits = sourceDhis2Client.get( "organisationUnits" )
    .withPaging()
    .transfer()
    .returnAs( OrganisationUnit.class, "organisationUnits" );
```

`returnAs` requires an additional parameter when `withPaging()` or `withoutPaging()` is applied to the method chain. This parameter is the property name of the JSON array holding the resource items within the response. The JSON array name in this example is `organisationUnits` given that organisation units are going to be fetched. Notably, fetching a collection changes the method chain’s return signature to an iterable of the type specified in `returnAs(...)`, in this case, `Iterable<OrganisationUnit>`. When pagination is applied, the iterator is lazy: the iterator transparently fetches and feeds the next page to its `next()` method on reaching the last item of the current page.
:::

The `sourceDhis2Client` method chain retrieving the data value set returns an object belonging to a `DataValueSet` _resource class_. Rather than attempting to parse raw JSON strings or reference unsafe generic Maps, a resource class such as `DataValueSet` provides a type-safe fluent view of the request/response's content to the application developer. Additionally, with the help of an IDE’s autocompletion, the programmer can explore which fields are available instead of digging through the Web API documentation. 

Resource classes are located within the package `org.hisp.dhis.api.model.vX_X_X` where `X_X_X` is a variable informing us of the DHIS2 version that the classes are compatible with. Taking `DataValueSet` from our example, this class is located inside the package `org.hisp.dhis.api.model.v2_39_1`. The version no. `v2_39_1` means that this `DataValueSet` class is compatible with DHIS 2.39.1. If we decide to update the application to support a newer version of DHIS2, then we should bump the package version no. `v2_39_1` to match the new DHIS2 version. Any Web API breaking changes like the renaming of a JSON property would be reflected in the corresponding resource class. This in turn would cause the application to fail compilation should it be calling an accessor that is impacted by the breaking change. 

:::info
`org.hisp.dhis.api.model.vX_X_X` packages shipped with the SDK correspond to the last 3 versions of DHIS2 at the time the SDK was released.
:::

Despite the type-safety resource classes offer, the SDK doesn’t have an opinionated way of representing resources. One can always obtain the raw JSON like so:

```java
String dataValueSetAsJson = sourceDhis2Client.get( "dataValueSets" )
    .withParameter( "dataSet", "BfMAe6Itzgt" )
    .withParameter( "period", "202302" )
    .withParameter( "orgUnit", "PLq9sJluXvc" )
    .transfer()
    .returnAs( String.class );
```

Another alternative is to deserialise the JSON response into a _Map_:

```java
Map<String, Object> dataValueSet = sourceDhis2Client.get( "dataValueSets" )
    .withParameter( "dataSet", "BfMAe6Itzgt" )
    .withParameter( "period", "202302" )
    .withParameter( "orgUnit", "PLq9sJluXvc" )
    .transfer()
    .returnAs( Map.class );
```

For the memory conscious folks, so that large payloads don’t take up all the machine’s memory, the response can also be streamed with the `read()` method replacing `returnAs(...)`:

```java
InputStream dataValueSet = sourceDhis2Client.get( "dataValueSets" )
    .withParameter( "dataSet", "BfMAe6Itzgt" )
    .withParameter( "period", "202302" )
    .withParameter( "orgUnit", "PLq9sJluXvc" )
    .transfer()
    .read();
```

Returning to our data value set transfer application, the organisation unit in the target DHIS2 server is not the same as the source. Therefore, before posting `dataValueSet` to the target instance, we swap out its source organisation unit ID with the target organisation unit ID: 

```java
dataValueSet.setOrgUnit( "lc3eMKXaEfw" );
```

This line highlights the SDK’s type-safety characteristics. The retrieved `dataValueSet` has its `orgUnit` ID replaced with the target organisation unit ID `lc3eMKXaEfw`.  We proceed to do the same substitution for all organisation units found within `dataValue`:

```java
for ( DataValue__1 dataValue : dataValueSet.getDataValues().get() ) {
    dataValue.setOrgUnit( "lc3eMKXaEfw" );
}
```

* `dataValueSet.getDataValues().get()` retrieves the data values from the data value set. Each getter in the resource classes returns an `java.uti.Optional` wrapped around the value. The `get()` method unwraps the value if one is present, otherwise it will throw a `java.util.NoSuchElementException` Having an optional wrapper is useful because like this we can represent absent values and nulls in distinct ways.

* On each retrieved data value, the target organisation unit is set with `dataValue.setOrgUnit( "lc3eMKXaEfw" )`.

Time to turn our attention to saving the data values to the target server. The following should look familiar:

```java
Dhis2Client targetDhis2Client = Dhis2ClientBuilder.newClient( "https://target.dhis2.org/api", "d2pat_6xVA12xyUbWNedQxy4ohH77WlxRGVvZZ1151814092" ).build();
```

Like the source server, a `Dhis2Client` is built for the target server. The only thing left now is posting the modified data values with `targetDhis2Client`:

```java
targetDhis2Client.post( "dataValueSets" )
    .withResource( dataValueSet )
    .transfer()
    .close();
```

The `post` method is invoked on `targetDhis2Client`, passing as a parameter the API endpoint `dataValueSets`. Before executing the HTTP call by invoking `transfer()`, the body for the HTTP POST is specified using `withResource( dataValueSet )`. 

:::info
In addition to accepting POJOs, `withResource(...)` accepts plain JSON strings. `Dhis2Client` will serialise POJOs into JSON  while leaving objects of type string as they are.
:::

The `close` method terminating the method chain merits special consideration. Omitting `close()` will lead to the HTTP connection remaining open. Normally, you would need to explicitly close the connection unless you’re consuming the response with `returnAs(...)` or `read()`. Needlessly leaving connections open will likely degrade the runtime performance and cause the application to misbehave.

:::info
Our example application is more or less complete from a functional perspective. Yet, no application is really complete without automating testing! [Read our earlier blog post about automating integrations tests for DHIS2 integration apps](https://developers.dhis2.org/blog/2022/02/automating-dhis2-integration-tests-in-junit-5) to learn more.
:::

It's still early days for the DHIS2 Java SDK but we invite you to give it a whirl and give us feedback on the DHIS2 [community of practice](https://community.dhis2.org/). Code contributions are more than welcome on the project's GitHub repo.
