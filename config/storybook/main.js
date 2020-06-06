// eslint-disable-next-line
const Dotenv = require("dotenv-webpack");

module.exports = {
  stories: ["../../src/**/*.stories.(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-actions",
    {
      name: "@storybook/addon-docs",
      options: {
        babelOptions: {
          presets: [
            [
              "@vue/cli-plugin-babel/preset",
              {
                jsx: true,
              },
            ],
          ],
        },
      },
    },
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "@storybook/addon-notes",
  ],
  webpackFinal: async config => {
    config.plugins.push(new Dotenv());
    return config;
  },
};
