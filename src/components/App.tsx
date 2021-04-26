import {
  FSXAActions,
  FSXAAppError,
  FSXAAppState,
  FSXAGetters,
  getFSXAConfiguration,
  CurrentPage,
} from "./../store";
import Component from "vue-class-component";
import { Prop, ProvideReactive, Watch } from "vue-property-decorator";
import Dataset from "./Dataset";
import { Component as TsxComponent } from "vue-tsx-support";
import {
  FSXA_INJECT_KEY_DEV_MODE,
  FSXA_INJECT_KEY_LAYOUTS,
  FSXA_INJECT_KEY_SECTIONS,
  FSXA_INJECT_KEY_LOADER,
  FSXA_INJECT_KEY_COMPONENTS,
  FSXA_INJECT_KEY_TPP_VERSION,
  FSXA_INJECT_DEV_MODE_INFO,
} from "./../constants";
import Page from "./Page";
import ErrorBoundary from "./internal/ErrorBoundary";
import InfoBox from "./internal/InfoBox";
import Code from "./internal/Code";
import { FSXAApi, FSXAContentMode, NavigationData } from "fsxa-api";
import { AppProps } from "./../types/components";
import PortalProvider from "./internal/PortalProvider";
import { importTPPSnapAPI } from "./../utils";

const DEFAULT_TPP_SNAP_VERSION = "2.2.1";
@Component({
  name: "FSXAApp",
})
class App extends TsxComponent<AppProps> {
  @Prop({ default: () => ({}) }) components!: AppProps["components"];
  @Prop() currentPath!: AppProps["currentPath"];
  @Prop({ default: false }) devMode!: AppProps["devMode"];
  @Prop({ required: true }) defaultLocale!: AppProps["defaultLocale"];
  @Prop({ required: true }) handleRouteChange!: AppProps["handleRouteChange"];
  @Prop() availableLocales: AppProps["availableLocales"];
  @Prop() fsTppVersion: AppProps["fsTppVersion"];
  @ProvideReactive(FSXA_INJECT_KEY_DEV_MODE) injectedDevMode = this.devMode;
  @ProvideReactive(FSXA_INJECT_KEY_COMPONENTS) injectedComponents = this
    .components;

  @ProvideReactive(FSXA_INJECT_KEY_LAYOUTS) injectedLayouts =
    this.components?.layouts || {};
  @ProvideReactive(FSXA_INJECT_KEY_SECTIONS) injectedSections =
    this.components?.sections || {};
  @ProvideReactive(FSXA_INJECT_KEY_LOADER) injectedLoader =
    this.components?.loader || null;
  @ProvideReactive(FSXA_INJECT_DEV_MODE_INFO) injectedInfoError =
    this.components?.devModeInfo || null;

  @Watch("currentPath")
  onCurrentPathChange(nextPath: string) {
    this.$store.dispatch(FSXAActions.determineCurrentPage, { route: nextPath });
  }

  @Watch("devMode")
  onDevModeChange(nextDevMode: boolean) {
    this.injectedDevMode = nextDevMode;
  }

  @Watch("components")
  onComponentsChange(nextComponents: AppProps["components"]) {
    this.injectedComponents = nextComponents;
    this.injectedLayouts = nextComponents?.layouts || {};
    this.injectedSections = nextComponents?.sections || {};
  }

  serverPrefetch() {
    return this.initialize();
  }

  @ProvideReactive(FSXA_INJECT_KEY_TPP_VERSION)
  get tppVersion() {
    return this.fsTppVersion || DEFAULT_TPP_SNAP_VERSION;
  }

  mounted() {
    if (this.appState === FSXAAppState.not_initialized) this.initialize();
    // we will load tpp-snap, if we are in devMode
    if (this.isEditMode) {
      importTPPSnapAPI(this.tppVersion)
        .then(TPP_SNAP => {
          if (!TPP_SNAP) {
            throw new Error("Could not find global TPP_SNAP object.");
          }
          TPP_SNAP.onRequestPreviewElement((previewId: string) => {
            const pageId = previewId.split(".")[0];
            const nextPage = this.navigationData?.idMap[pageId];
            if (nextPage) this.requestRouteChange(nextPage.seoRoute);
          });
          TPP_SNAP.onRerenderView(() => {
            window.setTimeout(() => this.initialize(), 300);
            return false;
          });
          TPP_SNAP.onNavigationChange(() => {
            window.setTimeout(() => this.initialize(true), 300);
            return false;
          });
        })
        .catch(() => {
          console.error(
            `Could not load correct fs-tpp-api version: ${this.tppVersion}. Please make sure that it exists.`,
          );
        });
    }
  }

  /**
   * We will watch the appState and set the preview-element in the OCM
   * if we are in editMode and we are on the client
   */
  @Watch("appState")
  onAppStateChange(nextAppState: FSXAAppState) {
    if (
      this.isEditMode &&
      nextAppState === FSXAAppState.ready &&
      typeof window !== "undefined" &&
      this.currentPath &&
      this.currentPath !== "/"
    ) {
      /**try {
        const currentRoute = determineCurrentRoute(
          this.$store.state.fsxa.navigationData,
          this.currentPath,
        );
        if (currentRoute?.item) {
          getTPPSnap().setPreviewElement(
            `${currentRoute.item.id}.${currentRoute.locale}`,
          );
        }
        // eslint-disable-next-line
      } catch (err) {}**/
    }
  }

  beforeDestroy() {
    window.removeEventListener("click", this.handleInternalClick);
  }

  handleInternalClick(event: MouseEvent) {
    if (
      "linkInternal" in (event.target as HTMLElement).dataset &&
      (event.target as HTMLElement).dataset.linkInternal === "true"
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.requestRouteChange((event.target as any).pathname);
    }
  }

  initialize(forceRefresh = false) {
    return this.$store.dispatch(FSXAActions.initializeApp, {
      defaultLocale: this.defaultLocale,
      initialPath: this.currentPath,
      availableLocales: this.availableLocales,
      forceRefresh,
    });
  }

  @ProvideReactive("requestRouteChange")
  async requestRouteChange(newRoute: string | null) {
    if (newRoute) this.handleRouteChange(newRoute);
  }

  get isEditMode() {
    return this.$store.getters[FSXAGetters.mode] === "preview";
  }

  get fsxaApi(): FSXAApi {
    return new FSXAApi(
      this.isEditMode ? FSXAContentMode.PREVIEW : FSXAContentMode.RELEASE,
      getFSXAConfiguration(this.$store.state.fsxa.configuration),
    );
  }

  get locale(): string {
    return this.$store.getters[FSXAGetters.locale];
  }

  get appState(): FSXAAppState {
    return this.$store.state.fsxa.appState;
  }

  get appError(): FSXAAppError {
    return this.$store.state.fsxa.error;
  }

  get currentPage(): CurrentPage | null {
    return this.$store.getters[FSXAGetters.currentPage];
  }

  get navigationData(): NavigationData {
    return this.$store.getters[FSXAGetters.navigationData];
  }

  renderContent() {
    if (this.$slots.default) return this.$slots.default || null;
    if (
      [
        FSXAAppState.not_initialized,
        FSXAAppState.initializing,
        FSXAAppState.routing,
      ].includes(this.appState)
    ) {
      if (this.components?.loader) {
        const Loader = this.components.loader;
        return <Loader />;
      }
      return null;
    }
    if (this.currentPage && this.currentPage.datasetId) {
      return (
        <Dataset
          id={this.currentPage.datasetId}
          pageId={this.currentPage.item.caasDocumentId}
        />
      );
    } else if (this.currentPage) {
      return <Page id={this.currentPage?.item.caasDocumentId} />;
    } else {
      if (this.components?.page404) {
        const Page404Layout = this.components.page404;
        return <Page404Layout currentPath={this.currentPath} />;
      }
      return null;
    }
  }

  render() {
    const AppLayout = this.components?.appLayout;
    if (!AppLayout && this.appState === FSXAAppState.error) {
      return (
        <InfoBox
          type="error"
          headline="Encountered error while rendering the FSXAApp"
        >
          {this.appError.stacktrace ? (
            <Code language="js">{this.appError?.stacktrace}</Code>
          ) : (
            <div class="pl-text-gray-900">
              <h2 class="pl-text-lg pl-font-medium pl-text-gray-900">
                {this.appError?.message}
              </h2>
              {this.appError.description && (
                <h3>{this.appError?.description}</h3>
              )}
            </div>
          )}
        </InfoBox>
      );
    }
    // We only want to generate the content, when the app is correctly initialized
    const content =
      this.appState === FSXAAppState.ready ? this.renderContent() : [];
    if (AppLayout) {
      const appLayout = (
        <AppLayout appState={this.appState} appError={this.appError}>
          {content}
        </AppLayout>
      );
      return (
        <ErrorBoundary title="Error rendering custom AppLayout component">
          {this.devMode ? (
            <PortalProvider>{appLayout}</PortalProvider>
          ) : (
            appLayout
          )}
        </ErrorBoundary>
      );
    }
    return this.devMode ? <PortalProvider>{content}</PortalProvider> : content;
  }
}
export default App;
