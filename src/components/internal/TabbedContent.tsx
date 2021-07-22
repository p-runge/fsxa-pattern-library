import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import BaseComponent from "@/components/base/BaseComponent";

export interface TabbedContentItem {
  title: string;
  content: JSX.Element;
}
export interface TabbedContentProps {
  initialTab?: number;
  tabs: TabbedContentItem[];
}
@Component({
  name: "TabbedContent",
})
class TabbedContent extends BaseComponent<TabbedContentProps> {
  @Prop({ required: true }) tabs!: TabbedContentProps["tabs"];
  @Prop() initialTab!: TabbedContentProps["initialTab"];

  activeTab: number = this.initialTab || 0;
  showDropdownMenu = false;

  renderDropdown() {
    return (
      <div class="sm:pl-hidden">
        <div class="pl-mt-1 pl-relative">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded="true"
            aria-labelledby="listbox-label"
            class="pl-bg-white pl-relative pl-w-full pl-border pl-border-gray-300 pl-rounded-md pl-shadow-sm pl-pl-3 pl-pr-10 pl-py-2 pl-text-left pl-cursor-default focus:pl-outline-none focus:pl-ring-1 focus:pl-ring-indigo-500 focus:pl-border-indigo-500 sm:pl-text-sm"
            onClick={(event) => {
              event.preventDefault();
              this.showDropdownMenu = !this.showDropdownMenu;
            }}
          >
            <span class="pl-block pl-truncate">
              {this.tabs[this.activeTab].title}
            </span>
            <span class="pl-absolute pl-inset-y-0 pl-right-0 pl-flex pl-items-center pl-pr-2 pl-pointer-events-none">
              <svg
                class="pl-h-5 pl-w-5 pl-text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </button>
          {this.showDropdownMenu ? (
            <div class="pl-absolute pl-mt-1 pl-w-full pl-rounded-md pl-bg-white pl-shadow-lg">
              <ul
                tabindex={-1}
                role="listbox"
                aria-labelledby="listbox-label"
                aria-activedescendant="listbox-item-3"
                class="pl-max-h-60 pl-rounded-md pl-py-1 pl-text-base pl-ring-1 pl-ring-black pl-ring-opacity-5 pl-overflow-auto focus:pl-outline-none sm:pl-text-sm"
              >
                {this.tabs.map((tab, index) => (
                  <li
                    id="listbox-option-0"
                    role="option"
                    class="pl-text-gray-900 pl-cursor-default pl-select-none pl-relative pl-py-2 pl-pl-3 pl-pr-9"
                    onClick={(event) => {
                      event.preventDefault();
                      this.activeTab = index;
                      this.showDropdownMenu = false;
                    }}
                  >
                    <span class="pl-font-normal pl-block pl-truncate pl-text-xs">
                      {tab.title}
                    </span>
                    {this.activeTab === index ? (
                      <span class="pl-text-blue-600 pl-absolute pl-inset-y-0 pl-right-0 pl-flex pl-items-center pl-pr-4">
                        <svg
                          class="pl-h-5 pl-w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="pl-w-full pl-mt-4 first-child:pl-mt-0">
        {this.renderDropdown()}
        <div class="pl-hidden sm:pl-block">
          <nav class="pl-flex pl-space-x-4" aria-label="Tabs">
            {this.tabs.map((tab, index) => {
              const isActive = this.activeTab === index;
              return (
                <a
                  href="#"
                  class={`pl-block pl-px-2 pl-py-1 pl-text-sm pl-rounded-md active:pl-bg-transparent ${
                    isActive
                      ? "pl-text-gray-700 pl-bg-gray-300"
                      : "pl-text-gray-900 hover:pl-text-gray-700"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    this.activeTab = index;
                  }}
                >
                  {tab.title}
                </a>
              );
            })}
          </nav>
        </div>
        <div class="pl-w-full pl-mt-2">{this.tabs[this.activeTab].content}</div>
      </div>
    );
  }
}
export default TabbedContent;
