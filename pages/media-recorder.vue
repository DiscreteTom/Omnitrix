<template>
  <div class="mx-3">
    <!-- audio input -->
    <div class="d-flex align-center">
      <v-switch
        label="Audio"
        v-model="enableAudio"
        inset
        :disabled="recording"
        @change="updatePreview"
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
        @change="updatePreview"
      />
    </div>

    <!-- video input -->
    <div class="d-flex align-center">
      <v-switch
        label="Video"
        v-model="enableVideo"
        :disabled="recording"
        inset
        @change="updatePreview"
      />
      <v-radio-group
        v-model="videoInputType"
        row
        :disabled="!enableVideo || recording"
        class="ml-3"
        @change="updatePreview"
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
        @change="updatePreview"
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
        @change="updatePreview"
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
      ready: false,
      enableAudio: true,
      enableVideo: true,
      enablePreview: false,
      videoInputType: "camera",
      devices: [],
      audioDeviceName: "",
      videoDeviceName: "",
      recording: false,
      mutePreview: true,
      screenStream: null,
      deviceStream: null,
      recorder: null,
      chunks: [],
    };
  },
  methods: {
    async selectWindow() {
      try {
        this.screenStream = await navigator.mediaDevices.getDisplayMedia();
      } catch (e) {
        console.log(e);
        this.screenStream = null;
      }
      this.updatePreview();
    },
    async updatePreview() {
      if (!this.enablePreview) {
        this.$refs.preview.srcObject = null;
        return;
      }

      this.$refs.preview.srcObject = await this.getResultStream();
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
    async getResultStream() {
      let options = { audio: false, video: false };
      if (this.enableAudio) {
        options.audio = {
          deviceId: {
            exact: this.devices.filter(
              (d) => d.label == this.audioDeviceName
            )[0].deviceId,
          },
        };
      }
      if (this.enableVideo) {
        if (this.videoInputType == "camera") {
          options.video = {
            deviceId: {
              exact: this.devices.filter(
                (d) => d.label == this.videoDeviceName
              )[0].deviceId,
            },
          };
        }
      }

      try {
        this.deviceStream = await navigator.mediaDevices.getUserMedia(options);
      } catch (e) {
        console.log(e);
        this.deviceStream = null;
      }

      let stream = new MediaStream();
      this.deviceStream?.getTracks().map((t) => stream.addTrack(t));
      this.screenStream?.getTracks().map((t) => stream.addTrack(t));

      return stream.getTracks().length == 0 ? null : stream;
    },
    async refreshDevices() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      } catch {
        this.$bus.$emit("append-msg", "Failed to get media devices.");
        return;
      }
      this.devices = await navigator.mediaDevices.enumerateDevices();
      this.audioDeviceName ||= this.audioDeviceNames[0];
      this.videoDeviceName ||= this.videoDeviceNames[0];
      this.ready = true;
    },
  },
  mounted() {
    this.refreshDevices();
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
