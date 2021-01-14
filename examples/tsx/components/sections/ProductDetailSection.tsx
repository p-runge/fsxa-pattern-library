import Component from "vue-class-component";
import { FSXABaseSection } from "fsxa-pattern-library";

@Component({
  name: "ProductDetailSection",
})
class ProductDetailSection extends FSXABaseSection {
  render() {
    return (
      <div class="pl-container pl-mx-auto pl-py-10">
        <span class="pl-inline-block">{this.payload.tt_abstract}</span>
      </div>
    );
  }
}
export default ProductDetailSection;
