import { FSXAConfiguration, ObjectMap } from "fsxa-api";

export const getFSXAConfigFromEnvFile = (): FSXAConfiguration => {
  return {
    apiKey: process.env.VUE_APP_API_KEY,
    caas: process.env.VUE_APP_CAAS,
    projectId: process.env.VUE_APP_PROJECT_ID,
    navigationService: process.env.VUE_APP_NAVIGATION_SERVICE,
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
