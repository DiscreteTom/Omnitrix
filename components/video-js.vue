<template>
  <div>
    <div ref="videoContainer"></div>
  </div>
</template>

<script>
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-hotkeys";

export default {
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      player: null,
    };
  },
  mounted() {
    this.refresh;
  },
  methods: {
    refresh() {
      this.player?.dispose();

      let video = document.createElement("video");
      video.className = "video-js";
      this.$refs.videoContainer.appendChild(video);
      this.player = videojs(video, this.options, function () {
        this.hotkeys();
      });
    },
  },
  beforeDestroy() {
    this.player?.dispose();
  },
};
</script>
