import Component from "vue-class-component";
import FSXABaseSection from "./FSXABaseSection";
import { Prop } from "vue-property-decorator";
import { Sections } from "fsxa-ui";

export interface Payload {
  st_headline: string;
  st_jumbo_headline: string;
  st_kicker: string;
  st_picture: {
    previewId: string;
    src: string;
  } | null;
  st_picture_alt: string | null;
  st_text: string;
}
@Component({
  name: "FSXAWelcomeSection",
})
class FSXAWelcomeSection extends FSXABaseSection<Payload> {
  imageSrc: string | null = null;

  mounted() {
    this.fetchImage();
  }

  async fetchImage() {
    if (this.payload.st_picture) {
      const imageData = await this.$fsxaAPI.fetchImageBlob(
        this.payload.st_picture.src,
        "ORIGINAL",
      );
      if (imageData) this.imageSrc = URL.createObjectURL(imageData);
    }
  }

  render() {
    return (
      <Sections.WelcomeSection
        headline={this.payload.st_headline}
        jumboHeadline={this.payload.st_jumbo_headline}
        kicker={this.payload.st_kicker}
        text={this.payload.st_text}
        image={{
          src: this.imageSrc || "",
          previewId: this.payload.st_picture?.previewId || "",
        }}
      />
    );
  }
}
export default FSXAWelcomeSection;
