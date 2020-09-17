import { NavigationData, StructureItem } from "fsxa-api";
import { NavigationItem } from "fsxa-ui";

export const isClient = () => typeof window !== "undefined";

export const mapStructureItemToNavigationItem = (
  structure: StructureItem,
  navigationData: NavigationData,
): NavigationItem => {
  const item = navigationData.idMap[structure.id];
  return {
    children: structure.children.map(structureItem =>
      mapStructureItemToNavigationItem(structureItem, navigationData),
    ),
    id: structure.id,
    label: item.label,
    path: item.seoRoute,
  };
};
