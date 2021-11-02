import Component from "vue-class-component";
import { FSXABaseSection } from "fsxa-pattern-library";
import { ComparisonQueryOperatorEnum } from "fsxa-api";

interface CategoryProducts {
  entityType: string;
  schema: string;
}

@Component({
  name: "CategoryProducts",
})
class CategoryProducts extends FSXABaseSection<CategoryProducts> {
  products: any = null;

  async mounted() {
    this.products = await this.fsxaApi.fetchByFilter({
      filters: [
        {
          field: "entityType",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: this.payload.entityType,
        },
        {
          field: "schema",
          operator: ComparisonQueryOperatorEnum.EQUALS,
          value: this.payload.schema,
        },
      ],
      locale: this.locale,
    });
  }

  render() {
    return (
      <div class="pl-container pl-mx-auto pl-py-10">
        {this.products &&
          this.products.map((item: any) => (
            <div>
              <a
                class="pl-border-b pl-border-transparent hover:pl-border-green-600"
                href={item.route}
                onClick={e => {
                  e.preventDefault();
                  this.triggerRouteChange({ route: item.route });
                }}
              >
                {item.data.tt_name}
              </a>
            </div>
          ))}
      </div>
    );
  }
}
export default CategoryProducts;
