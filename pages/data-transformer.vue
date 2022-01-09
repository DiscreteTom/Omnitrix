<template>
  <div>
    <v-row>
      <!-- from -->
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-select
                class="mr-3"
                outlined
                dense
                @input="updateOutput"
                :items="languages"
                v-model="fromLang"
                label="From"
                hide-details
              />
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="clipboard-btn"
                    :data-clipboard-text="fromTxt"
                    v-on="on"
                  >
                    <v-icon> mdi-content-copy </v-icon>
                  </v-btn>
                </template>
                <span>Copy</span>
              </v-tooltip>
            </div>
            <code-jar
              @input="onInput"
              codeStyle="background:#272822;"
              :highlighter="highlighter"
              :lang="fromLang"
              line-numbers
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- to -->
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-select
                class="mr-3"
                outlined
                dense
                @input="updateOutput"
                v-model="toLang"
                :items="languages"
                label="To"
                hide-details
              />

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-switch
                      v-model="live"
                      inset
                      hide-details
                      class="mt-0 ml-2"
                    />
                  </span>
                </template>
                <span>Live</span>
              </v-tooltip>

              <v-tooltip top v-if="!live">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="updateOutput" class="mr-2">
                    <v-icon> mdi-check </v-icon>
                  </v-btn>
                </template>
                <span>Transform</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="clipboard-btn"
                    :data-clipboard-text="toTxt"
                    v-on="on"
                  >
                    <v-icon> mdi-content-copy </v-icon>
                  </v-btn>
                </template>
                <span>Copy</span>
              </v-tooltip>
            </div>
            <code-jar
              :value="toTxt"
              readonly
              codeStyle="background:#272822;"
              :highlighter="highlighter"
              :lang="toLang"
              line-numbers
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import yaml from "js-yaml";
import CodeJar from "vue-codejar";
import ClipboardJS from "clipboard";

export default {
  components: { CodeJar },
  data() {
    return {
      fromTxt: "",
      fromLang: "json",
      toTxt: "",
      toLang: "yaml",
      languages: ["json", "yaml", "javascript"],
      clipboard: null,
      live: true,
    };
  },
  methods: {
    onInput(code) {
      this.fromTxt = code;
      if (this.live) this.updateOutput();
    },
    highlighter(editor) {
      this.$prism.highlightElement(editor);
    },
    updateOutput() {
      if (this.fromTxt.length === 0) {
        this.toTxt = "";
        return;
      }

      try {
        let input;

        switch (this.fromLang) {
          case "json":
            input = JSON.parse(this.fromTxt);
            break;
          case "yaml":
            input = yaml.load(this.fromTxt);
            break;
          case "javascript":
            input = eval(`(${this.fromTxt})`);
            break;
        }

        switch (this.toLang) {
          case "json":
          case "javascript":
            this.toTxt = JSON.stringify(input, null, 2);
            break;
          case "yaml":
            this.toTxt = yaml.dump(input);
            break;
        }
      } catch (e) {
        this.toTxt = e.toString();
      }
    },
  },
  mounted() {
    this.clipboard = new ClipboardJS(".clipboard-btn");
  },
  destroyed() {
    delete this.clipboard;
  },
};
</script>
