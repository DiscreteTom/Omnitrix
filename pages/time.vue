<template>
  <div>
    <div class="d-flex mb-3">
      <v-text-field
        type="number"
        label="Refresh Interval(ms)"
        v-model="intervalMs"
        outlined
        dense
        hide-details
        class="mr-3"
      />
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="resetTimer" v-on="on">
            <v-icon> mdi-check </v-icon>
          </v-btn>
        </template>
        <span>Apply Interval</span>
      </v-tooltip>
    </div>
    <div class="d-flex flex-wrap">
      <v-card class="mx-2 my-2 flex-grow-1">
        <v-card-title> UTC </v-card-title>
        <v-card-text>
          {{ utc }}
        </v-card-text>
      </v-card>
      <v-card class="mx-2 my-2 flex-grow-1">
        <v-card-title> Timestamp (ms) </v-card-title>
        <v-card-text>
          {{ timestamp }}
        </v-card-text>
      </v-card>
      <v-card class="mx-2 my-2 flex-grow-1">
        <v-card-title> ISO </v-card-title>
        <v-card-text>
          {{ iso }}
        </v-card-text>
      </v-card>
      <v-card class="mx-2 my-2 flex-grow-1">
        <v-card-title> Locale </v-card-title>
        <v-card-text>
          {{ locale }}
        </v-card-text>
      </v-card>
      <v-card class="mx-2 my-2 flex-grow-1">
        <v-card-title> Local </v-card-title>
        <v-card-text>
          {{ local }}
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      intervalMs: 1000,
      timer: null,
      utc: "",
      iso: "",
      locale: "",
      local: "",
      timestamp: "",
    };
  },
  methods: {
    update() {
      let date = new Date();
      this.utc = date.toUTCString();
      this.iso = date.toISOString();
      this.locale = date.toLocaleString();
      this.local = date.toString();
      this.timestamp = date.getTime();
    },
    applyTimer() {
      this.timer = setInterval(() => this.update(), this.intervalMs);
      this.update();
    },
    clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    },
    resetTimer() {
      this.clearTimer();
      this.applyTimer();
    },
  },
  mounted() {
    this.applyTimer();
  },
  destroyed() {
    this.clearTimer();
  },
};
</script>
