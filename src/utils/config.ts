import { ComparisonQueryOperatorEnum, FSXAConfiguration } from "fsxa-api";

export const getFSXAConfigFromEnvFile = (): FSXAConfiguration => {
  return {
    apiKey: process.env.VUE_APP_API_KEY as string,
    caas: process.env.VUE_APP_CAAS as string,
    projectId: process.env.VUE_APP_PROJECT_ID as string,
    navigationService: process.env.VUE_APP_NAVIGATION_SERVICE as string,
    tenantId: process.env.VUE_APP_TENANT_ID as string,
    mapDataQuery: query => {
      switch (query.name) {
        case "products.produkte_nach_kategorie":
          return [
            {
              operator: ComparisonQueryOperatorEnum.EQUALS,
              field: "formData.tt_categories.value.label",
              value: query.filterParams.category,
            },
          ];
      }
      return [];
    },
  };
};
