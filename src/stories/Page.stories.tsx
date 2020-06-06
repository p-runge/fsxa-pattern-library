import { CreateElement } from "vue";
import createStore from "@/store";
import FSXAPage from "@/components/FSXAPage";
import { FSXAConfiguration } from "fsxa-api";
import { getFSXAConfigFromEnvFile } from "@/utils/config";
import { InteractiveComponent } from "fsxa-ui";
import FSXAConfigProvider from "@/components/FSXAConfigProvider";

export default {
  title: "FSXAPage",
  component: FSXAPage,
};
const store = createStore(getFSXAConfigFromEnvFile());
export const withCaasData = () => ({
  store,
  // TODO: Check if we can auto-inject h into the render function as this is done with vue-cli as well
  // eslint-disable-next-line
  render: (h: CreateElement) => (
    <div style="height: 800px;">
      <InteractiveComponent<FSXAConfiguration & { id: string }>
        title="Interactive playground"
        subtitle="Feel free to change the configuration parameters and see your Page live and in action"
        changeableProps={[
          {
            key: "apiKey",
            default: store.state.fsxa.configuration?.apiKey,
            label: "API-Key",
            type: "string",
          },
          {
            key: "caas",
            default: store.state.fsxa.configuration?.caas,
            label: "CaaS",
            type: "string",
          },
          {
            key: "navigationService",
            default: store.state.fsxa.configuration?.navigationService,
            label: "Navigation-Service",
            type: "string",
          },
          {
            key: "locale",
            default: store.state.fsxa.configuration?.locale,
            label: "Locale",
            type: "string",
          },
          {
            key: "id",
            default: "c8a158a3-2ba3-427c-a7e4-7d41d9844464",
            label: "Page-Id",
            type: "string",
          },
        ]}
        renderComponent={({ id, ...props }) => {
          return (
            <FSXAConfigProvider config={props}>
              <FSXAPage id={id} handleRouteChange={console.log} />
            </FSXAConfigProvider>
          );
        }}
      />
    </div>
  ),
});
