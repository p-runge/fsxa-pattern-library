import Component from "vue-class-component";
import "./style.css";
import { FSXAButton, FSXARichText } from "fsxa-ui";
import BaseSection from "@/components/Section/components/BaseSection";
import FSXAImage from "@/components/Image";

export interface WelcomeSectionPayload {
  st_headline: string;
  st_jumbo_headline: string;
  st_kicker: string;
  st_text: string;
  st_picture?: {
    src: string;
    previewId: string;
  };
}
@Component({
  name: "WelcomeSection"
})
class WelcomeSection extends BaseSection<WelcomeSectionPayload> {
  render() {
    return (
      <div class="w-full pt-6 md:pt-12 lg:pt-24 pb-24 md:pb-12 lg:pb-24 bg-gray-100 text-black">
        <div class="container mx-auto flex flex-col md:flex-row px-4 md:px-6 lg:px-8">
          <div class="w-full md:w-5/12 px-4">
            <span class="uppercase font-light text-2xl lg:text-3xl">
              {this.payload.st_kicker}
            </span>
            <FSXARichText
              class="text-3xl lg:text-4xl font-semibold mt-2 lg:mt-5 mb-3 lg:mb-6"
              text={this.payload.st_headline}
            />
            <FSXARichText class="text-xs mb-6" text={this.payload.st_text} />
            <FSXAButton
              variant="animated"
              handleClick={() => console.log("Clicked")}
            >
              Read More
            </FSXAButton>
          </div>
          <div class="w-full md:w-7/12 px-4 mt-16 md:mt-0">
            {this.payload.st_picture ? (
              <div class="WelcomeSection--ImageWrapper">
                <FSXAImage
                  previewId={this.payload.st_picture.previewId}
                  resolution="ORIGINAL"
                  caasUrl={this.payload.st_picture.src}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
export default WelcomeSection;
