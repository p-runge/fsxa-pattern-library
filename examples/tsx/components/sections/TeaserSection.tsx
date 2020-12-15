import { RichTextElement } from "fsxa-api";
import { FSXABaseSection, FSXARichText } from "fsxa-pattern-library";
import Component from "vue-class-component";
@Component({
  name: "TeaserSection",
})
class TeaserSection extends FSXABaseSection {
  render() {
    return (
      <div class="mb-5 bg-white p-5 container mx-auto border-b border-gray-600">
        {this.payload.st_text.map((content: RichTextElement) => (
          <FSXARichText content={content} />
        ))}
      </div>
    );
  }
}
export default TeaserSection;
