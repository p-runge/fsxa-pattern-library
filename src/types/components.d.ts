import FSXAApi, { FSXAConfiguration, Body, BodyContent } from "fsxa-api";
import * as tsx from "vue-tsx-support";

export class FSXABaseComponent<Props> extends tsx.Component<Props> {
  get $fsxaAPI(): FSXAApi;
  get locale(): string;
  getStoredItem<Type = any>(key: string): Type | null;
  setStoredItem<Type = any>(key: string, data: Type): void;
}

export interface RenderNavigationHookParams {
  /**
   * The id of the currently active page
   */
  activePageId: string;
  /**
   * The seoRoute of the currently active page
   */
  activeSeoRoute: string;
  /**
   * You have to either pass the pageId or seoRoute of the page that should be displayed.
   */
  handleRouteChange: (params: { pageId?: string; seoRoute?: string }) => void;
}
export type RenderNavigationHook = (
  params: RenderNavigationHookParams,
) => JSX.Element;

export interface FSXAPageProps {
  id?: string;
  path?: string;
  renderNavigation?: RenderNavigationHook;
  handleRouteChange: (nextRoute: string) => void;
}
export class FSXAPage extends FSXABaseComponent<FSXAPageProps> {}

export interface FSXAConfigProviderProps {
  config?: FSXAConfiguration;
  sections?: {
    [key: string]: any;
  };
  layouts?: {
    [key: string]: any;
  };
  debugMode?: boolean;
  editMode?: boolean;
}
export class FSXAConfigProvider extends FSXABaseComponent<
  FSXAConfigProviderProps
> {}

export interface FSXALayoutProps {
  pageId: string;
  type: string;
  content: Body[];
  data: any;
  meta: any;
}
export class FSXALayout extends FSXABaseComponent<FSXALayoutProps> {}

export interface FSXABaseLayoutProps<Data = {}, Meta = {}> {
  pageId: string;
  content: Body[];
  data: Data;
  meta: Meta;
}
export class FSXABaseLayout<Data = {}, Meta = {}> extends FSXABaseComponent<
  FSXABaseLayoutProps<Data, Meta>
> {
  renderContentElement(content: BodyContent): JSX.Element;
  renderContentElements(contentElements: BodyContent[]): JSX.Element[];
}

export interface FSXABaseSectionProps<Payload> {
  payload: Payload;
}
export class FSXABaseSection<Payload> extends FSXABaseComponent<
  FSXABaseSectionProps<Payload>
> {
  payload: Payload;
}
