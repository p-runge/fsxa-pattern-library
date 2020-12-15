<template
  ><strong v-if="data.format === 'bold'"><render-content /></strong>
  <span v-else><render-content /></span
></template>
<script lang="ts">
import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "TextComp",
})
class Text extends FSXABaseRichTextElement {}
export default Text;
</script>
