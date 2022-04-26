<template>
  <div>
    <!-- form -->
    <div class="mx-2">
      <div class="d-flex mb-3">
        <v-row no-gutters>
          <v-col :cols="$vuetify.breakpoint.smAndUp ? 4 : 12">
            <v-select
              label="From"
              :items="formats"
              outlined
              dense
              hide-details
              v-model="fromFormat"
              :class="$vuetify.breakpoint.smAndUp ? 'mr-3' : 'mb-3'"
            />
          </v-col>
          <v-col :cols="$vuetify.breakpoint.smAndUp ? 8 : 12">
            <v-text-field
              label="Value"
              v-model="fromValue"
              outlined
              dense
              hide-details
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

      <v-card
        v-for="(item, i) in custom"
        :key="i"
        class="mx-2 my-2 flex-grow-1"
        hover
        @click="
          $copyText(item.txt).then(() => $bus.$emit('append-msg', 'Copied'))
        "
      >
        <v-card-title>
          <v-text-field
            v-model="item.base"
            label="Base (2-36)"
            outlined
            dense
            type="number"
            hide-details
            class="mr-3"
            @input="calculate"
            @click.stop
          />
          <v-btn icon @click.stop="custom.splice(i, 1)">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          {{ item.txt }}
        </v-card-text>
      </v-card>
      <v-card
        class="mx-2 my-2 flex-grow-1 d-flex align-center justify-center"
        hover
        @click="
          custom.push({ base: 2 });
          calculate();
        "
      >
        <v-icon> mdi-plus </v-icon>
        <v-card-subtitle> Custom Base </v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script>
const formats = [
  "Binary (Base 2)",
  "Ternary (Base 3)",
  "Quaternary (Base 4)",
  "Octal (Base 8)",
  "Decimal (Base 10)",
  "Hexadecimal (Base 16)",
];

let result = {};
formats.map((f) => (result[f] = ""));

export default {
  data() {
    return {
      result,
      fromValue: "1234567890",
      fromFormat: "Decimal (Base 10)",
      formats,
      custom: [], // { base: 10, txt: '' }
    };
  },
  methods: {
    calculate() {
      let input;
      let base;

      switch (this.fromFormat) {
        case "Binary (Base 2)":
          base = 2;
          break;
        case "Ternary (Base 3)":
          base = 3;
          break;
        case "Quaternary (Base 4)":
          base = 4;
          break;
        case "Octal (Base 8)":
          base = 8;
          break;
        case "Decimal (Base 10)":
          base = 10;
          break;
        case "Hexadecimal (Base 16)":
          base = 16;
          break;
      }

      try {
        input = parseInt(this.fromValue, base);
      } catch (e) {
        this.result["Binary (Base 2)"] = e.toString();
        this.result["Ternary (Base 3)"] = e.toString();
        this.result["Quaternary (Base 4)"] = e.toString();
        this.result["Octal (Base 8)"] = e.toString();
        this.result["Decimal (Base 10)"] = e.toString();
        this.result["Hexadecimal (Base 16)"] = e.toString();
        this.custom.map((r) => (r.txt = e.toString()));
        return;
      }

      this.result["Binary (Base 2)"] = input.toString(2);
      this.result["Ternary (Base 3)"] = input.toString(3);
      this.result["Quaternary (Base 4)"] = input.toString(4);
      this.result["Octal (Base 8)"] = input.toString(8);
      this.result["Decimal (Base 10)"] = input.toString(10);
      this.result["Hexadecimal (Base 16)"] = input.toString(12);
      this.custom.map((r) => {
        try {
          r.txt = input.toString(r.base);
        } catch (e) {
          r.txt = e.toString();
        }
      });
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
