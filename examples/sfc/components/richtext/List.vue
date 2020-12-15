<template
  ><ul>
    <render-content /></ul
></template>
<script lang="ts">
import { FSXABaseRichTextElement } from "fsxa-pattern-library";
import { Component } from "vue-property-decorator";

@Component({
  name: "List",
})
class List extends FSXABaseRichTextElement {}
export default List;
</script>
