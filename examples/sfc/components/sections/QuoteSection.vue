<template>
  <div>
    <rich-text :content="payload.st_text" />
  </div>
</template>

<script lang="ts">
import { FSXABaseSection, FSXARichText } from "fsxa-pattern-library";
import Component from "vue-class-component";

@Component({
  name: "QuoteSection",
  components: {
    "rich-text": FSXARichText,
  },
})
class QuoteSection extends FSXABaseSection {}
export default QuoteSection;
</script>
