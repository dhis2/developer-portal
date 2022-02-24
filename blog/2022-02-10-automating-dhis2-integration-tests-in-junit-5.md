---
slug: 2022/02/automating-dhis2-integration-tests-in-junit-5
title: Automating tests for DHIS2 integrations with JUnit 5
author: claudemamo
tags: [docker, junit, testcontainers, integration, testing, dhis2]
---

DHIS2 is a platform that can receive and host data from different sources, while it can also share data with other systems and reporting mechanisms. [Integrating with DHIS2](https://dhis2.org/integration), or any integration for that matter, entails manual or automated testing of the integration itself. The growth of container technology, and in particular Docker, has reduced the pain of automating the testing of integrations. By automating, I mean self-contained integration test suites that run out-of-the-box and require no manual set up of their external runtime dependencies ([Docker Engine](https://docs.docker.com/engine/install/) is assumed to be installed on the machine running the tests). 

DHIS2 releases are already published as Docker images to Docker Hub (see how to get a Docker container up and running in our [Getting Started Guide](https://developers.dhis2.org/docs/)). This post demonstrates how a project integrating DHIS2, such as connecting DHIS2 with another data collection tool, can have its tests automated with Docker. The code examples shown are specific to Java 11 and JUnit 5 but can be adapted to many other programming languages and test frameworks. The complete code example is [available on GitHub](https://github.com/dhis2/integration-examples/tree/main/integration-test) for those who want to take a deep dive into the code.

### Application Under Test

We began with a brief description of the Java application under test. A bare-bones solution for sharing the aggregate data of the national DHIS2 system with a regional DHIS2 server. In concrete terms, the code synchronises, in one direction, the [data value sets](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data.html) between two DHIS2 instances hosting different [organisation units](https://docs.dhis2.org/en/implement/database-design/organisation-units.html):

```java
...
...

public final class IntegrationApp
{
    public static void main( String[] args )
    {
        String sourceDhis2ApiUrl = args[0];
        String sourceDhis2ApiUsername = args[1];
        String sourceDhis2ApiPassword = args[2];
        String sourceOrgUnitId = args[3];

        String targetDhis2ApiUrl = args[4];
        String targetDhis2ApiUsername = args[5];
        String targetDhis2ApiPassword = args[6];
        String targetOrgUnitId = args[7];

        String dataSetId = args[8];
        String period = args[9];

        ...
    }
}
```

The entry point of `IntegrationApp` expects arguments identifying both the source and target DHIS2 servers, user accounts, as well as organisation units. Besides these inputs, it expects the data set UID and period for the data value sets that `IntegrationApp` will pull down from the source server.

Given these arguments, the application leverages the convenient HTTP client library [Unirest](https://kong.github.io/unirest-java/) to fetch the JSON data value sets from the specified source DHIS2 instance and push them to the destination:

```java
...
...

public final class IntegrationApp
{
    public static void main( String[] args )
    {
        ...
        ...

        // pull data value sets from source DHIS2 instance
        HttpResponse<JsonNode> dataValueSets = Unirest.get(
                sourceDhis2ApiUrl + "/dataValueSets?dataSet={dataSetId}&period={period}&orgUnit={orgUnitId}" )
            .routeParam( "dataSetId", dataSetId )
            .routeParam( "period", period )
            .routeParam( "orgUnitId", sourceOrgUnitId )
            .basicAuth( sourceDhis2ApiUsername, sourceDhis2ApiPassword ).asJson();

        // replace source org unit ID with target org unit ID
        dataValueSets.getBody().getObject().put( "orgUnit", targetOrgUnitId );
        for ( Object dataValue : dataValueSets.getBody().getObject().getJSONArray( "dataValues" ) )
        {
            ((JSONObject) dataValue).put( "orgUnit", targetOrgUnitId );
        }

        // push data value sets to destination DHIS2 instance
        Unirest.post( targetDhis2ApiUrl + "/dataValueSets" )
            .contentType( ContentType.APPLICATION_JSON.toString() )
            .body( dataValueSets.getBody() )
            .basicAuth( targetDhis2ApiUsername, targetDhis2ApiPassword ).asString();
    }
}
```

Note that, before uploading the data value sets, the application swaps out the source organisation unit UIDs with the target ones. The downstream DHIS2 has distinct organisation unit UIDs so it can’t recognise the UIDs from the upstream server.

### Integration Test

The following sections describe the JUnit integration test covering the application's happy path. For `IntegrationApp` to behave correctly, the test case stands up the source and target DHIS2 instances before proceeding to seeding them with test data. The DHIS2 servers, along with their PostgreSQL databases, are spun up and wired with the help of [Testcontainers](https://www.testcontainers.org/). Testcontainers is a delightful polyglot library that allows you to create referenceable Docker containers from within your test case.

#### Container Set Up

With Testcontainers, the DHIS2 web app and PostgreSQL Docker containers are created for both the source and target:

```java
...
...

@Testcontainers
public class IntegrationAppTestCase
{
    @Container
    public static final PostgreSQLContainer<?> SOURCE_POSTGRESQL_CONTAINER = newPostgreSqlContainer();
 
    @Container
    public static final GenericContainer<?> SOURCE_DHIS2_CONTAINER = newDhis2Container( SOURCE_POSTGRESQL_CONTAINER );
 
    
    @Container
    public static final PostgreSQLContainer<?> TARGET_POSTGRESQL_CONTAINER = newPostgreSqlContainer();
 
    @Container
    public static final GenericContainer<?> TARGET_DHIS2_CONTAINER = newDhis2Container( TARGET_POSTGRESQL_CONTAINER );
    
    ...
    ...
}
```

Jumping to the `newPostgreSqlContainer` method reveals the following:

```java
private static PostgreSQLContainer<?> newPostgreSqlContainer()
{
    return new PostgreSQLContainer<>( DockerImageName.parse( "postgis/postgis:12-3.2-alpine" )
    .asCompatibleSubstituteFor( "postgres" ) )
    .withDatabaseName( "dhis2" )
    .withNetworkAliases( "db" )
    .withUsername( "dhis" )
    .withPassword( "dhis" ).withNetwork( Network.newNetwork() );
}
```

`newPostgreSqlContainer` launches a PostgreSQL container based on the `postgis/postgis:12-3.2-alpine` image. The container is created on a new network in order to prevent network alias collisions with the second PostgreSQL container. Similar to `newPostgreSqlContainer`, `newDhis2Container` creates a DHIS2 container from the `dhis2/core:2.36.7` image:

```java
private static GenericContainer<?> newDhis2Container( PostgreSQLContainer<?> postgreSqlContainer )
{
    return new GenericContainer<>( DockerImageName.parse( "dhis2/core:2.36.7" ) )
    .dependsOn( postgreSqlContainer )
    .withClasspathResourceMapping( "dhis.conf", "/DHIS2_home/dhis.conf", BindMode.READ_WRITE )
    .withNetwork( postgreSqlContainer.getNetwork() ).withExposedPorts( 8080 )
    .waitingFor( new HttpWaitStrategy().forStatusCode( 200 ) )
    .withEnv( "WAIT_FOR_DB_CONTAINER", "db" + ":" + 5432 + " -t 0" );
}
```

Here's a rundown of the DHIS2 container configuration:

* the container connects to the same network as the given `PostgreSQLContainer`. This permits the containers to talk to one another.


* the image-specific [environment parameter](https://developers.dhis2.org/blog/2019/10/dhis2-and-docker/#dhis2-with-pre-populated-postgres-database-using-docker-compose) `WAIT_FOR_DB_CONTAINER` is set so that the DHIS2 container waits until the database port `5432` is reachable before it starts: the database needs to be in a ready state before DHIS2 can initialise.


* `waitingFor` blocks the test runner from executing any further until the DHIS2 server is able to accept HTTP requests.


* the DHIS2 config is sourced from the host `dhis.conf`, located in the Java test classpath:

  ```
  connection.dialect = org.hibernate.dialect.PostgreSQLDialect
  connection.driver_class = org.postgresql.Driver
  connection.url = jdbc:postgresql://db:5432/dhis2
  connection.username = dhis
  connection.password = dhis
  ```

    As shown above, the host's `dhis.conf` addresses the database container by its network alias. Keep in mind that the database port no. 5432 is not reachable from the outside world, but only reachable from within the DHIS2 container, because the Docker network is isolated from the host's network.

#### Data Set Up

The next step, as part of the test set up, is seeding the DHIS2 instances using the nifty web service testing library [REST Assured](https://rest-assured.io/). REST Assured sends HTTP requests to the DHIS2 web service endpoints defined as:

```java
@BeforeAll
public static void beforeAll()
    throws IOException
{
    sourceDhis2ApiUrl = String.format( "http://localhost:%s/api", SOURCE_DHIS2_CONTAINER.getFirstMappedPort() );
    targetDhis2ApiUrl = String.format( "http://localhost:%s/api", TARGET_DHIS2_CONTAINER.getFirstMappedPort() );
    
    ...
    ...
}
```

`sourceDhis2ApiUrl` and  `targetDhis2ApiUrl` point to the DHIS2 API URLs of the DHIS2 containers. It's worth highlighting that the HTTP port numbers of the DHIS2 servers are obtained with `GenericContainer#getFirstMappedPort()`. These URLs serve as the base paths for the REST Assured request templates seen next:

```java
@BeforeAll
public static void beforeAll()
    throws IOException
{
    ...
    ...
        
    sourceRequestSpec = new RequestSpecBuilder().setBaseUri( sourceDhis2ApiUrl ).build()
        .contentType( ContentType.JSON ).auth().preemptive().basic( DHIS2_API_USERNAME, DHIS2_API_PASSWORD );

    targetRequestSpec = new RequestSpecBuilder().setBaseUri( targetDhis2ApiUrl ).build()
        .contentType( ContentType.JSON ).auth().preemptive().basic( DHIS2_API_USERNAME, DHIS2_API_PASSWORD );

    ...
    ...
}
```

`sourceRequestSpec` is the request template REST Assured uses to build the API requests for the source DHIS2 container. In the same fashion, requests for the target DHIS2 container are based on `targetRequestSpec`.

In the subsequent code, we can observe the request templates being passed around to seed the DHIS2 servers:

```java
@BeforeAll
public static void beforeAll()
    throws IOException
{
    ...
    ...

    sourceOrgUnitId = createOrgUnit( sourceRequestSpec );
    targetOrgUnitId = createOrgUnit( targetRequestSpec );

    createOrgUnitLevel( sourceRequestSpec );
    createOrgUnitLevel( targetRequestSpec );

    addOrgUnitToUser( sourceOrgUnitId, ADMIN_USER_ID, sourceRequestSpec );
    addOrgUnitToUser( targetOrgUnitId, ADMIN_USER_ID, targetRequestSpec );

    importMetaData( sourceRequestSpec );
    importMetaData( targetRequestSpec );

    addOrgUnitToDataSet( sourceOrgUnitId, MALARIA_STOCK_DATA_SET_ID, sourceRequestSpec );
    addOrgUnitToDataSet( targetOrgUnitId, MALARIA_STOCK_DATA_SET_ID, targetRequestSpec );

    ...
}
```

Apart from creating test organisation units and assigning permissions, the `@BeforeAll` hook imports the _Malaria Aggregate_ metadata package into both instances with the `importMetaData` method.

Let's drill into the `createOrgUnit` method for a general idea of how the request template is handled:

```java
private static String createOrgUnit( RequestSpecification requestSpec )
{
    Map<String, ? extends Serializable> orgUnit = Map.of( "name", "Acme",
    "shortName", "Acme",
    "openingDate", new Date().getTime() );

    return given( requestSpec ).body( orgUnit )
    .when().post( "/organisationUnits" )
    .then().statusCode( 201 )
    .extract().path( "response.uid" );
}
```

Assuming the HTTP response status code is 201, `createOrgUnit` creates an organisation unit named `Acme` and returns its UID to the caller. `beforeAll` calls this method twice: once for the source DHIS2 and another for the target DHIS2. The returned UIDs are used as parameters for creating other DHIS2 resources and running `IntegrationApp`.

The final step in `beforeAll` is populating the source with the data value sets:

```java
@BeforeAll
public static void beforeAll()
    throws IOException
{
    ...
    ...
        
    createDataValueSets( sourceOrgUnitId, MALARIA_STOCK_DATA_SET_ID, sourceRequestSpec );
}
```

`createDataValueSets` seeds the source instance with data value sets capturing the Malaria stock data. The data set itself is defined in the imported metadata package. Stepping into the method we find:

```java
private static void createDataValueSets( String orgUnitId, String dataSetId, RequestSpecification requestSpec )
{
    List<Map<String, String>> dataValues = List.of( 
        Map.of( "dataElement", "CBKXL15dSwQ", 
                "value", String.valueOf( ThreadLocalRandom.current().nextInt( 0, Integer.MAX_VALUE ) ) ),
        Map.of( "dataElement", "BdRI37FNDJs", 
                "value", String.valueOf( ThreadLocalRandom.current().nextInt( 0, Integer.MAX_VALUE ) ) ),
        Map.of( "dataElement", "RRA1O37nLn0", 
                "value", String.valueOf( ThreadLocalRandom.current().nextInt( 0, Integer.MAX_VALUE ) ) ),
        Map.of( "dataElement", "CPBuuIiDnn8", 
                "value", String.valueOf( ThreadLocalRandom.current().nextInt( 0, Integer.MAX_VALUE ) ) ),
        Map.of( "dataElement", "HOEMlLX5SMC", 
                "value", String.valueOf( ThreadLocalRandom.current().nextInt( 0, Integer.MAX_VALUE ) ) ),
        Map.of( "dataElement", "f7z0IhHVWBT", 
                "value", String.valueOf( ThreadLocalRandom.current().nextInt( 0, Integer.MAX_VALUE ) ) );

    Map<String, Object> dataValueSet = Map.of( "dataSet", dataSetId,
        "completeDate", "2022-02-03",
        "period", "202201",
        "orgUnit", orgUnitId,
        "dataValues", dataValues );

    given( requestSpec ).body( dataValueSet ).
        when().post( "/dataValueSets" ).
        then().statusCode( 200 );
  }
```

A list of data values is created where each data value is assigned a random integer and a hard-coded UID of a data element defined in the metadata package. The data values are collected into a data value set and POSTed to the source server.

#### Test Method

Last but not least is the test itself:

```java
@Test
public void test()
{
    IntegrationApp.main(
        new String[]{ sourceDhis2ApiUrl,
                      DHIS2_API_USERNAME,
                      DHIS2_API_PASSWORD,
                      sourceOrgUnitId,
                      targetDhis2ApiUrl,
                      DHIS2_API_USERNAME,
                      DHIS2_API_PASSWORD,
                      targetOrgUnitId,
                      MALARIA_STOCK_DATA_SET_ID,
                      "202201"
                    });
 
    given( targetRequestSpec ).get(
              "/dataValueSets?dataSet={dataSetId}&period={period}&orgUnit={orgUnitId}", MALARIA_STOCK_DATA_SET_ID,
              "202201",
              targetOrgUnitId ).
          then().statusCode( 200 ).body( "dataValues.size()", equalTo( 6 ) );
}
```

The entry point of `IntegrationApp` is invoked with the expected list of parameters described [earlier](#Application-Under-Test). The test post condition is expressed as a REST Assured statement, asserting that (1) the target organisation's malaria stock data value set can be successfully fetched for the `202201` period and (2) the data value set has 6 data values, equal to the number of data values POSTed to the source server.

Do you have comments about this approach to integration testing? We love hearing your thoughts over at the [Community of Practice discussion board](https://community.dhis2.org/).