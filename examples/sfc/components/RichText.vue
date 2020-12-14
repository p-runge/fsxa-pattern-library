<template>
  <rich-text :text="text" class="container mx-auto">
    <template v-slot:paragraph="paragraph">
      <p><vnode-wrapper :vnodes="paragraph.content" /></p
    ></template>
    <template v-slot:text="text">
      <strong v-if="text.data.format === 'bold'"
        ><vnode-wrapper :vnodes="text.content"
      /></strong>
      <span v-else-if="Array.isArray(text.content)"
        ><vnode-wrapper :vnodes="text.content"
      /></span>
      <span v-else>{{ text.content }}</span>
    </template>
    <template v-slot:list="list"
      ><ul>
        <vnode-wrapper :vnodes="list.content" /></ul
    ></template>
    <template v-slot:listitem="listItem"
      ><li>
        <vnode-wrapper :vnodes="listItem.content" /></li
    ></template>
    <template v-slot:line-break=""><br /></template>
    <template v-slot:link="link">
      <a
        v-if="link.data.type === 'external_link'"
        :target="link.data.data.lt_target.value.identifier"
        :href="link.data.data.lt_reference.value"
        ><vnode-wrapper :vnodes="link.content"
      /></a>
      <a
        v-if="link.data.type === 'internal_link'"
        target="_self"
        :href="getUrlByPageId(link.data.data.lt_link.value.identifier)"
        v-on:click.prevent="
          triggerRouteChange({
            pageId: link.data.data.lt_link.value.identifier,
          })
        "
        ><vnode-wrapper :vnodes="link.content"
      /></a>
    </template>
    <template v-slot:linebreak><br /></template>
  </rich-text>
</template>

<script lang="ts">
import {
  FSXABaseComponent,
  FSXARichText,
  FSXAVNodeWrapper,
} from "fsxa-pattern-library";
import { Component, Prop } from "vue-property-decorator";

@Component({
  name: "VueRichText",
  components: {
    "rich-text": FSXARichText,
    "vnode-wrapper": FSXAVNodeWrapper,
  },
})
class RichText extends FSXABaseComponent {
  @Prop({ required: true }) text!: string;
}
export default RichText;
</script>
