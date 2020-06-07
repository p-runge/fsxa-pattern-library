import Component from "vue-class-component";
import { FSXARichText, FSXACounter } from "fsxa-ui";
import FSXAImage from "@/components/Image";
import { Sections } from "fsxa-ui";
import FSXABaseSection from "./FSXABaseSection";

export interface Payload {
  st_background_image: {
    src: string;
    previewId: string;
  };
  st_counters: Array<{
    previewId: string;
    identifier: string;
    data: {
      st_number: number;
      st_text: string;
    };
  }>;
  st_headline: string;
  st_tagline: string;
  /** This can contain html */
  st_text: string;
}
@Component({
  name: "FSXAInterestingFactsSection",
})
class FSXAInterestingFactsSection extends FSXABaseSection<Payload> {
  serverPrefetch() {
    return this.fetchBackgroundImage();
  }

  mounted() {
    this.fetchBackgroundImage();
  }

  async fetchBackgroundImage() {
    return this.fetchImage(this.payload.st_background_image.src, "ORIGINAL");
  }

  get backgroundImage(): string | null {
    return this.getImage(this.payload.st_background_image.src, "ORIGINAL");
  }

  render() {
    return (
      <Sections.InterestingFactsSection
        headline={this.payload.st_headline}
        tagline={this.payload.st_tagline}
        text={this.payload.st_text}
        counters={this.payload.st_counters.map(counter => ({
          previewId: counter.previewId,
          value: counter.data.st_number,
          label: counter.data.st_text,
        }))}
        backgroundImage={this.backgroundImage || undefined}
      />
    );
  }
}
export default FSXAInterestingFactsSection;
