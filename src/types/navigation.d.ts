import { NavigationProps } from "fsxa-ui";
import { NavigationItem } from "fsxa-api";

export type ComposedNavigationProps = Pick<
  NavigationProps<NavigationItem>,
  "handleNavClick" | "isActiveItem"
>;
