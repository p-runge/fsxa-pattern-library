import Vue, { CreateElement, RenderContext, VNode } from "vue";

export const Fragment = Vue.extend({
  functional: true,
  render(h: CreateElement, ctx: RenderContext): VNode[] {
    console.log("Rendering Fragment", ctx);
    return ctx.children;
  },
});
export default Fragment;
