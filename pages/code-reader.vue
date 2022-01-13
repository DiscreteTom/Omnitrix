<template>
  <div style="height: 80vh" ref="root" v-resize="updateEditorHeight">
    <div class="mb-3 d-flex" ref="controls">
      <v-select
        :items="languages"
        v-model="lang"
        label="Language"
        outlined
        hide-details
        dense
        class="mr-3"
      />
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="formatCode">
            <v-icon>mdi-code-json</v-icon>
          </v-btn>
        </template>
        <span>Format Code</span>
      </v-tooltip>
    </div>
    <code-jar
      @input="codeCache = $event"
      :value="code"
      :codeStyle="`background: #272822; height: ${editorHeight}px`"
      :highlighter="highlighter"
      :lang="lang"
      line-numbers
    />
  </div>
</template>

<script>
import CodeJar from "vue-codejar";
import prettier from "prettier";
import babelParser from "prettier/parser-babel";
import cssParser from "prettier/parser-postcss";
import yamlParser from "prettier/parser-yaml";
import htmlParser from "prettier/parser-html";
import xmlParser from "@prettier/plugin-xml";

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
      code: "let a = 123;",
      codeCache: "",
    };
  },
  methods: {
    highlighter(editor) {
      this.$prism.highlightElement(editor);
    },
    updateEditorHeight() {
      this.editorHeight =
        this.$refs.root.offsetHeight - this.$refs.controls.offsetHeight;
    },
    formatCode() {
      let result;
      let parser = "";
      let plugins = [babelParser, htmlParser, xmlParser, cssParser, yamlParser];
      if (this.lang == "javascript") {
        parser = "babel";
      } else if (["json", "html", "xml", "css", "yaml"].includes(this.lang)) {
        parser = this.lang;
      } else {
        this.$bus.$emit(
          "append-msg",
          "No formatter available for this language."
        );
        return;
      }
      try {
        result = prettier.format(this.codeCache, { parser, plugins });
      } catch (e) {
        console.log(e);
        this.$bus.$emit("append-msg", "Failed to format code.");
        return;
      }
      this.code = "";
      this.$nextTick(() => {
        this.code = result;
      });
    },
  },
  mounted() {
    this.updateEditorHeight();
    this.codeCache = this.code;
  },
};
</script>
