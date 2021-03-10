---
id: contribute
title: Contribute
---

This is an overview of the process of contributing to the DHIS2 source code.

## DHIS2 Core

This section covers the DHIS2 core, meaning the DHIS2 server backend. You can find the GitHub repository [here](https://github.com/dhis2/dhis2-core).

* **Discuss:** For software features it is recommended to reach out at the DHIS2 developer community forum (found [here](https://community.dhis2.org/c/development/10)) and raise a proposal with the development team. Discussing and clarifying questions around the requirements and design is helpful as adjustments are cheaper to make at the beginning of the development process.
* **Pull request:** The PR title and description should follow the [guidelines](https://github.com/dhis2/wow-backend/blob/master/guides/git_commit_messages.md). The PR should have a description which makes it clear what is being changed and why the change is useful. In particular API changes should be described clearly. Please raise all PRs against the `master` branch and raise new PRs for back-porting to stable versions as needed. DHIS2 Jira is found [here](https://jira.dhis2.org/).
* **Jira issue:** Every PR requires a Jira issue which describes the bug or feature and defines which versions are affected. This is also important to ensure that changes are tested properly- The corresponding Jira issue should be referenced in the PR title in brackets, e.g. like this: `[DHIS2-10644]`.
* **Code style:** The Java code style and formatting for DHIS2 core should follow the [guidelines](https://github.com/dhis2/wow-backend/blob/master/guides/code_formatting.md). DHIS2 core uses the *Speedy Spotless* Maven plugin for automatic code formatting.
* **Test:** The PR should contain at least one unit test, ideally several, which verify and assert new features or changes to existing behavior. 
* **Documentation:** Relevant documentation should be made if the PR adds new features or changes existing behavior, either to the user interface or API. The documentation GitHub repository can be found [here](https://github.com/dhis2/dhis2-docs).
* **Review**: The DHIS2 core developer team regularly monitors available PRs and will do a review of the PR. The PR should be adjusted based on feedback and comments. The PR will be merged to master once approved by two core team members.
* **Celebrate:** Once merged, the commit will be part of the next DHIS2 major release.

