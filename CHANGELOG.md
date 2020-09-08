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
