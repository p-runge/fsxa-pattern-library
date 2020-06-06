import { FSXAImage as UIFSXAImage } from "fsxa-ui";
import BaseComponent from "../FSXABaseComponent";
import { Prop, Component } from "vue-property-decorator";

export interface FSXAImageProps {
  caasUrl: string;
  resolution: string;
  previewId: string;
}
@Component({
  name: "FSXAImage",
})
class FSXAImage extends BaseComponent<FSXAImageProps> {
  @Prop({ required: true }) caasUrl!: FSXAImageProps["caasUrl"];
  @Prop({ required: true }) resolution!: FSXAImageProps["resolution"];
  @Prop({ required: true }) previewId!: FSXAImageProps["previewId"];

  imageUrl: string | null = null;

  mounted() {
    this.fetchImage();
  }

  async fetchImage() {
    const storedItem = this.getStoredItem(`${this.caasUrl}.${this.resolution}`);
    if (storedItem) {
      this.imageUrl = URL.createObjectURL(storedItem);
    } else {
      const response = await this.$fsxaAPI.fetchImageBlob(
        this.caasUrl,
        this.resolution,
      );
      if (response !== null) {
        this.setStoredItem(`${this.caasUrl}.${this.resolution}`, response);
        this.imageUrl = URL.createObjectURL(response);
      }
    }
  }

  render() {
    if (!this.imageUrl) return null;
    return <UIFSXAImage src={this.imageUrl} data-preview-id={this.previewId} />;
  }
}
export default FSXAImage;
