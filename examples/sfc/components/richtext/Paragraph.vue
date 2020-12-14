<template
  ><p><rich-text :content="content" /></p
></template>
<script lang="ts">
import { FSXABaseRichTextElement, FSXARichText } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "Paragraph",
  components: {
    "rich-text": FSXARichText,
  },
})
class Paragraph extends FSXABaseRichTextElement {}
export default Paragraph;
</script>
