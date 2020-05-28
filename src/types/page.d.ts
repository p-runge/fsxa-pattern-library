export interface ComposedPageProps {
  id: string;
  renderNavigation?: RenderNavigationHook;
}

export type RenderNavigationHook = (activePageId?: string) => JSX.Element;

export interface BaseSectionProps<Payload> {
  payload: Payload;
}
