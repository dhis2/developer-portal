---
slug: 2018/10/build-repos-migrated-to-d2-ci
title: Build repos migrated to d2-ci organization on GitHub
authors: varl
---

Now that the amount of build repos are ranging in the fifties, it's time
for them to find a new home, and using the
[**dhis2-ci**](https://github.com/dhis2-ci) bot-user, the
organization [**d2-ci**](https://github.com/d2-ci) is set up.

<!--truncate-->

# Migrations

All the `dhis2/${NAME}-builds` have been moved to `d2-ci/${NAME}` to
keep the URI to the builds uniform and simple. As we don't have any
conflicts on the base URIs in a new org, there is no reason to use a
suffix.

- In a `package.json` file, this dep: `"maps-app": "github:dhis2/maps-app-builds"`
- Becomes: `"maps-app": "github:d2-ci/maps-app"`

This leaves the main org free from the extra noise of build repos.

# Bot-user

The `dhis2-ci` bot user is a shared account whose password is stored in
the DHIS2 LastPass vault. Ask a DHIS2 core developer like @larshelge or
@varl if you need more information or access to the user.

# Deployment configuration; [`dhis2/deploy-builds`](https://github.com/dhis2/deploy-build)

The new build process for frontend apps and libs means that all of the
configuration for deploying and publishing builds is deferred to the
`deploy-build` and `publish-build` scripts which come together from the
`@dhis2/deploy-builds` package.

The migration was done by modifying two lines (not counting the docs
change) in `deploy-build.sh`,
[ee5efcc](https://github.com/dhis2/deploy-build/commit/ee5efccec82cc85d55f6d7d6654a69fc991dc618),
and one line in `publish-build.sh`,
[4a49777](https://github.com/dhis2/deploy-build/commit/4a4977755f0a04c099a6b764f4ab40c7159564de).

All applications and libraries which are built using the new routine
have this line in their `.travis.yml` file:

```
before_script:
- npm install --global @dhis2/deploy-build
```

That ensures that they get the newest version on each build, which is
handy when you don't want to wade through dozens of apps and libs and do
manual reconfiguration on each of them.

# Related PRs for the interested

- [dhis2-core 2.29](https://github.com/dhis2/dhis2-core/pull/2476)
- [dhis2-core 2.30](https://github.com/dhis2/dhis2-core/pull/2475)
- [dhis2-core 2.31](https://github.com/dhis2/dhis2-core/pull/2477)
