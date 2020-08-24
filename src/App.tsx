import Component from "vue-class-component";
import BaseComponent from "./components/BaseComponent";
import Page from "./components/Page";
import BaseAppLayout from "./components/BaseAppLayout";

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
      <Page
        currentPath={this.route}
        devMode
        defaultLocale="en_GB"
        locales={["de_DE", "en_GB"]}
        handleRouteChange={route => {
          if (route) this.changeRoute(route);
        }}
      />
    );
  }
}
export default App;
