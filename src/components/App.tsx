import BaseComponent from "./BaseComponent";
import { Component } from "vue-property-decorator";
import { NavigationData } from "fsxa-api";
import { FSXAGetters } from "@/store";

export interface AppProps {
  configuration: {
    projectId: string;
    navigationService: string;
    caas: string;
    remotes: {};
  };
  layouts?: {
    [key: string]: any;
  };
  sections?: {
    [key: string]: any;
  };
}
@Component
class App extends BaseComponent<AppProps> {
  // TODO: provide fsxaapi
  // TODO: provide locale
  // TODO: provide devmode
  // TODO: Conditions for devmode

  get navigationData(): NavigationData | null {
    return this.$store.getters[FSXAGetters.navigationData];
  }

  render() {
    // we will render default header and default navigation
    return <div>{/** render header in here */}</div>;
  }
}
export default App;
