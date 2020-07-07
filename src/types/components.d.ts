import FSXAApi, {
  FSXAConfiguration,
  Body,
  BodyContent,
  NavigationData,
} from "fsxa-api";
import * as tsx from "vue-tsx-support";

export class FSXABaseComponent<Props> extends tsx.Component<Props> {
  isDevMode: boolean;
  get isEditMode(): boolean;
  handleRouteChangeRequest: (params: RequestRouteChangeParams) => void;
  get navigationData(): NavigationData | null;
  get globalSettings(): any;
  get $fsxaAPI(): FSXAApi;
  get fsxaConfiguration(): FSXAConfiguration | null;
  get locale(): string;
  fetchImage(url: string, resolution: string): Promise<string | null>;
  fetchImages(
    images: Array<{ url: string; resolution: string }>,
  ): Promise<Array<string | null>[]>;
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
}
export type RenderNavigationHook = (
  params: RenderNavigationHookParams,
) => JSX.Element;

export interface RequestRouteChangeParams {
  pageId?: string;
  route?: string;
}

export type RenderLayoutHook<Settings = any> = (params: {
  navigationData: NavigationData;
  currentPageId: string;
  currentPageRoute: string;
  settings: Settings;
}) => JSX.Element;

export interface FSXAPageProps {
  id?: string;
  path?: string;
  renderNavigation?: RenderNavigationHook;
  renderLayout?: (content: JSX.Element | null) => JSX.Element;
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
  devMode?: boolean;
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
  pageId: string;
  data: Data;
  meta: Meta;
  content: Body[];
  renderContentElement(content: BodyContent): JSX.Element;
  renderContentElements(index: number): JSX.Element[];
}

export interface FSXABaseSectionProps<Payload> {
  payload: Payload;
}
export class FSXABaseSection<Payload> extends FSXABaseComponent<
  FSXABaseSectionProps<Payload>
> {
  payload: Payload;
}
