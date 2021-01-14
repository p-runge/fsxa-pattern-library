import { FSXABaseSection, FSXARichText } from "fsxa-pattern-library";
import Component from "vue-class-component";
@Component({
  name: "TeaserSection",
})
class TeaserSection extends FSXABaseSection {
  render() {
    return (
      <div class="pl-mb-5 pl-bg-white pl-p-5 pl-container pl-mx-auto pl-border-b pl-border-gray-600">
        <FSXARichText content={this.payload.st_text} />
      </div>
    );
  }
}
export default TeaserSection;
