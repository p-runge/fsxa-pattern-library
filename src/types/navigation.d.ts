import { NavigationProps as UINavigationProps } from "fsxa-ui";
import { NavigationItem } from "fsxa-api";

export type NavigationProps = Pick<
  UINavigationProps<NavigationItem>,
  "handleNavClick" | "isActiveItem"
>;
