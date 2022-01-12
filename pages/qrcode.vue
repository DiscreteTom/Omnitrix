<template>
  <div>
    <div
      style="height: 80vh"
      class="d-flex justify-center align-center flex-wrap"
    >
      <v-textarea
        v-model="value"
        label="QR Code Content"
        outlined
        :height="size"
        hide-details
        class="mx-3"
      />
      <div
        style="border: solid 1px white"
        class="mx-3"
        :style="`height: ${size + 2}px`"
      >
        <qrcode-vue :value="value" :size="size" level="H" />
      </div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  components: {
    QrcodeVue,
  },
  data() {
    return {
      value: "https://discretetom.github.io/Omnitrix/",
      size: 300,
    };
  },
};
</script>
