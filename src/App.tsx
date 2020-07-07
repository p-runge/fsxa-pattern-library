import Component from "vue-class-component";
import FSXAPage from "./components/FSXAPage";
import "./assets/tailwind.css";
import FSXAConfigProvider from "./components/FSXAConfigProvider";
import FSXABaseComponent from "./components/FSXABaseComponent";

@Component({
  name: "App",
})
class App extends FSXABaseComponent<{}> {
  route = location.pathname;

  changeRoute(route: string) {
    history.pushState(null, "Title", route);
    this.route = route;
  }

  render() {
    return (
      <div>
        <FSXAConfigProvider devMode>
          <FSXAPage
            path={this.route}
            handleRouteChange={route => {
              if (route) this.changeRoute(route);
            }}
            renderLayout={content => <div>Das ist mein Layout {content}</div>}
          />
        </FSXAConfigProvider>
      </div>
    );
  }
}
export default App;
