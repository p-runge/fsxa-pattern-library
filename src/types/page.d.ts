export interface PageProps {
  id?: string;
  path?: string;
  renderNavigation?: RenderNavigationHook;
  handleRouteChange: (nextRoute: string) => void;
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

export interface BaseSectionProps<Payload> {
  payload: Payload;
}
