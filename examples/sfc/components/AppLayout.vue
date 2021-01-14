<template>
  <div>
    <div class="pl-bg-gray-200">
      <div
        class="pl-w-full pl-flex pl-items-center pl-justify-center pl-px-4 md:pl-px-6 lg:pl-px-10 pl-py-3"
        v-if="navigationData"
      >
        <div class="pl-flex-shrink-0 pl-font-bold">SFC App</div>
        <div class="pl-flex-1 pl-text-right">
          <ul class="pl-inline-block">
            <li
              class="pl-inline-block pl-px-2 pl-text-sm"
              v-for="item in navigationData.structure"
              :key="item.id"
            >
              <a
                class="hover:pl-underline"
                :href="navigationData.idMap[item.id].seoRoute"
                @click.prevent="
                  triggerRouteChange({
                    pageId: item.id,
                  })
                "
              >
                {{ navigationData.idMap[item.id].label }}</a
              >
            </li>
          </ul>
        </div>
        <div class="pl-flex-shrink-0 pl-ml-3 pl-text-xs pl-space-x-2">
          <a
            href="#"
            :class="[
              isActiveLocale('en_GB') ? 'pl-underline' : '',
              'pl-inline-block',
            ]"
            @click.prevent="
              triggerRouteChange({
                locale: 'en_GB',
              })
            "
          >
            en_GB
          </a>
          <a
            href="#"
            :class="[
              isActiveLocale('de_DE') ? 'pl-underline' : '',
              'pl-inline-block',
            ]"
            @click.prevent="
              triggerRouteChange({
                locale: 'de_DE',
              })
            "
          >
            de_DE
          </a>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { FSXABaseAppLayout } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "VueAppLayout",
})
class AppLayout extends FSXABaseAppLayout {
  isActiveLocale(locale: string) {
    return this.locale === locale;
  }
}
export default AppLayout;
</script>
