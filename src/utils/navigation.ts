import { NavigationData, NavigationItem } from "fsxa-api";

export const NAVIGATION_ERROR_404 = "Could not find route with given path";
export const determineCurrentRoute = (
  navigationData: Record<string, NavigationData>,
  currentPath: string,
): { item: NavigationItem; locale: string } | null => {
  if (!navigationData || !currentPath || currentPath === "/") return null;
  const path = decodeURIComponent(currentPath || "");
  const availableLocales: string[] = Object.keys(navigationData);
  for (let i = 0; i < availableLocales.length; i++) {
    let node: NavigationItem | null =
      navigationData[availableLocales[i]].idMap[
        navigationData[availableLocales[i]].seoRouteMap[path]
      ] || null;
    if (!node) {
      // the path is not mapped in the seoRouteMap
      // we will check for dynamic routes
      node =
        Object.values(navigationData[availableLocales[i]].idMap)
          .filter((item: any) => item.seoRouteRegex)
          .find((item: any) => path.match(item.seoRouteRegex)) || null;
    }
    if (node)
      return {
        item: node,
        locale: availableLocales[i],
      };
  }
  // we will throw an error, when no route was found, so the callee can show an error page
  throw new Error(NAVIGATION_ERROR_404);
};
