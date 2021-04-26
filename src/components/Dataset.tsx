import { Component, Prop, Watch } from "vue-property-decorator";
import {
  Page as APIPage,
  Dataset as APIDataset,
  ComparisonQueryOperatorEnum,
  PageBodyContent,
  Section,
} from "fsxa-api";
import Page from "./Page";
import RenderUtils from "./base/RenderUtils";
import { DatasetProps } from "./../types/components";

@Component({
  name: "FSXADataset",
})
class Dataset extends RenderUtils<DatasetProps> {
  @Prop() id: DatasetProps["id"];
  @Prop() route: DatasetProps["route"];
  @Prop() pageId!: DatasetProps["pageId"];

  serverPrefetch() {
    return this.fetchData();
  }

  mounted() {
    if (!this.page || !this.dataset) this.fetchData();
  }

  @Watch("id")
  handleIdChange(id: string, prevId: string) {
    if (id !== prevId && id != null) {
      this.fetchData();
    }
  }

  @Watch("locale")
  handleLocaleChange(locale: string, prevLocale: string) {
    if (locale !== prevLocale && locale != null) {
      this.fetchData();
    }
  }

  async fetchData() {
    if (!this.locale) return;
    await Promise.all([this.fetchPage(), this.fetchDataset()]);
  }

  async fetchPage() {
    if (!this.pageId || this.page) return null;
    // check if the page was already loaded
    try {
      const page = await this.fsxaApi.fetchElement(this.pageId, this.locale);
      this.setStoredItem(this.pageId!, page);
    } catch (err) {
      return null;
    }
  }

  async fetchDataset() {
    if (this.dataset) return;
    if (!this.id && !this.route) {
      throw new Error(
        "You either have to provide an id or the route of a dataset",
      );
    }
    let dataset: APIDataset | null = null;
    if (this.id) {
      dataset = await this.fsxaApi.fetchElement(this.id, this.locale);
    } else {
      // we will use the route instead
      const response = await this.fsxaApi.fetchByFilter(
        [
          {
            field: this.id ? "identifier" : "route",
            operator: ComparisonQueryOperatorEnum.EQUALS,
            value: this.id ? this.id : this.route!,
          },
        ],
        this.locale,
      );
      if (response && response.length > 0) dataset = response[0] as APIDataset;
    }
    if (dataset) this.setStoredItem(this.id ? this.id : this.route!, dataset);
  }

  get page(): APIPage | undefined {
    return this.pageId ? this.getStoredItem(this.pageId) : undefined;
  }

  get identifier(): string | null {
    return this.id || this.route || null;
  }

  get dataset(): APIDataset | undefined {
    return this.identifier ? this.getStoredItem(this.identifier) : undefined;
  }

  replaceContent2Section(children: PageBodyContent[]) {
    if (!this.dataset) return children;
    const content2SectionIndex = children.findIndex(
      child =>
        child.data.entityType === this.dataset?.entityType &&
        child.data.schema === this.dataset?.schema,
    );
    if (content2SectionIndex !== -1) {
      const nextChildren = children.slice(0);
      nextChildren[content2SectionIndex] = {
        ...this.dataset,
        template: (children[content2SectionIndex] as Section).sectionType,
      };
      return nextChildren;
    }
    return children;
  }

  render() {
    if (this.page && this.dataset) {
      return (
        <Page
          pageData={{
            ...this.page,
            children: this.page.children.map(body => ({
              ...body,
              children: this.replaceContent2Section(body.children),
            })),
          }}
        />
      );
    } else if (!this.pageId && this.dataset) {
      return this.renderContentElement(this.dataset);
    }
  }
}
export default Dataset;
