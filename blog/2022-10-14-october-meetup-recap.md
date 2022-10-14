---
slug: 2022/10/october-meetup-recap
title: 'October Meetup Recap: Contributions'
authors: rene
tags: [open source, contributions, meetup]
---
On October 13th we had our monthly developer meetup. During this meetup we focussed on contributions towards the products DHIS2 has on Github. This includes everything from mentioning you found a potential bug to a pull-request on one of the repositories. We'll recap what was discussed in this blog post. 

<!--truncate-->

### Hacktoberfest

This month, October, is all about [Hacktoberfest](https://hacktoberfest.com), a yearly event focussed on getting community members to contribute to open source projects. This is, of course, not limited to DHIS2 but we are participating this year.

So what does this mean to you? Well, specifically for DHIS2 we've gathered some tickets and listed them on a dedicated repository focused on contributions. This repository, [dhis2/hacktoberfest](https://github.com/dhis2/hacktoberfest/), lists all instructions on how to participate, references the relevant repositories per ticket, and when applicable also mentions the JIRA ticket related. But we also have many more tickets in JIRA you could look into, but be sure to filter the tickets on unassigned and `open` to make sure you're not doing any work you shouldn't be doing. Then, if you want to pick up a ticket, be sure to open a thread in the CoP's Development section.

This, of course, is just the section limited to DHIS2, to get into any ticket that is open for contributions you can browse all tickets on Github and Gitlab and filter for [any repositories having the `hacktoberfest` topic](https://github.com/topics/hacktoberfest), and from there you can filter/sort by preference.

### Pull Requests
After Hacktoberfest, we discussed Pull Requests, and how to do them. 

1. First, you need to make sure the PR you want to do is one that actually should be done. You wouldn't want to spend time one a pull requests, only for it to be rejected
2. Make sure your commits follow [Conventional Commits ](https://www.conventionalcommits.org) specification, which is in use in most of the repositories by DHIS2.
3. Make sure your code is linted according to the specification per repository

Then, it's time to follow the contribution guidelines which specify how you should submit a PR.