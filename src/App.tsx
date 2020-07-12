import Component from "vue-class-component";
import "./assets/tailwind.css";
import ConfigProvider from "./components/ConfigProvider";
import BaseComponent from "./components/BaseComponent";
import Page from "./components/Page";

@Component({
  name: "App",
})
class App extends BaseComponent<{}> {
  route = location.pathname;

  changeRoute(route: string) {
    history.pushState(null, "Title", route);
    this.route = route;
  }

  render() {
    return (
      <div class="h-full">
        <ConfigProvider devMode>
          <Page
            currentPath={this.route}
            defaultLocale="en_GB"
            locales={["de_DE", "en_GB"]}
            handleRouteChange={route => {
              if (route) this.changeRoute(route);
            }}
          />
        </ConfigProvider>
      </div>
    );
  }
}
export default App;
