import Component from "vue-class-component";
import { Fragment, FragmentPayload } from "fsxa-api";
import FSXABaseSection from "./FSXABaseSection";
import { Sections } from "fsxa-ui";
import { format, parseISO } from "date-fns";
import { de, enGB } from "date-fns/locale";

const locales: { [key: string]: Locale } = {
  de_DE: de,
  en_GB: enGB,
};

const FRAGMENT_STORE_KEY = "FSXANewsTeaserSection.fragments";

export interface NewsTeaserSectionPayload {
  st_title: string;
  st_news: {
    type: string;
    value: Array<{ id: string; remote: string; type: string }>;
  };
}
@Component({
  name: "FSXANewsTeaserSection",
})
class FSXANewsTeaserSection extends FSXABaseSection<NewsTeaserSectionPayload> {
  images: Array<string | null>[] | null = null;

  serverPrefetch() {
    return this.fetchData();
  }

  mounted() {
    this.fetchData();
    this.fetchImageFragments();
  }

  updated() {
    this.fetchImageFragments();
  }

  async fetchData() {
    const storedItem = this.getStoredItem(FRAGMENT_STORE_KEY);
    if (!storedItem) {
      const response = await this.$fsxaAPI.fetchFragments(
        this.payload.st_news.value,
      );
      this.setStoredItem(FRAGMENT_STORE_KEY, response);
      console.log(response);
    }
  }

  async fetchImageFragments() {
    if (this.fragments && !this.images) {
      const response = await this.$fsxaAPI.fetchFragments(
        this.fragments.map(fragment => {
          console.log(fragment);
          const data = fragment.data.pictures.value[0];
          return {
            id: data.id,
            remote: data.remote,
          };
        }),
      );
      console.log("Images", response);
    }
  }

  get fragments(): Fragment[] {
    return this.getStoredItem(FRAGMENT_STORE_KEY) || [];
  }

  render() {
    const items = this.fragments
      ? (this.fragments.map(fragment => ({
          date: format(parseISO(fragment?.data.creationDate), "dd LLL yyyy", {
            locale: locales[this.locale] || locales.en_GB,
          }),
          title: fragment?.meta.title,
          description: fragment?.data.teaserText.text,
        })) as any[])
      : [];
    return (
      <Sections.NewsTeaserSection
        headline={this.payload.st_title}
        items={items}
        handleItemClick={console.log}
      />
    );
  }
}
export default FSXANewsTeaserSection;
