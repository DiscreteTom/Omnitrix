<template>
  <div>
    <!-- form -->
    <div class="mx-2">
      <div class="d-flex mb-3">
        <v-row no-gutters>
          <v-col cols="4">
            <v-select
              label="From"
              :items="formats"
              outlined
              dense
              hide-details
              v-model="fromFormat"
              class="mr-3"
            />
          </v-col>
          <v-col cols="8">
            <v-text-field
              label="Value"
              v-model="fromValue"
              outlined
              dense
              hide-details
              class="mr-3"
              @input="calculate"
            />
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- cards -->
    <div class="d-flex flex-wrap">
      <v-card
        v-for="(value, name) in result"
        :key="name"
        class="mx-2 my-2 flex-grow-1"
      >
        <v-card-title> {{ name }} </v-card-title>
        <v-card-text>
          {{ value }}
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import { Base64 } from "js-base64";

export default {
  data() {
    return {
      result: {
        "UTF-8": "",
        MD5: "",
        "URL Encoded": "",
        Base64: "",
      },

      fromValue: "Omnitrix",
      fromFormat: "UTF-8",
      formats: ["UTF-8", "URL Encoded", "Base64"],
    };
  },
  methods: {
    calculate() {
      let text = this.fromValue;
      try {
        switch (this.fromFormat) {
          case "URL Encoded":
            text = decodeURIComponent(text);
            break;
          case "Base64":
            text = Base64.decode(text);
        }
      } catch (e) {
        this.result["UTF-8"] = e.toString();
        this.result.MD5 = e.toString();
        this.result["URL Encoded"] = e.toString();
        this.result.Base64 = e.toString();
        return;
      }

      function errToString(f, text) {
        try {
          return f(text);
        } catch (e) {
          return e.toString();
        }
      }
      this.result["UTF-8"] = text;
      this.result.MD5 = errToString(md5, text);
      this.result["URL Encoded"] = errToString(encodeURIComponent, text);
      this.result.Base64 = errToString(Base64.encode, text);
    },
    updateFromValue() {
      this.fromValue = this.result[this.fromFormat];
    },
  },
  mounted() {
    this.calculate();
  },
  watch: {
    fromFormat() {
      this.updateFromValue();
    },
  },
};
</script>
