<template
  ><li>
    <render-content /></li
></template>
<script lang="ts">
import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "ListItem",
})
class ListItem extends FSXABaseRichTextElement {}
export default ListItem;
</script>
