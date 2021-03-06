![merdaccio logo](https://github.com/merdaccio/merdaccio/raw/master/assets/bitmap/merdaccio%402x.png)

![merdaccio gif](https://user-images.githubusercontent.com/558752/52916111-fa4ba980-32db-11e9-8a64-f4e06eb920b3.png)

# Version 4

[merdaccio](https://merdaccio.org/) is a simple, **zero-config-required local private npm registry**.
No need for an entire database just to get started! merdaccio comes out of the box with
**its own tiny database**, and the ability to proxy other registries (eg. npmjs.org),
caching the downloaded modules along the way.
For those looking to extend their storage capabilities, merdaccio
**supports various community-made plugins to hook into services such as Amazon's s3,
Google Cloud Storage** or create your own plugin.


[![merdaccio (latest)](https://img.shields.io/npm/v/merdaccio/latest.svg)](https://www.npmjs.com/package/merdaccio)
[![merdaccio (next)](https://img.shields.io/npm/v/merdaccio/next.svg)](https://www.npmjs.com/package/merdaccio)
[![merdaccio (next)](http://img.shields.io/npm/dy/merdaccio.svg)](https://www.npmjs.com/package/merdaccio)
[![docker pulls](https://img.shields.io/docker/pulls/merdaccio/merdaccio.svg?maxAge=43200)](https://merdaccio.org/docs/en/docker.html)
[![backers](https://opencollective.com/merdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/merdaccio)
[![stackshare](https://img.shields.io/badge/Follow%20on-StackShare-blue.svg?logo=stackshare&style=flat)](https://stackshare.io/merdaccio)

![circle ci status](https://circleci.com/gh/merdaccio/merdaccio.svg?style=shield&circle-token=:circle-token)
[![codecov](https://img.shields.io/codecov/c/github/merdaccio/merdaccio/master.svg)](https://codecov.io/gh/merdaccio/merdaccio)
[![discord](https://img.shields.io/discord/388674437219745793.svg)](http://chat.merdaccio.org/)
[![node](https://img.shields.io/node/v/merdaccio/latest.svg)](https://www.npmjs.com/package/merdaccio)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/merdaccio/localized.svg)](https://crowdin.com/project/merdaccio)


[![Twitter followers](https://img.shields.io/twitter/follow/merdaccio_npm.svg?style=social&label=Follow)](https://twitter.com/merdaccio_npm)
[![Github](https://img.shields.io/github/stars/merdaccio/merdaccio.svg?style=social&label=Stars)](https://github.com/merdaccio/merdaccio/stargazers)


## Install

Install with npm:

```bash
npm install --global merdaccio
```

## What does merdaccio do for me?

### Use private packages

If you want to use all benefits of npm package system in your company without sending all code to the public, and use your private packages just as easy as public ones.

### Cache npmjs.org registry

   If you have more than one server you want to install packages on, you might want to use this to decrease latency
   (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache) or avoid issues like *[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)*, *[Many packages suddenly disappeared](https://github.com/npm/registry-issue-archive/issues/255)* or *[Registry returns 404 for a package I have installed before](https://github.com/npm/registry-issue-archive/issues/329)*.

### Link multiple registries

If you use multiples registries in your organization and need to fetch packages from multiple sources in one single project you might take advance of the uplinks feature with merdaccio, chaining multiple registries and fetching from one single endpoint.


### Override public packages

If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accept pull request yet), you can publish your version locally under the same name. See in detail each of these [use cases](https://github.com/merdaccio/merdaccio/tree/master/docs/use-cases.md).

### E2E Testing

merdaccio has proved to be a lightweight registry that can be
booted in a couple of seconds, fast enough for any CI. Many open source projects use merdaccio for end to end testing, to mention some examples, **create-react-app**, **mozilla neutrino**, **pnpm**, **storybook**, **alfresco** or **eclipse theia**. You can read more in dedicated article to E2E in our blog.


## Get Started

Run in your terminal

```bash
merdaccio
```

You would need set some npm configuration, this is optional.

```bash
$ npm set registry http://localhost:4873/
```

Now you can navigate to [http://localhost:4873/](http://localhost:4873/) where your local packages will be listed and can be searched.

> Warning: merdaccio does not currently support PM2's cluster mode, running it with cluster mode may cause unknown behavior.

## Publishing

#### 1. create an user and log in

```bash
npm adduser --registry http://localhost:4873
```

> if you use HTTPS, add an appropriate CA information ("null" means get CA list from OS)

```bash
$ npm set ca null
```

#### 2. publish your package

```bash
npm publish --registry http://localhost:4873
```

This will prompt you for user credentials which will be saved on the `merdaccio` server.


## Docker

Below are the most commonly needed informations,
every aspect of Docker and merdaccio is [documented separately](https://www.merdaccio.org/docs/en/docker.html)


```
docker pull merdaccio/merdaccio
```

Available as [tags](https://hub.docker.com/r/merdaccio/merdaccio/tags/).

```
docker pull merdaccio/merdaccio:4.0.0
```

### Running merdaccio using Docker

To run the docker container:

```bash
docker run -it --rm --name merdaccio -p 4873:4873 merdaccio/merdaccio
```

Docker examples are available [in this repository](https://github.com/merdaccio/docker-examples).

## Compatibility

merdaccio aims to support all features of a standard npm client that make sense to support in private repository. Unfortunately, it isn't always possible.

### Basic features

- Installing packages (npm install, npm upgrade, etc.) - **supported**
- Publishing packages (npm publish) - **supported**

### Advanced package control

- Unpublishing packages (npm unpublish) - **supported**
- Tagging (npm tag) - **supported**
- Deprecation (npm deprecate) - not supported - *PR-welcome*

### User management

- Registering new users (npm adduser {newuser}) - **supported**
- Change password (npm profile set password)  - **supported**
- Transferring ownership (npm owner add {user} {pkg}) - not supported, *PR-welcome*

### Miscellany

- Searching (npm search) - **supported** (cli / browser)
- Ping (npm ping) - **supported**
- Starring (npm star, npm unstar, npm stars) - **supported**

### Security

- npm audit - **supported**

## Who is using merdaccio?

Nobody

## Special Thanks

Thanks to the following companies to help us to achieve our goals providing free open source licenses.

[![jetbrain](assets/thanks/jetbrains/logo.png)](https://www.jetbrains.com/)
[![crowdin](assets/thanks/crowdin/logo.png)](https://crowdin.com/)
[![balsamiq](assets/thanks/balsamiq/logo.jpg)](https://balsamiq.com/)

## Open Collective Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/merdaccio#sponsor)]

[![sponsor](https://opencollective.com/merdaccio/sponsor/0/avatar.svg)](https://opencollective.com/merdaccio/sponsor/0/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/1/avatar.svg)](https://opencollective.com/merdaccio/sponsor/1/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/2/avatar.svg)](https://opencollective.com/merdaccio/sponsor/2/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/3/avatar.svg)](https://opencollective.com/merdaccio/sponsor/3/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/4/avatar.svg)](https://opencollective.com/merdaccio/sponsor/4/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/5/avatar.svg)](https://opencollective.com/merdaccio/sponsor/5/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/6/avatar.svg)](https://opencollective.com/merdaccio/sponsor/6/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/7/avatar.svg)](https://opencollective.com/merdaccio/sponsor/7/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/8/avatar.svg)](https://opencollective.com/merdaccio/sponsor/8/website)
[![sponsor](https://opencollective.com/merdaccio/sponsor/9/avatar.svg)](https://opencollective.com/merdaccio/sponsor/9/website)

## Open Collective Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/merdaccio#backer)]

[![backers](https://opencollective.com/merdaccio/backers.svg?width=890)](https://opencollective.com/merdaccio#backers)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].

[![contrubitors](https://opencollective.com/merdaccio/contributors.svg?width=890&button=true)](../../graphs/contributors)

### FAQ / Contact / Troubleshoot

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

* [Blog](https://medium.com/merdaccio)
* [Donations](https://opencollective.com/merdaccio)
* [Roadmaps](https://github.com/merdaccio/merdaccio/projects)
* [Reporting an issue](https://github.com/merdaccio/merdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
* [Running discussions](https://github.com/merdaccio/merdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
* [Chat](http://chat.merdaccio.org/)
* [Logos](https://merdaccio.org/docs/en/logo)
* [FAQ](https://github.com/merdaccio/merdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
* [Docker Examples](https://github.com/merdaccio/docker-examples)

### License

merdaccio is [MIT licensed](https://github.com/merdaccio/merdaccio/blob/master/LICENSE)

The merdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch)  files within the /assets folder) is
 [Creative Commons licensed](https://github.com/merdaccio/merdaccio/blob/master/LICENSE-docs).
