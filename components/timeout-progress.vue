<template>
  <v-progress-circular
    :color="color"
    :width="width"
    :value="value"
    class="timeout-progress"
    :rotate="rotate"
  >
    <slot />
  </v-progress-circular>
</template>

<script>
export default {
  props: {
    timeout: Number, // ms
    color: String,
    width: Number,
    reverse: Boolean,
    rotate: Number,
  },
  data() {
    return {
      startTime: 0,
      value: 0,
    };
  },
  mounted() {
    this.startTime = Date.now();
    this.update();
  },
  methods: {
    update() {
      let progress = ((Date.now() - this.startTime) / this.timeout) * 100;
      this.value = this.reverse ? progress : 100 - progress;
      if (progress <= 100) {
        window.requestAnimationFrame(this.update);
      }
    },
  },
};
</script>

<style>
.timeout-progress .v-progress-circular__overlay {
  transition: none !important;
}
</style>
