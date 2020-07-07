import FSXABaseComponent from "./FSXABaseComponent";
import Component from "vue-class-component";
import { NavigationData } from "fsxa-api";
import { FSXAGetters } from "@/store";

export interface BaseNavigationProps {
  navigationData: NavigationData;
}
@Component
class BaseNavigation extends FSXABaseComponent<BaseNavigationProps> {
  get navigationData(): NavigationData {
    return this.$store.getters[FSXAGetters.navigationData];
  }
}
export default BaseNavigation;
