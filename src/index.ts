import "./assets/tailwind.css";
import "vue-tsx-support/enable-check";
export { default as FSXAConfigProvider } from "./components/ConfigProvider";
export { default as FSXAPage } from "./components/Page";
export { default as FSXABaseSection } from "./components/Section/components/BaseSection";
export { default as FSXABaseLayout } from "./components/Layout/components/BaseLayout";
export { default as FSXABaseComponent } from "./components/BaseComponent";
export { getFSXAModule, FSXAActions, FSXAGetters } from "./store";
