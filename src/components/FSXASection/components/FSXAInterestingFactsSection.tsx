import Component from "vue-class-component";
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
  backgroundImageSrc: string | null = null;

  async fetchBackgroundImage() {
    // fetch logo
    if (this.payload.st_background_image.src && !this.backgroundImageSrc) {
      this.backgroundImageSrc = await this.fetchImage(
        this.payload.st_background_image.src,
        "ORIGINAL",
      );
    }
  }

  mounted() {
    this.fetchBackgroundImage();
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
        backgroundImage={this.backgroundImageSrc || undefined}
      />
    );
  }
}
export default FSXAInterestingFactsSection;
