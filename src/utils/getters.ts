import { FSXAActions, FSXAGetters, RootState } from "./../store";
import {
  ComparisonQueryOperatorEnum,
  Dataset,
  FSXAApi,
  NavigationData,
  NavigationItem,
} from "fsxa-api";
import { Store } from "vuex";

export function getStoredItem<Value = any>(
  $store: Store<RootState>,
  key: string,
): Value | undefined {
  const storedItem = $store.getters[FSXAGetters.item](key);
  const currentTime = new Date().getTime();
  if (!storedItem || storedItem.fetchedAt + storedItem.ttl < currentTime)
    return undefined;
  return storedItem.value;
}

export function setStoredItem(
  $store: Store<RootState>,
  key: string,
  value: any,
  ttl: number,
) {
  $store.dispatch(FSXAActions.setStoredItem, {
    key,
    value,
    fetchedAt: new Date().getTime(),
    ttl,
  });
}

export function findNavigationItemInNavigationData(
  $store: Store<RootState>,
  params: {
    locale: string;
    seoRoute?: string;
    pageId?: string;
  },
): NavigationItem | null {
  if (
    (!params.pageId && !params.seoRoute) ||
    (params.pageId && params.seoRoute)
  ) {
    return null;
  }
  const navigationData: NavigationData =
    $store.state.fsxa.navigation[params.locale];
  if (params.pageId) return navigationData.idMap[params.pageId] || null;
  // we will try to match the data directly through the seoRoute, if not possible, we iterate over the dynamic pages as well
  if (params.seoRoute) {
    const navigationItemId = navigationData.seoRouteMap[params.seoRoute];
    if (navigationItemId) return navigationData.idMap[navigationItemId];
    return (
      Object.values(navigationData.idMap)
        .filter((item: any) => item.seoRouteRegex)
        .find((item: any) => params.seoRoute!.match(item.seoRouteRegex)) || null
    );
  }
  return null;
}

export interface TriggerRouteChangeParams {
  route?: string;
  pageId?: string;
  locale?: string;
}
export async function triggerRouteChange(
  $store: Store<RootState>,
  $fsxaApi: FSXAApi,
  params: TriggerRouteChangeParams,
  currentLocale: string,
): Promise<string | null> {
  const navigationItem = findNavigationItemInNavigationData($store, {
    pageId: params.pageId,
    seoRoute: params.route,
    locale: params.locale || currentLocale,
  });
  if (navigationItem) return navigationItem.seoRoute;

  // rework this
  if (params.locale && params.locale !== currentLocale) {
    // we will store the possible old datasetId, so that we can fetch the translated one as well and redirect to the new seoRoute
    const storedData = $store.state.fsxa.stored;
    const currentDatasetId =
      (params.route
        ? (storedData[currentLocale] &&
            (storedData[currentLocale][params.route]?.value as Dataset)) ||
          null
        : null
      )?.id || null;
    const currentPageId =
      findNavigationItemInNavigationData($store, {
        pageId: params.pageId,
        seoRoute: params.route,
        locale: params.locale,
      })?.id || null;

    // We throw away the old state and reinitialize the app with the new locale
    await $store.dispatch(FSXAActions.initializeApp, {
      defaultLocale: params.locale,
    });

    if (currentDatasetId) {
      // we will load the new dataset from the caas
      const [dataset] = await $fsxaApi.fetchByFilter(
        [
          {
            operator: ComparisonQueryOperatorEnum.EQUALS,
            value: currentDatasetId,
            field: "identifier",
          },
        ],
        params.locale,
      );
      if (dataset) {
        const route = (dataset as Dataset).route;
        $store.dispatch(FSXAActions.setStoredItem, {
          key: route,
          value: dataset,
          ttl: 300000,
          fetchedAt: new Date().getTime(),
        });
        return route;
      }
    } else if (currentPageId) {
      return (
        findNavigationItemInNavigationData($store, {
          pageId: currentPageId,
          locale: params.locale,
        })?.seoRoute || null
      );
    }
  }
  return null;
}
