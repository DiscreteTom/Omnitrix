<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <v-select
              outlined
              dense
              @input="updateOutput"
              :items="languages"
              v-model="fromLang"
              label="From"
            />
            <code-jar
              @input="updateOutput($event)"
              codeStyle="background:#272822;"
              :highlighter="highlighter"
              :lang="fromLang"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <v-select
              outlined
              dense
              @input="updateOutput"
              v-model="toLang"
              :items="languages"
              label="To"
            />
            <code-jar
              :value="toTxt"
              readonly
              codeStyle="background:#272822;"
              :highlighter="highlighter"
              :lang="toLang"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import yaml from "js-yaml";

export default {
  data() {
    return {
      fromLang: "json",
      toTxt: "",
      toLang: "yaml",
      languages: ["json", "yaml"],
    };
  },
  methods: {
    highlighter(editor) {
      this.$prism.highlightElement(editor);
    },
    updateOutput(code) {
      if (code.length === 0) {
        this.toTxt = "";
        return;
      }

      try {
        let input;

        switch (this.fromLang) {
          case "json":
            input = JSON.parse(code);
            break;
          case "yaml":
            input = yaml.load(code);
            break;
        }

        switch (this.toLang) {
          case "json":
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
};
</script>
