<template>
  <div>
    <v-card height="80vh" class="d-flex flex-column">
      <v-card-title> Random Integer </v-card-title>
      <v-card-text class="flex-grow-1 d-flex flex-column">
        <div
          class="d-flex align-center"
          @click.stop
          @input.stop
          @mousedown.stop
        >
          <v-text-field
            label="Min (Inclusive)"
            v-model="numberFrom"
            outlined
            hide-details
            dense
            @input="getNumber"
            type="number"
            @keydown.enter="getNumber"
          />
          <v-text-field
            class="ml-2"
            label="Max (Inclusive)"
            v-model="numberTo"
            outlined
            hide-details
            dense
            @input="getNumber"
            type="number"
            @keydown.enter="getNumber"
          />
        </div>
        <v-card
          @click="getNumber"
          class="d-flex justify-center align-center flex-grow-1 mt-3"
        >
          <span style="font-size: 150px">
            {{ number }}
          </span>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      numberFrom: 1,
      numberTo: 10,
      number: 0,
    };
  },
  methods: {
    getNumber() {
      this.numberFrom = Math.ceil(this.numberFrom);
      this.numberTo = Math.floor(this.numberTo);
      this.number = Math.floor(
        Math.random() * (this.numberTo - this.numberFrom + 1) + this.numberFrom
      );
    },
  },
  mounted() {
    this.getNumber();
  },
};
</script>
