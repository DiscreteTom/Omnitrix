<template>
  <div>
    <video-player :options="videoOptions" ref="player" />
    <v-btn block @click="$refs.videoFileInput.click()" class="my-3">
      CHOOSE FILE
      <input
        type="file"
        ref="videoFileInput"
        @input="updateVideoSrc($event)"
        style="display: none"
        accept="video/*"
      />
    </v-btn>
  </div>
</template>

<script>
import VideoPlayer from "@/components/video-js.vue";

export default {
  components: {
    VideoPlayer,
  },
  data() {
    return {
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [],
        fluid: true,
      },
    };
  },
  methods: {
    updateVideoSrc(event) {
      if (!event?.target?.files?.[0]) return;

      this.videoOptions.sources[0] = {
        src: URL.createObjectURL(event.target.files[0]),
        type: event.target.files[0].type,
      };

      this.$refs.player.refresh();
    },
  },
};
</script>
