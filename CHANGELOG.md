## [2.1.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.1...v2.1.2) (2020-12-15)


### Bug Fixes

* **fragments:** we've removed vue-fragment as dependency since this can break SSR ([04ceaf5](https://github.com/e-Spirit/fsxa-pattern-library/commit/04ceaf511c1976123b6ac9c8a90164602e770bd3))

## [2.1.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.1.0...v2.1.1) (2020-12-14)


### Bug Fixes

* **richtext:** change devMode appearance for RichText-Elements ([12bc7b4](https://github.com/e-Spirit/fsxa-pattern-library/commit/12bc7b4ba980f2b618f57ea8d8a4d02d02cba496))

# [2.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v2.0.0...v2.1.0) (2020-12-14)


### Features

* **richtext:** we upgraded the fsxa-api dependency and switched to the new RichText JSON structure ([e41bb9d](https://github.com/e-Spirit/fsxa-pattern-library/commit/e41bb9d9d89816074237a5f8ce3353b8f50ded04))

# [2.0.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.5.1...v2.0.0) (2020-12-09)


* Feature/refactor (#4) ([d100c6c](https://github.com/e-Spirit/fsxa-pattern-library/commit/d100c6c9d38c64252074c6d69ae32745d0f5ef4b)), closes [#4](https://github.com/e-Spirit/fsxa-pattern-library/issues/4)


### BREAKING CHANGES

* - We removed the default components. Every component must now be mapped in your
project. (we've fully dropped fsxa-ui as dependency)
- You now have to use the FSXAApp as
root-wrapper.
- The interface for providing your component map slightly changed. You now can pass
all of your components through a single property.

## [1.5.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.5.0...v1.5.1) (2020-11-12)


### Bug Fixes

* **misc:** fix multiple errors ([41fccb3](https://github.com/e-Spirit/fsxa-pattern-library/commit/41fccb3ff076243a6fc987225cf9dcf8a46e75b3))

# [1.5.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.4.2...v1.5.0) (2020-10-30)


### Features

* **routing:** added util method to replace FS formatting in richtexts with working links ([#3](https://github.com/e-Spirit/fsxa-pattern-library/issues/3)) ([b68632e](https://github.com/e-Spirit/fsxa-pattern-library/commit/b68632ed5fffaeb31f05999ae2534f431ff8f4e8))

## [1.4.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.4.1...v1.4.2) (2020-10-28)


### Bug Fixes

* **deployment:** fix error where configuration and mode is "forgotten" in deployed pwas ([de08987](https://github.com/e-Spirit/fsxa-pattern-library/commit/de089870917d3bca89c35cb973f6e5de667a5e38))
* **deployment:** use correct content mode instead of api-mode ([d92394d](https://github.com/e-Spirit/fsxa-pattern-library/commit/d92394d52918099e9f1a02affa812229ab2b10aa))
* **typescript:** fix typescript typings and remove unused declarations from imports ([4fd6c43](https://github.com/e-Spirit/fsxa-pattern-library/commit/4fd6c43d071957508e38df15569b4e2fa6216197))

## [1.4.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.4.0...v1.4.1) (2020-10-28)


### Bug Fixes

* **datasets:** fix embedded datasets and add support for dynamic urls ([430e9bc](https://github.com/e-Spirit/fsxa-pattern-library/commit/430e9bcf2f9f28a83f46fed72fdff84c03911295))

# [1.4.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.3.0...v1.4.0) (2020-10-14)


### Features

* **misc:** expose preconfigured fsxaApi through basecomponent and add method to render child comps ([1022faa](https://github.com/e-Spirit/fsxa-pattern-library/commit/1022faafef2bb636487874b1ec73ac77a152fce7))

# [1.3.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.3...v1.3.0) (2020-10-14)


### Features

* **datasets:** add support for datasets ([5fceab3](https://github.com/e-Spirit/fsxa-pattern-library/commit/5fceab362e2b5f9f3ad4d19789844fa715a29294))

## [1.2.3](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.2...v1.2.3) (2020-09-24)


### Bug Fixes

* **i18n:** the page was not showing content on inital load ([17aa294](https://github.com/e-Spirit/fsxa-pattern-library/commit/17aa294e4aed7f6dbe0717196608175c9ae928c7))

## [1.2.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.1...v1.2.2) (2020-09-23)


### Bug Fixes

* **types:** remove wrong import in types ([c19d7d2](https://github.com/e-Spirit/fsxa-pattern-library/commit/c19d7d290324e0920efa3e8d69e966a2563ea903))

## [1.2.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.2.0...v1.2.1) (2020-09-18)


### Bug Fixes

* **multi-language:** fix error, where locale was not set correctly ([5bcd8c8](https://github.com/e-Spirit/fsxa-pattern-library/commit/5bcd8c8cff1e71130435ef9e46d67081e2155554))

# [1.2.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.1.2...v1.2.0) (2020-09-17)


### Features

* **i18n:** we now support multi-language projects ([50d8c83](https://github.com/e-Spirit/fsxa-pattern-library/commit/50d8c839089fb7f7a925dcfecad0409ebb493b2e))

## [1.1.2](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.1.1...v1.1.2) (2020-09-08)


### Bug Fixes

* **store:** we introduced new FSXAModuleParams to meet SSR requirements ([c09ad8d](https://github.com/e-Spirit/fsxa-pattern-library/commit/c09ad8d3c97ceb4043a31a0dc0403b57f75574a5))

## [1.1.1](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.1.0...v1.1.1) (2020-08-25)

### Bug Fixes

- **typescript:** extend FSXABaseComponent instead of Component ([8e72379](https://github.com/e-Spirit/fsxa-pattern-library/commit/8e72379b1c1935fab4c46addc8d1ee219a7ae2d6))

## [1.1.0](https://github.com/e-Spirit/fsxa-pattern-library/compare/v1.0.0...v1.1.0) (2020-08-25)

### Features

- **fsxapage:** extend FSXAPage-Interface to accept components in render-callbacks as well ([5380f1e](https://github.com/e-Spirit/fsxa-pattern-library/commit/5380f1edb21ca67c75a796c4bccd3fb964df128a))
- **fsxapage:** introduce new properties appLayoutComponent and navigationComponent ([968b740](https://github.com/e-Spirit/fsxa-pattern-library/commit/968b74003c0637eda90ea5ef8fdecfedb5fb98ca))

## [1.0.0](https://github.com/e-Spirit/fsxa-pattern-library/releases/tag/v1.0.0) (2020-08-17)

### Bug Fixes

- **introduce new fsxa-api version:** introduce new fsxa-api and refactor code to match new structure ([2fff5f1](https://github.com/e-Spirit/fsxa-pattern-library/commit/2fff5f16d40ce334f61e4c9ce146740169f171e2))

### BREAKING CHANGES

- **introduce new fsxa-api version:** the fsxa-api is now working with the native fetch api, which is not available on
  server side. if you are using the pattern-library make sure that you are polyfilling fetch through
  cross-fetch for example.

---

## 0.1.60

Breaking Changes:

- removed all CSS styling from project. This means that you do not have to import the `fsxa-pattern-library.css` into your project.
- fsxa-ui was transformed to a peer dependency. You have to install it yourself.

## 0.1.59

Breaking Changes:

- removed FSXAConfigProvider. All its properties can now directly be passed to the FSXAPage
