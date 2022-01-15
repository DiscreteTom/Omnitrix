<template>
  <v-dialog v-model="show">
    <v-card>
      <v-card-title>Open from URL</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="url"
          label="URL"
          placeholder="https://example.com"
        />
        <v-alert v-if="err !== ''" type="error">
          {{ err }}
        </v-alert>
        <v-btn @click="open" color="primary" :loading="opening"> Open </v-btn>
        <v-btn @click="show = false" class="mx-3"> Close </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      show: false,
      opening: false,
      err: "",
      url: "",
    };
  },
  methods: {
    open() {
      this.opening = true;
      this.err = "";
      this.$axios
        .get(this.url)
        .then((res) => {
          this.$emit("open", res.data);
          this.opening = false;
          this.show = false;
        })
        .catch((e) => {
          this.opening = false;
          this.err = e;
        });
    },
  },
  mounted() {
    this.show = this.value;
  },
  watch: {
    show(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.show = val;
    },
  },
};
</script>
