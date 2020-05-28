import Component from "vue-class-component";
import "fsxa-ui/dist/fsxa-ui.css";
import * as tsx from "vue-tsx-support";
import ComposedPage from "./components/ComposedPage";
import "./assets/tailwind.css";
import ConfigProvider from "./components/ConfigProvider";

@Component({
  name: "App"
})
class App extends tsx.Component<{}> {
  render() {
    return (
      <div>
        <ConfigProvider debugMode={true}>
          <ComposedPage id="c8a158a3-2ba3-427c-a7e4-7d41d9844464" />
        </ConfigProvider>
      </div>
    );
  }
}
export default App;
