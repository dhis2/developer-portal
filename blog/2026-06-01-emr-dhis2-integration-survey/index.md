---
slug: 2026/06/emr-dhis2-integration-survey
title: What we learned from the EMR–DHIS2 integration survey
authors: [johan]
tags:
    [
        survey,
        emr,
        integration,
        interoperability,
        fhir,
        openhim,
    ]
---

From late 2025 into early 2026, the DHIS2 Extensibility team teamed up with the DHIS2 health domain experts to take a closer look at how EMRs are being used together with DHIS2 today. We ran two surveys to understand what implementers are actually building, and where the recurring pain points sit. This post walks through the headline findings. If you want to dig into the details, you can find the full report [here](https://drive.google.com/file/d/1--mxpTiePDsrBNzmiVy5ggqEmcjDtciU/view?pli=1).

<!-- truncate -->

## What we wanted to find out

More specifically, we wanted to understand which EMRs are being used together with DHIS2 and what technologies are being used to connect them. We were also interested in how mature FHIR adoption is across the ecosystem, both for current integrations and for those being planned.

A quick note on terminology: when we say "EMR" in the report, we mean EMRs specifically, but also any other digital health registry that collects longitudinal patient data. For example DHIS2 Tracker programs. 

## How we ran the surveys

The work was split into two parts.

The first was a more detailed survey done with selected HISP groups, mostly through interviews and walkthroughs of the questions. A good chunk of these were captured during our Ethiopia workshop in December 2025. That gave us 10 responses, with a lot of depth behind each one.

The second was a shorter, [online survey](https://community.dhis2.org/t/survey-emr-implementations-and-emr-dhis2-integrations/70022) distributed through the DHIS2 Community of Practice in early 2026. The goal there was breadth, and we ended up with 35 responses spanning 30 different countries, regions or organizations. Respondents covered a mix of roles, with software developers (20%), program managers (17%) and systems administrators (17%) being the most common, alongside HIS advisors, consultants and data architects.

In total we got 45 responses across the two surveys. That's a modest sample, and many of the questions were open-ended, so the findings are best read as directional rather than statistically representative. That said, the same themes show up consistently across both surveys, which gives us some confidence in the patterns.

## EMRs in use

The clearest signal in the data is that the DHIS2 ecosystem hasn't converged on a single EMR. But a few solutions definitely appear as most common:

- **DHIS2 Tracker programs** (15/28 in the community survey) - used here as a lightweight EMR for specific programs or workflows
- **OpenMRS** (12/28)
- **Bahmni** (10/28) - which is itself a distribution of OpenMRS acting as an EMR + Hospital Information System

The HISP survey mirrors this pretty much exactly. OpenMRS and Bahmni tend to sit as the "full EMR backbone" in facility settings, while DHIS2 Tracker fills in around program-specific workflows.

What this points to is hybrid setups. Program-centric workflows running in one system, facility-centric clinical workflows in another, often within the same country. The choice of EMR is driven more by national strategies and existing investments than by pure technical preference. Several respondents framed it as "we go with what the national architecture supports".

## Integrations are mostly one-way

Just over half of respondents with EMR work already have some form of EMR–DHIS2 data exchange in place (15/28 in the community survey). The dominant pattern is one-way flow into DHIS2, typically for reporting and analytics. Bidirectional exchange shows up in only 3 of those 15 responses, and not at all in the HISP survey's current integrations.

Put differently: most integrations today look like reporting pipelines rather than live synchronization between two operational systems. That shape also explains the kinds of challenges respondents reported; period alignment, update handling, duplicate records, and inconsistent validation between systems.

## The tech stack

The technology choices are diverse, but the underlying architecture is quite consistent. The common pattern is a thin interoperability layer plus custom transformation logic.

[OpenHIM](https://openhim.org/) is the most frequently mentioned middleware (6/14 in the community survey, and prominent in the HISP responses too), usually paired with Python scripts that do the actual transformation work. [Apache Camel](https://camel.apache.org/), [OpenFn](https://www.openfn.org/), [Node.js](https://nodejs.org/en) and [Apache Airflow](https://airflow.apache.org/) also appear, but less often. For smaller implementations, scripted pipelines are often described as the most practical option as they are easy to set up, and easy to maintain.

This pattern shows up again in where the data mapping itself happens. In the community survey, mapping is most often done in the middleware layer (6/15), with the EMR (4/15) and DHIS2 (3/15) taking smaller shares. In other words, the interoperability layer isn't just routing the data, but also often handling the transformation logic as well. 

The trickier parts came up too: SQL-heavy transformations get cumbersome to maintain at scale, and onboarding into new orchestration frameworks (Apache Camel was called out specifically) has a steep learning curve.

## Use of FHIR

FHIR comes up across both surveys as the most-referenced interoperability standard. Roughly half of current integrations in the community survey use FHIR in some form (8/15), and on the HISP side, every single respondent who answered the question on future standards named FHIR.

Two things stand out about how it's actually being used.

First, the motivation respondents describe is mostly internal. Aligning with emerging interoperability standards and global best practices, rather than meeting an external mandate. Second, FHIR is rarely a direct system-to-system interface. It's typically used as an intermediate representation inside the transformation layer, where EMR data is normalized into FHIR before being mapped further into DHIS2. The important consequence is that adopting FHIR doesn't automatically make data mapping simpler. The hard parts like terminology alignment (ICD/LOINC), update semantics, validation, reporting period mismatches, stay hard regardless of whether the payload is FHIR-conformant or not.

## Success stories and challenges

The success stories share a common shape. A middleware layer doing the routing, automated transformation pipelines (often scheduled, like nightly jobs), and well-defined mappings between EMR data and DHIS2 metadata. Several teams also report integrations moving out of pilot phase and being scaled or replicated to additional programs, which suggests the underlying architectures hold up over time.

The challenges are more varied, but a few patterns repeat:

- Complexity of building and maintaining integration pipelines, especially SQL-heavy ones
- Inconsistencies in how updates are handled (e.g., EMR events and observations getting duplicated in DHIS2 when UUIDs aren't reused)
- Differences in reporting periods between systems (weekly vs monthly aggregation)
- Lack of early validation between systems
- Fragmented system landscapes and coordination challenges between teams

## What teams are asking the core team for

When asked what would help most, respondents pointed to a recurring set of themes.

The most frequent ask is for practical, hands-on training. This was commonly phrased as "advanced" rather than introductory, and tied to specific tasks like working with APIs, building pipelines, or using FHIR and OpenHIM. Closely related is the request for reference implementations and reusable pipelines: concrete examples and starter configurations that teams can adapt instead of building the same thing from scratch each time. Several respondents also flagged data mapping and terminology alignment (ICD, LOINC, and similar) as an area where clearer guidance would go a long way.

Teams also want help deciding which data should actually be exchanged, and when individual-level exchange is worth the cost compared to aggregate reporting. There's also a wish for more standardized integration patterns and built-in services, like out-of-the-box support for transformations between DHIS2 and FHIR or CDA.

What we see from the survey results and the feedback we got is that there is a a lot of duplicated effort happening across organizations, and people want shared starting points.

> "It cannot be overemphasized that successful EMR–DHIS2 integration depends on aligning technical design, data governance, and end-user workflows rather than treating it as a purely system-to-system exercise."
>
> — Anonymized response, community survey

## Closing thoughts

Going into this, we expected a fragmented landscape, and that turned out to be true. What surprised us was how much of that landscape clusters around three platforms: [OpenMRS](https://openmrs.org/), [Bahmni](https://www.bahmni.org/) (which is itself a distribution of OpenMRS acting as an EMR + Hospital Information System), and DHIS2 Tracker. Together they account for most of the EMR implementations reported in the surveys. That gives us something concrete to work with. Even in a fragmented ecosystem, those concentrations are where reference implementations and shared tooling can land most effectively. Focusing on this core set of EMRs will hit the largest share of real-world integrations.

On standards, FHIR is the most prominant data-exchange standard reported. For all the future integrations covered in the surveys, FHIR is named as the data-exchange standard of choice, so on the protocol side we are converging. The catch is that FHIR doesn't make the hard parts of integration necessarily any easier. Terminology alignment, update semantics, validation, and reporting period mismatches stay hard whether or not the payload is FHIR-conformant. The protocol is settling, but the mapping work is still a challenge.

Another pattern worth flagging is that more mature integration platforms like OpenFn and Apache Camel show up less often than their maturity might suggest. The cost of bringing in a new interoperability platform tends to outweigh the benefit, so teams stick with what they know and has worked in the past. The most reported integration architecture is OpenHIM together with custom scripts. Reference implementations grounded in those familiar tools will probably land better than ones built on stacks teams haven't already invested in.

What's still missing across all of this is visibility. A lot of valuable work is happening across the community, but isn't being shared in a way that others can easily build on. Two concrete levers stand out: making more of that work public, and producing reference implementations targeted at the dominant EMRs. Better built-in DHIS2 support for transformations between DHIS2 and standards like FHIR would complement both.

We would like to extend a big thank you to everyone who took the time to fill out the survey or sit through an interview, both the HISP groups and the wider community. The full report goes into much more detail across all of these areas, and is well worth a look if any of this resonates with the work you're doing.
