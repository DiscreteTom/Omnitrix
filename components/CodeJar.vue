<template>
  <div>
    <div ref="editor" class="jar-editor" :style="codeStyle" />
  </div>
</template>

<script>
import { CodeJar } from "codejar";

export default {
  data() {
    return {
      jar: null,
    };
  },
  props: {
    value: String,
    readonly: Boolean,
    codeStyle: String,
    highlighter: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    setReadonly(val) {
      this.$refs.editor.setAttribute("contenteditable", val ? "false" : "true");
    },
  },
  mounted() {
    this.jar = CodeJar(this.$refs.editor, this.highlighter);
    this.jar.onUpdate((code) => this.$emit("input", code));
    this.jar.updateCode(this.value);
    this.setReadonly(this.readonly);
  },
  watch: {
    value(val) {
      if (val != this.jar.toString()) {
        this.jar.updateCode(val);
      }
    },
    readonly(val) {
      this.setReadonly(val);
    },
  },
  destroyed() {
    this.jar.destroy();
  },
};
</script>

<style>
.jar-editor {
  border-radius: 6px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
  font-family: "Source Code Pro", monospace;
  font-size: 14px;
  font-weight: 400;
  height: 340px;
  letter-spacing: normal;
  line-height: 20px;
  padding: 10px;
  tab-size: 4;
}
</style>
