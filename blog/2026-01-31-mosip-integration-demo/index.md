---
slug: 2026/01/mosip-integration-demo
title: MOSIP Integration Demo with DHIS2
authors: [claudemamo, johan, kai]
tags: [reference implementation, announcement]
---

<!-- truncate -->

1. Introduction ("We're supporting MOSIP-DHIS2 integrations and made a demo for a Sri Lanka use-case")
2. What are MOSIP and ESignet
3. The collaboration
    1. Context & Process
    2. Use case
4. The integration
    2. DHIS2 Login with ESignet
    3. Capture plugin for ESignet verification for patient
### FHIR Sync Service
The FHIR sync service moves selected tracker data (TEIs) from DHIS2 into the NEHR-conformant HAPI FHIR server used for the demo. The sync agent detects relevant changes in DHIS2 tracked entities, fetches the full TEI payload via the Web API, and transforms it into FHIR resources that conform to the Sri Lanka NEHR Implementation Guide before pushing them to the FHIR server.

The service is implemented as a lightweight middleware component (`fhir-sync-agent`) built on [Apache Camel](https://developers.dhis2.org/docs/integration/apache-camel/). The overall sync mechanics and routing are handled there. What follows focuses on the transformation layer.

### Transformation layer from DHIS2 to FHIR

#### Input
The sync starts on the DHIS2 side. When a tracked entity is created or updated, the sync agent is triggered and calls the DHIS2 Web API to fetch the tracked entity instance and all relevant data. This gives a complete and consistent view of the entity as exposed by the API.

This tracked entity instance payload, including enrollments and attributes, becomes the single source of truth for the transformation step. 

#### Output
On the output side, the goal is to produce FHIR resources that follow the structure expected by the Sri Lanka NEHR Implementation Guide.

Most tracked entity attributes map directly into a FHIR `Patient` resource. Additional clinical data from attributes is mapped into `Observation` resources and linked to the `Patient`. The `Patient` resource acts as the anchor for the rest of the mapped resources, so they are linked back to the same patient to preserve the data model from DHIS2.

Program stages contain most of the clinical data. Each completed event results in a FHIR `Encounter`, with `Observation` resources created from program stage data elements and linked back to that encounter and patient. These resources are then pushed to the NEHR-compliant FHIR server, where they are used by the patient and clinical portals.

In this demo, the mapping is one-directional. DHIS2 acts as the source system, and the FHIR server as a consumer. 

#### Mapping
The transformation itself is implemented using [Datasonnet](https://datasonnet.com/), with [Jsonnet modules](https://jsonnet.org/) used to structure the mapping logic at the resource level. This was a pragmatic choice: we could express explicit mappings from DHIS2 tracker payloads to FHIR resources without turning the sync agent itself into a Java-based transformation engine.

Datasonnet acts as the entr point. It receives the tracked entity payload fetched from the DHIS2 Web API and build a FHIR transaction bundle from it. The Datasonnet file itself stays small and procedural. It resolves identifiers, iterate over relevant program stage events, and delegates the actual mapping steps to Jsonnet modules. 

A simplifed form looks something like this: 
```js
// fhirBundle.ds

// Import resource-level mappers from Jsonnet modules
import patient_entry, practitioner, encounter, registration, visit, referral

phn    = attr(body, PHN_ATTR_UID)
events = completedEvents(body)

entries(tei) =
    patient(tei)
  + practitioner(tei.updatedBy)
  + for ev in events:
        encounter(phn, ev)
      + registration(phn, ev)
      + visit(phn, ev)
      + referral(phn, ev)

{
  resourceType: "Bundle",
  type: "transaction",
  entry: entries(body)
}
```

All domain-specific mapping lives in the Jsonnet files.

We designed the transformation layer with each `*.libsonnet` module mapping a single concern and mirroring the FHIR resource it produces. There are modules for patient, practitioners, encounters, registrations, visits and referrals. Each module takes a tracked entity, enrollment, or event as input and returns one or more FHIR resources. The Jsonnet modules also contain helpers for resolving values by UID before constructing FHIR resources.

The main libsonnet pattern used is shown below:
```js
// patientResource.libsonnet

{
  patient_entry(ds, tei)::

    // Attribute UIDs (examples)
    local ATTR_FULLNAME = "VQl0wK3eqiw";
    local ATTR_PHN      = "IrUmPkFMDU5";
    local ATTR_DOB      = "Yie7mOY913J";
    local ATTR_GENDER   = "p7zizFkC6Lv";

    // Helpers
    local getAttrById(uid) = ...;
    local parseName(fullName) = ...;

    {
      fullUrl: "urn:uuid:" + tei.trackedEntity,
      resource: {
        resourceType: "Patient",

        // NEHR profile
        meta: {
          profile: [
            "http://fhir.health.gov.lk/ips/StructureDefinition/ips-patient"
          ]
        },

        // Identifiers resolved from DHIS2 attributes
        identifier: [
          {
            system: "http://fhir.health.gov.lk/ips/identifier/phn",
            value: getAttrById(ATTR_PHN)
          }
        ],

        // Core demographics
        name: parseName(getAttrById(ATTR_FULLNAME)),
        birthDate: getAttrById(ATTR_DOB),
        gender: ds.lower(getAttrById(ATTR_GENDER))
      },

      // Idempotent upsert using NEHR PHN identifier
      request: {
        method: "PUT",
        url: "Patient?identifier=http://fhir.health.gov.lk/ips/identifier/phn|"
             + getAttrById(ATTR_PHN)
      }
    }
}
```

Visit, registration and referral mappings follow the same structure. Event data elements are turned into clinical resources (for example `Observation`) and linked back to both the encounter and the patient. The Datasonnet script then assembles the bundle, while Jsonnet defines what each resource looks like.

This structure worked well for the demo. The mappings are easy to set up, and changes tend to stay local to a single file. The transformation layer stays decoupled from the rest of the `fhir-sync-agent`. Adding a new mapping usually means adding a new Jsonnet module and including it in the Datasonnet entry point.

Due to this decoupling, it is also easier to test. Example tracker payloads can be run through the transformation and validated against expected FHIR output at both resource and bundle level, which made the NEHR alignment validation easier.

    5. NEHR
    6. Patient portal & Clinician portal
5. Next steps
6. Closing thoughts
