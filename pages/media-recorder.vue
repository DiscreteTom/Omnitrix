<template>
  <div class="mx-3">
    <!-- audio input -->
    <div class="d-flex align-center">
      <v-switch
        label="Audio"
        v-model="enableAudio"
        inset
        :disabled="recording"
        @change="updatePreview('audio')"
      />
      <v-select
        label="Captured Audio"
        :items="audioDeviceNames"
        v-model="audioDeviceName"
        outlined
        dense
        hide-details
        :disabled="!enableAudio || recording"
        class="ml-3"
        @change="updatePreview('audio')"
      />
    </div>

    <!-- video input -->
    <div class="d-flex align-center">
      <v-switch
        label="Video"
        v-model="enableVideo"
        :disabled="recording"
        inset
        @change="updatePreview('video')"
      />
      <v-radio-group
        v-model="videoInputType"
        row
        :disabled="!enableVideo || recording"
        class="ml-3"
        @change="updatePreview('video')"
      >
        <v-radio label="Camera" value="camera" />
        <v-radio label="Record Screen" value="screen" />
      </v-radio-group>
      <v-select
        v-if="videoInputType == 'camera'"
        label="Captured Video Device"
        :items="videoDeviceNames"
        v-model="videoDeviceName"
        outlined
        dense
        hide-details
        :disabled="!enableVideo || recording"
        @change="updatePreview('video')"
      />
      <v-btn
        v-if="videoInputType == 'screen'"
        :disabled="!enableVideo || recording"
        @click="selectWindow"
      >
        SELECT WINDOW
      </v-btn>
    </div>

    <!-- record controls -->
    <div class="d-flex align-center">
      <v-btn
        color="primary"
        :disabled="recording || !ready"
        @click="startRecording"
      >
        Start Recording
      </v-btn>
      <v-btn class="ml-3" :disabled="!recording" @click="stopRecording">
        End Recording
      </v-btn>
      <v-switch
        label="Preview"
        v-model="enablePreview"
        inset
        class="ml-3"
        @change="updatePreview('all')"
        :disabled="!ready"
      />
      <v-switch label="Mute Preview" v-model="mutePreview" inset class="ml-3" />
    </div>

    <video
      v-show="enablePreview"
      autoplay
      ref="preview"
      :muted="mutePreview"
      style="width: 100%"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: true,
      enableAudio: false,
      enableVideo: true,
      enablePreview: true,
      videoInputType: "screen",
      devices: [],
      audioDeviceName: "",
      videoDeviceName: "",
      recording: false,
      mutePreview: true,
      audioStream: null,
      videoStream: null,
      resultStream: null,
      recorder: null,
      chunks: [],
    };
  },
  methods: {
    async selectWindow() {
      this.videoStream?.getTracks().map((t) => t.stop()); // stop existing stream
      try {
        this.videoStream = await navigator.mediaDevices.getDisplayMedia();
      } catch (e) {
        console.log(e);
        this.videoStream = null;
      }
      this.updatePreview("video");
    },
    /** `updated` can be `'video'`, `'audio'`, or `'all'` */
    async updatePreview(updated) {
      if (!this.enablePreview) {
        this.$refs.preview.srcObject = null;
        return;
      }

      await this.getResultStream(updated);
      this.$refs.preview.srcObject = this.resultStream;
    },
    async startRecording() {
      this.recording = true;
      this.chunks = [];
      this.recorder = new MediaRecorder(await this.getResultStream(), {
        mimeType: "video/webm;codecs=vp9",
      });
      this.recorder.ondataavailable = function (e) {
        this.chunks.push(e.data);
      };
      this.recorder.start();
      this.$bus.$emit("append-msg", "Recording started");
    },
    stopRecording() {
      this.recording = false;
      this.recorder.stop();
      var a = document.createElement("a");
      a.download = "capture.mp4";
      a.href = URL.createObjectURL(new Blob(this.chunks));
      a.click();
      this.recorder = null;
    },
    /** `updated` can be `'video'`, `'audio'`, or `'all'` */
    async getResultStream(updated) {
      await this.refreshDeviceList();

      if (["audio", "all"].includes(updated)) {
        this.audioStream?.getTracks().map((t) => t.stop()); // stop existing stream
        if (this.enableAudio) {
          this.audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
              deviceId: {
                exact: this.devices.filter(
                  (d) => d.label == this.audioDeviceName
                )[0].deviceId,
              },
            },
          });
        } else {
          this.audioStream = null;
        }
      }

      if (["video", "all"].includes(updated)) {
        if (this.enableVideo) {
          if (this.videoInputType == "camera") {
            this.videoStream?.getTracks().map((t) => t.stop()); // stop existing stream
            this.videoStream = await navigator.mediaDevices.getUserMedia({
              video: {
                deviceId: {
                  exact: this.devices.filter(
                    (d) => d.label == this.videoDeviceName
                  )[0].deviceId,
                },
              },
            });
          }
        } else {
          this.videoStream?.getTracks().map((t) => t.stop()); // stop existing stream
          this.videoStream = null;
        }
      }

      let stream = new MediaStream();
      this.audioStream?.getTracks().map((t) => stream.addTrack(t));
      this.videoStream?.getTracks().map((t) => stream.addTrack(t));

      this.resultStream = stream.getTracks().length == 0 ? null : stream;
    },
    async refreshDeviceList() {
      if (
        this.enableAudio ||
        (this.enableVideo && this.videoInputType == "camera")
      ) {
        this.$bus.$emit("append-msg", "Refreshing device list...");

        let devices = await navigator.mediaDevices.enumerateDevices();
        if (devices.some((d) => d.label == "")) {
          // need to retrieve permission
          try {
            this.ready = false;
            (
              await navigator.mediaDevices.getUserMedia({
                audio: this.enableAudio,
                video: this.enableVideo && this.videoInputType == "camera",
              })
            )
              .getTracks()
              .map((t) => t.stop()); // stop devices

            // enumerate again
            devices = await navigator.mediaDevices.enumerateDevices();
          } catch {
            this.$bus.$emit("append-msg", "Failed to get media devices.");
            this.enableAudio = false;
            this.videoInputType = "screen";
            this.ready = true;
            return;
          }
        }

        this.devices = devices;
        this.audioDeviceName ||= this.audioDeviceNames[0] || "";
        this.videoDeviceName ||= this.videoDeviceNames[0] || "";
        this.ready = true;
      }
    },
  },
  mounted() {
    this.updatePreview();
  },
  computed: {
    audioDeviceNames() {
      return this.devices
        .filter((d) => d.kind.startsWith("audio"))
        .map((d) => d.label);
    },
    videoDeviceNames() {
      return this.devices
        .filter((d) => d.kind.startsWith("video"))
        .map((d) => d.label);
    },
  },
};
</script>
