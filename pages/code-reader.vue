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
          <v-btn icon v-on="on" @click="formatCode" class="mr-2">
            <v-icon>mdi-code-json</v-icon>
          </v-btn>
        </template>
        <span>Format Code</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="fullscreen = true">
            <v-icon>mdi-arrow-expand</v-icon>
          </v-btn>
        </template>
        <span>Fullscreen</span>
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

    <v-dialog fullscreen v-model="fullscreen">
      <v-card v-if="fullscreen" class="d-flex flex-column">
        <v-toolbar class="flex-grow-0" dense>
          <v-toolbar-title> Omnitrix - Code Reader </v-toolbar-title>
          <v-spacer />

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="formatCode">
                <v-icon>mdi-code-json</v-icon>
              </v-btn>
            </template>
            <span>Format Code</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn icon @click="fullscreen = false" v-on="on">
                <v-icon> mdi-close </v-icon>
              </v-btn>
            </template>
            <span>Exit Fullscreen</span>
          </v-tooltip>
        </v-toolbar>
        <div ref="fullscreen-codejar" class="flex-grow-1">
          <code-jar
            @input="codeCache = $event"
            :value="code"
            :codeStyle="`background: #272822;
              height: ${fullscreenEditorHeight}px;
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px`"
            :highlighter="highlighter"
            :lang="lang"
            line-numbers
          />
        </div>
      </v-card>
    </v-dialog>
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
      fullscreenEditorHeight: 0,
      code: "let a = 123;",
      codeCache: "",
      fullscreen: false,
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
  watch: {
    fullscreen(val) {
      if (val) {
        let f = () => {
          setTimeout(() => {
            let e = this.$refs["fullscreen-codejar"];
            if (e && e.offsetHeight !== 0) {
              this.fullscreenEditorHeight = e.offsetHeight;
            } else {
              f();
            }
          }, 10);
        };
        f();
      }
    },
  },
};
</script>
