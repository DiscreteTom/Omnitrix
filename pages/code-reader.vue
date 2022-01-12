<template>
  <div style="height: 80vh" ref="root" v-resize="updateEditorHeight">
    <v-select
      :items="languages"
      v-model="lang"
      label="Language"
      outlined
      hide-details
      dense
      class="mb-3"
      ref="selector"
    />
    <code-jar
      :codeStyle="`background: #272822; height: ${editorHeight}px`"
      :highlighter="highlighter"
      :lang="lang"
      line-numbers
    />
  </div>
</template>

<script>
import CodeJar from "vue-codejar";

export default {
  components: { CodeJar },
  data() {
    return {
      languages: [
        "javascript",
        "json",
        "python",
        "java",
        "html",
        "xml",
        "css",
        "yaml",
        "matlab",
      ],
      lang: "javascript",
      editorHeight: 340,
    };
  },
  methods: {
    highlighter(editor) {
      this.$prism.highlightElement(editor);
    },
    updateEditorHeight() {
      this.editorHeight =
        this.$refs.root.offsetHeight - this.$refs.selector.$el.offsetHeight;
    },
  },
  mounted() {
    this.updateEditorHeight();
  },
};
</script>
