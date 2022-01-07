<template>
  <div>
    <v-row>
      <v-col>
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
            <v-textarea outlined @input="updateOutput" v-model="fromTxt" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
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
            <v-textarea outlined readonly v-model="toTxt" />
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
      fromTxt: "",
      fromLang: "json",
      toTxt: "",
      toLang: "yaml",
      languages: ["json", "yaml"],
    };
  },
  methods: {
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
        this.toTxt = e;
      }
    },
  },
};
</script>
