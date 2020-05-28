export interface PageProps {
  id: string;
  renderNavigation?: RenderNavigationHook;
}

export type RenderNavigationHook = (activePageId?: string) => JSX.Element;

export interface BaseSectionProps<Payload> {
  payload: Payload;
}
