import Component from "vue-class-component";
import ComposedNavigation from "./components/ComposedNavigation";
import "fsxa-ui/dist/fsxa-ui.css";
import ConfigProvider from "./components/ConfigProvider";
import { InteractiveComponent } from "fsxa-ui";
import { FSXAConfiguration } from "./types/store";
import * as tsx from "vue-tsx-support";

@Component({
  name: "App"
})
class App extends tsx.Component<{}> {
  render() {
    return (
      <div>
        <InteractiveComponent<FSXAConfiguration>
          title="Interactive playground"
          subtitle="Feel free to change the configuration parameters and see your Navigation-Service live and in action"
          changeableProps={[
            {
              key: "apiKey",
              default: "49be300d-5314-8fa5-6768-7814ed22509b",
              label: "API-Key",
              type: "string"
            },
            {
              key: "caas",
              default:
                "https://demo-caas-api.e-spirit.cloud/390d0e28-90bf-4640-8211-ea63f3f794e6/preview.content",
              label: "CaaS",
              type: "string"
            },
            {
              key: "navigationService",
              default:
                "https://coba-demo-navigationservice.e-spirit.cloud/navigation/preview.390d0e28-90bf-4640-8211-ea63f3f794e6",
              label: "Navigation-Service",
              type: "string"
            },
            {
              key: "locale",
              default: "de_DE",
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
    );
  }
}
export default App;
