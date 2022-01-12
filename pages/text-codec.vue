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
        hover
        @click="$copyText(value).then(() => $bus.$emit('append-msg', 'Copied'))"
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
import Zlib from "zlib";

export default {
  data() {
    return {
      result: {
        "UTF-8": "",
        MD5: "",
        "URL Encode": "",
        Base64: "",
        "Gzip + Base64": "",
        "Inflate + Base64": "",
        "Inflate Raw + Base64": "",
      },

      fromValue: "Omnitrix",
      fromFormat: "UTF-8",
      formats: [
        "UTF-8",
        "URL Encode",
        "Base64",
        "Gzip + Base64",
        "Inflate + Base64",
        "Inflate Raw + Base64",
      ],
    };
  },
  methods: {
    calculate() {
      let text = this.fromValue;
      try {
        switch (this.fromFormat) {
          case "URL Encode":
            text = decodeURIComponent(text);
            break;
          case "Base64":
            text = Base64.decode(text);
            break;
          case "Gzip + Base64":
            text = Zlib.gunzipSync(Buffer.from(text, "base64"));
            break;
          case "Inflate + Base64":
            text = Zlib.inflateSync(Buffer.from(text, "base64"));
            break;
          case "Inflate Raw + Base64":
            text = Zlib.inflateRawSync(Buffer.from(text, "base64"));
            break;
        }
      } catch (e) {
        for (let key in this.result) {
          this.result[key] = e.toString();
        }
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
      this.result["URL Encode"] = errToString(encodeURIComponent, text);
      this.result.Base64 = errToString(Base64.encode, text);
      this.result["Gzip + Base64"] = errToString(
        (text) => Zlib.gzipSync(text).toString("base64"),
        text
      );
      this.result["Inflate + Base64"] = errToString(
        (text) => Zlib.deflateSync(text).toString("base64"),
        text
      );
      this.result["Inflate Raw + Base64"] = errToString(
        (text) => Zlib.deflateRawSync(text).toString("base64"),
        text
      );
    },
  },
  mounted() {
    this.calculate();
  },
  watch: {
    fromFormat() {
      this.calculate();
    },
  },
};
</script>
