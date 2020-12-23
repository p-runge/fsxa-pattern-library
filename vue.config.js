// eslint-disable-next-line
const path = require("path");

module.exports = {
  chainWebpack: config => {
    config.resolve.symlinks(false);
    config.resolve.alias.set("vue", path.resolve("./node_modules/vue"));
    config.resolve.alias.set(
      "fsxa-pattern-library",
      path.resolve("./src/index.ts"),
    );
    if (process.env.NODE_ENV === "production")
      config.externals({ "fsxa-api": "fsxa-api" });
  },
};
