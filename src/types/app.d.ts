import * as tsx from "vue-tsx-support";
import BaseNavigation from "@/components/BaseNavigation";
import BaseLayout from "@/components/BaseLayout";
import BaseSection from "@/components/BaseSection";
import BaseComponent from "@/components/BaseComponent";

type Constructor<I> = new (...args: any[]) => I;

export interface AppProps {
  header?: typeof BaseComponent;
  layouts?: {
    [key: string]: typeof BaseLayout;
  };
  navigation?: typeof BaseNavigation;
  sections?: {
    [key: string]: typeof BaseSection;
  };
}
export class App extends tsx.Component<AppProps> {}
