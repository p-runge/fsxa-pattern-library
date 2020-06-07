import "vue-tsx-support/enable-check";
import "./assets/tailwind.css";
export { default as FSXAConfigProvider } from "./components/FSXAConfigProvider";
export { default as FSXAPage } from "./components/FSXAPage";
export { default as FSXABaseSection } from "./components/FSXASection/components/FSXABaseSection";
export { default as FSXABaseComponent } from "./components/FSXABaseComponent";
export { getFSXAModule, FSXAActions, FSXAGetters } from "./store";
export { default as FSXAApi } from "fsxa-api";
