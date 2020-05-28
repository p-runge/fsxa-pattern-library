import { CreateElement } from "vue";
import { InteractiveComponent } from "fsxa-ui";
import ConfigProvider from "@/components/ConfigProvider";
import { FSXAConfiguration } from "@/types/store";
import createStore from "@/store";
import ComposedPage from "@/components/ComposedPage";

export default {
  title: "ComposedPage",
  component: ComposedPage
};
const store = createStore({
  apiKey: "f5a14f78-d8b8-4525-a814-63b49e0436ee",
  caas:
    "https://caas.staging.delivery-platform.e-spirit.live/0b975076-5061-44e6-bbce-c1d9f73f6606/preview.content",
  navigationService:
    "https://do-caas-core02.navigation.prod.delivery-platform.e-spirit.live/navigation/preview.0b975076-5061-44e6-bbce-c1d9f73f6606",
  locale: "de_DE"
});
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
            type: "string"
          },
          {
            key: "caas",
            default: store.state.fsxa.configuration?.caas,
            label: "CaaS",
            type: "string"
          },
          {
            key: "navigationService",
            default: store.state.fsxa.configuration?.navigationService,
            label: "Navigation-Service",
            type: "string"
          },
          {
            key: "locale",
            default: store.state.fsxa.configuration?.locale,
            label: "Locale",
            type: "string"
          },
          {
            key: "id",
            default: "c8a158a3-2ba3-427c-a7e4-7d41d9844464",
            label: "Page-Id",
            type: "string"
          }
        ]}
        renderComponent={({ id, ...props }) => {
          return (
            <ConfigProvider config={props}>
              <ComposedPage id={id} />
            </ConfigProvider>
          );
        }}
      />
    </div>
  )
});
