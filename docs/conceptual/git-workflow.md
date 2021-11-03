---
id: git-workflow
title: Git workflow
---

We primarily have two separate workflows, depending on what you need.

If you do not need to backport your changes, the **Standard workflow**
should be a good starting point.

> Jump to the [FAQ](#faq).

## Standard workflow

If you only need your changes on master, the basic workflow will
suffice. No need to complicate things further:

1. **Make sure `master` is up-to-date**
2. **Create a branch for your changes**
3. **Implement and commit your changes**, and repeat.
4. **Open a PR from your branch to `master`**
5. **Use squash-merge when merging to master**
   We follow the [Conventional
   Commit](https://www.conventionalcommits.org)
   specification, so you need to make sure the squash commit message is
   valid manually.

## Backport workflow

If you know that you are going to have to backport your changes to
multiple versions of the code base you can save yourself a lot of
trouble by basing your changes on the correct commit.

### Too long; didn't read

1. **Figure out the target versions** (should be stated in the JIRA
   ticket)
2. **Make sure the target version branches are up-to-date**
3. **Check out the latest common ancestor between the branches**
4. **Create a patch branch**
5. **Implement your changes**
6. **Create a feature branch from your target version branches**
7. **Merge your patch branch into the target version feature branch**
8. **Raise a PR from the feature branches to the respective version
   branch**
9. **Use squash-merge when merging to master**
   We follow the [Conventional
   Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.3/)
   specification, so you need to make sure the squash commit message is
   valid manually.

### Too short; didn't understand

In general, if you are going to target version `v1`, `v2`, and `v3`, you want to
find the commit that is the _latest common ancestor_. In this example
it would be the fork point between `v1` and `v2`.

Git can help you [figure this out](https://git-scm.com/docs/git-merge-base):

```sh
git merge-base --octopus v1 v2 v3
<commit hash>

git show-branch --merge-base v1 v2 v3
<commit hash>
```

These two commands are equivalent. Verify that the commit makes sense
through `git show <commit hash>` on the commit that was output. Does it seem to be the
oldest possible commit?

If it looks good, check out that commit and detach your `HEAD`:

```sh
git checkout <commit hash>
```

This is the commit you will base your branch on, let's give it a sane
name so we can keep track of it. This will be backported to `v1`
through `v3`, so we are going to end up with feature branches for all
those branches, based on this patch branch:

- `dhis2-1234/my-feature-branch-v1`
- `dhis2-1234/my-feature-branch-v2`
- `dhis2-1234/my-feature-branch-v3`

So we are going to use the `-patch` suffix for this one:

```sh
git checkout -b dhis2-1234/my-feature-branch-patch
```

If you now start developing on this branch, it is easier to merge
everything into the version branches.

Once your changes are commited to the patch branch, this branch can be
used to merge your changes into the different target branches.

Sometimes it is possible to set up a PR from the patch branch straight
to the target version branch, e.g.:

- `dhis2-1234/my-feature-patch` to `v1`
- `dhis2-1234/my-feature-patch` to `v2`
- `dhis2-1234/my-feature-patch` to `v3`

If that gives you conflicts you need to add an intermittent step, where
you create a feature branch for each target version branch:

```sh
git checkout v1

git checkout -b dhis2-1234/my-feature-branch-v1
```

Then you merge your patch branch into the target version feature branch:

```sh
git checkout dhis2-1234/my-feature-branch-v1

git merge dhis2-1234/my-feature-branch-patch
```

You will get same the conflicts at this point, and here you can safely
resolve them and test that it still works. This is now the branch you
will setup a pull request for to merge into the target version branch:

- `dhis2-1234/my-feature-branch-v1` to `v1`
- `dhis2-1234/my-feature-branch-v2` to `v2`
- `dhis2-1234/my-feature-branch-v3` to `v3`

The [conventional
commit](https://www.conventionalcommits.org) rules
apply, so when squash-merging you need to make sure you write a message
which is compliant.

# Being a good Gitizen

Here are some ideas on how you can be a good citizen with regards to
Git.

## Save your changes on a granular level

It makes sense not to clutter the `master`/version branches with your
development commits, so you might be thinking about squashing your work
before pushing your branch to GitHub.

We use squash-merges when merging a branch to `master`, so there is no
need to squash your commits before pushing the branch for code review.

When reviewing code, it is sometimes useful to go through the branch
commit by commit to see the feature's evolution, so it is helpful to not
squash the commits before submitting it for code review for that as
well.

When merging your branch after it being approved, you'll be asked to
provide a new merge commit message, make sure you put in a [conventional
commit](https://www.conventionalcommits.org) message.

## Cleanup after your branch has been merged

We have several long-lived branches on GitHub as we use a strategy where
we have one branch per version of DHIS2 we support in addition to the
development trunk which is the `master` branch. These should **not** be
deleted.

Once you've merged your branch, you'll be given the option to delete
your remote branch on GitHub. Normally you should be able to just delete
your branch, so do it.

Otherwise please keep in mind that your branch is still on the remote
repository, and if it becomes stale, it might be deleted at any point.

You should never work on a branch that has been merged already.

If a ticket returned because didn't pass the review, create a new branch
with the same ticket id and an updated description that reflects what
you'll do on that branch.

This means that you can also delete your local branches once you've
merged your pull request if you do not need a local copy for a while.

# FAQ

## What is the convention for commit messages, and also, why?

We use the [conventional commits](https://www.conventionalcommits.org)
to structure our commits in a uniform way, and the _why_ is a big part
of this.

When all commits follow the specification we get two massive wins in
exchange for a minor annoyance.

1. **Auto-generate changelogs**

   Change logs are a very important part of software documentation, and
   it is extremely easy to omit during the development process. It is
   also difficult and time consuming to create an accurate changelog
   for software as time passes. For example, the manually updated
   changelog in d2 lacks updates between 2017 and 2019, but looking at
   the commit history a lot has happened in that timespan.

   By autogenerating the changelogs we can integrate it into the
   release scripts to always have it up-to-date.

   Example: [ui/CHANGELOG.md](https://github.com/dhis2/ui/blob/master/CHANGELOG.md)

2. **Automatically determine the correct semantic version**

   Should the release be a patch, minor, or major version? To know you
   have to go through everything that has changed since the last
   version and understand if it is a breaking change, a new feature, or
   a bug fix.

   This is also timeconsuming and very sensitive work as an incorrect
   bump will have consequences for the consumers of the library or
   application.

   By following the conventional commits specification we can infer
   what version should be the next version from the Git history itself
   which removes the human factor from the equation when determining
   the next version bump.

The price of these two wins is to write commit messages complying to a
standard, i.e. a developer needs to learn and understand the
specification. Thankfully, this is a rather easy spec to understand and
in the front-end code bases we have an automated tool to make sure you
comply.

The structure of a commit message is this:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

The [conventional commits
site](https://www.conventionalcommits.org/en/v1.0.0-beta.3/#summary) has
examples and the rules documented, but the cheat sheet is this:

- `fix:` a commit which fixes a bug and will result in a `PATCH` version
  change.

- `feat:` a commit which introduces a new feature and will result in a
  `MINOR` version change.

- `BREAKING CHANGE:` if the commit message has the text `BREAKING CHANGE:` in its optional body/footer part, the version will change
  to the next `MAJOR` version.

  A `BREAKING CHANGE:` commit can be of any type (`fix:`, `feat:`,
  etc.).

- There are [additional types
  allowed](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional),
  for example `chore:`, `ci:`, `docs:`, etc.

# Why is `cherry-pick` a problem when used to port code between branches?

[This article outlines problems with
`cherry-pick`ing](https://blogs.msdn.microsoft.com/oldnewthing/20180312-00/?p=98215).
It is recommended material to read and understand.

We have seen instances where these problems happen in our code base, and
until we understood the problem avoided using `cherry-pick`ing as a
backport workflow. Since then, we have learned what was the root cause
of the problems and are no longer strict to avoid `cherry-pick`.

**So, when is `cherry-pick`ing a commit considered safe?**

A fundamental requirement for safe `cherry-pick`ing commits is that the
branches that are used as base and the target will **never be
combined**.

As long as the branches are kept separate the problems
outlined in the article above can be avoided. [This requires knowing
upfront that branches will **never, at any point,** be combined in the
future](https://devblogs.microsoft.com/oldnewthing/20180709-00/?p=99195).

## Do we have a convention for our branch names?

Yes. If you have a JIRA ticket that relates to the changes you are
making, you will need to reference that ticket somehow.

Get into the habit of prefixing your branch with the ticket key and then
you don't have to think about it. Some examples below.

```sh
git branch dhis2-1337/my-feature-branch
git branch DHIS2-1337/my-feature-branch

git branch dhis2-1337_my-feature-branch
git branch DHIS2-1337_my-feature-branch
```

After the ticket key prefix it is good to include a string that
describes the changes, as it is common to split a feature into multiple
branches and pull requests which would make just using the ticket key as
the name unwieldy.

```
git branch dhis2-1337/initialise-new-app
git branch dhis2-1337/add-routing
git branch dhis2-1337/refactor-action-creators
```

This also helps when backporting:

```
git branch dhis2-1337/my-bug-fix-branch-v33
git branch dhis2-1337/my-bug-fix-branch-v32
git branch dhis2-1337/my-bug-fix-branch-v31
```
