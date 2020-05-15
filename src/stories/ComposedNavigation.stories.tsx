import ComposedNavigation from "@/components/ComposedNavigation";
import { CreateElement } from "vue";
import { NavigationItemBase, InteractiveComponent } from "fsxa-ui";
import ConfigProvider from "@/components/ConfigProvider";
import { FSXAConfiguration } from "@/types/store";
import createStore from "@/store";

// TODO: Move this type definition into fsxa-api
export type NavigationItem = NavigationItemBase<NavigationItem>;

export default {
  title: "ComposedNavigation",
  component: ComposedNavigation
};

const store = createStore({
  apiKey: "49be300d-5314-8fa5-6768-7814ed22509b",
  caas:
    "https://demo-caas-api.e-spirit.cloud/390d0e28-90bf-4640-8211-ea63f3f794e6/preview.content",
  navigationService:
    "https://coba-demo-navigationservice.e-spirit.cloud/navigation/preview.390d0e28-90bf-4640-8211-ea63f3f794e6",
  locale: "de_DE"
});
export const withNavigationData = () => ({
  store: createStore(),
  // TODO: Check if we can auto-inject h into the render function as this is done with vue-cli as well
  // eslint-disable-next-line
  render: (h: CreateElement) => (
    <div style="height: 800px;">
      <InteractiveComponent<FSXAConfiguration>
        title="Interactive playground"
        subtitle="Feel free to change the configuration parameters and see your Navigation-Service live and in action"
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
          }
        ]}
        renderComponent={props => {
          return (
            <ConfigProvider config={props}>
              <ComposedNavigation
                handleNavClick={item => console.log("Clicked", item)}
              />
            </ConfigProvider>
          );
        }}
      />
    </div>
  )
});
