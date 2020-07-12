import { FSXAConfiguration, ObjectMap } from "fsxa-api";

export const getFSXAConfigFromEnvFile = (): FSXAConfiguration => {
  return {
    apiKey: process.env.VUE_APP_API_KEY,
    caas: process.env.VUE_APP_CAAS,
    projectId: process.env.VUE_APP_PROJECT_ID,
    navigationService: process.env.VUE_APP_NAVIGATION_SERVICE,
    mode: process.env.VUE_APP_MODE,
    remotes: process.env.VUE_APP_REMOTES
      ? process.env.VUE_APP_REMOTES.split(";").reduce(
          (result: ObjectMap<string>, remote: string) => {
            const [key, value] = remote.split(":");
            return {
              ...result,
              [key]: value,
            };
          },
          {},
        )
      : {},
  };
};

export const getFSXAConfigForStorybook = (): FSXAConfiguration => {
  return {
    apiKey: process.env.STORYBOOK_API_KEY,
    caas: process.env.STORYBOOK_CAAS,
    projectId: process.env.STORYBOOK_PROJECT_ID,
    navigationService: process.env.STORYBOOK_NAVIGATION_SERVICE,
    mode: process.env.STORYBOOK_MODE,
    remotes: process.env.STORYBOOK_REMOTES
      ? process.env.STORYBOOK_REMOTES.split(";").reduce(
          (result: ObjectMap<string>, remote: string) => {
            const [key, value] = remote.split(":");
            return {
              ...result,
              [key]: value,
            };
          },
          {},
        )
      : {},
  };
};
