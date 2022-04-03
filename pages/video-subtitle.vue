<template>
  <div class="d-flex">
    <!-- left -->
    <div style="width: 620px" class="flex-shrink-0 mr-1"></div>
    <div class="mr-1" style="position: fixed">
      <div ref="videoContainer">
        <video controls ref="video" width="620">
          Sorry, your browser doesn't support embedded videos,
        </video>
      </div>

      <v-btn @click="$refs.videoFileInput.click()" block class="my-3">
        OPEN VIDEO FILE
        <input
          type="file"
          ref="videoFileInput"
          @change="updateVideoSrc($event)"
          style="display: none"
          accept="video/*"
        />
      </v-btn>
      <v-btn
        block
        class="my-3"
        @click="$refs.textFileInput.click()"
        :loading="loadingText"
      >
        Import Subtitle Text
        <input
          type="file"
          ref="textFileInput"
          @change="loadSubtitleText($event)"
          style="display: none"
          accept="text/*,.md"
        />
      </v-btn>
      <v-btn block class="my-3" @click="applyFrom"> APPLY FROM </v-btn>
      <v-btn block class="my-3" @click="applyTo"> APPLY TO </v-btn>
      <v-btn block class="my-3" @click="exportBcc"> EXPORT BCC </v-btn>
      <v-btn
        block
        class="my-3"
        @click="$refs.bccFileInput.click()"
        :loading="loadingBcc"
      >
        Import BCC
        <input
          type="file"
          ref="bccFileInput"
          @change="importBcc($event)"
          style="display: none"
          accept=".bcc,.json"
        />
      </v-btn>
    </div>

    <!-- right -->
    <div class="flex-grow-1 ml-1">
      <v-data-table
        :headers="headers"
        :items="subtitles"
        dense
        hide-default-footer
        :items-per-page="-1"
      >
        <template v-slot:[`item.index`]="{ index }">
          <v-icon v-if="index == currentIndex" color="green">
            mdi-arrow-right-thin
          </v-icon>
          <span v-else> {{ index + 1 }} </span>
        </template>
        <template v-slot:[`item.actions`]="{ index }">
          <div class="d-flex">
            <v-btn icon @click="currentIndex = index" small class="mx-1">
              <v-icon dense>mdi-arrow-left-thin</v-icon>
            </v-btn>
            <v-btn icon @click="subtitles.pop(index)" small>
              <v-icon dense>mdi-close</v-icon>
            </v-btn>
          </div>
        </template>
        <template v-slot:[`item.from`]="props">
          <v-edit-dialog :return-value.sync="props.item.from">
            {{ props.item.from }}
            <template v-slot:input>
              <v-text-field v-model="props.item.from" single-line />
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.to`]="props">
          <v-edit-dialog :return-value.sync="props.item.to">
            {{ props.item.to }}
            <template v-slot:input>
              <v-text-field v-model="props.item.to" single-line />
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:[`item.content`]="props">
          <v-edit-dialog :return-value.sync="props.item.content">
            {{ props.item.content }}
            <template v-slot:input>
              <v-text-field v-model="props.item.content" single-line />
            </template>
          </v-edit-dialog>
        </template>
      </v-data-table>

      <v-card>
        <v-card-text>
          <v-btn
            block
            @click="
              subtitles.push({
                content: '',
                from: (0.0).toFixed(2),
                to: (0.0).toFixed(2),
              })
            "
          >
            Add Line
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
function download(data, filename, type) {
  var file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}

export default {
  data() {
    return {
      headers: [
        { text: "Index", value: "index", sortable: false },
        { text: "From", value: "from", sortable: false },
        { text: "To", value: "to", sortable: false },
        { text: "Content", value: "content", sortable: false },
        { text: "Actions", value: "actions", sortable: false },
      ],
      subtitles: [], // [{ from, to, content }]
      loadingText: false,
      currentIndex: 0,
      video: null,
      loadingBcc: false,
    };
  },
  methods: {
    async loadSubtitleText(event) {
      if (!event?.target?.files?.[0]) return;

      await this.resetSubtitle(async () => {
        let txt = await event.target.files[0].text();
        txt
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length !== 0)
          .filter((line) => !line.startsWith("#"))
          .map((line) =>
            this.subtitles.push({ content: line, from: 0, to: 0 })
          );
      });
    },
    updateVideoSrc(event) {
      if (!event?.target?.files?.[0]) return;

      // remove existing video
      this.$refs.videoContainer.innerHTML = "";

      this.video = document.createElement("video");
      this.$refs.videoContainer.appendChild(this.video);
      this.video.controls = true;
      this.video.width = 620;

      let source = document.createElement("source");
      this.video.appendChild(source);
      source.src = URL.createObjectURL(event.target.files[0]);
    },
    applyFrom() {
      if (!this.video) {
        this.$bus.$emit("append-msg", "No video file.");
        return;
      }
      if (!this.subtitles.length) {
        this.$bus.$emit("append-msg", "No subtitle text.");
        return;
      }

      this.subtitles[this.currentIndex].from =
        this.video.currentTime.toFixed(2);
      // set previous `to` if not set
      if (
        this.currentIndex !== 0 &&
        this.subtitles[this.currentIndex - 1].to === 0
      ) {
        this.subtitles[this.currentIndex - 1].to =
          this.video.currentTime.toFixed(2);
      }
      // set last `to` if not set
      if (
        this.currentIndex == this.subtitles.length - 1 &&
        this.subtitles[this.currentIndex].to === 0
      ) {
        this.subtitles[this.currentIndex].to = this.video.duration.toFixed(2);
      }

      this.currentIndex++;
      this.currentIndex %= this.subtitles.length;
    },
    applyTo() {
      if (!this.video) {
        this.$bus.$emit("append-msg", "No video file.");
        return;
      }
      if (!this.subtitles.length) {
        this.$bus.$emit("append-msg", "No subtitle text.");
        return;
      }

      this.subtitles[this.currentIndex].from =
        this.video.currentTime.toFixed(2);
      this.currentIndex++;
      this.currentIndex %= this.subtitles.length;
    },
    exportBcc() {
      let result = {
        font_size: 0.4,
        font_color: "#FFFFFF",
        background_alpha: 0.5,
        background_color: "#9C27B0",
        Stroke: "none",
        body: this.subtitles.map((line) => {
          return {
            from: line.from,
            to: line.to,
            location: 2,
            content: line.content,
          };
        }),
      };
      download(JSON.stringify(result), "subtitle.bcc", "application/json");
    },
    async importBcc(event) {
      if (!event?.target?.files?.[0]) return;

      await this.resetSubtitle(async () => {
        let txt = await event.target.files[0].text();
        this.subtitles = JSON.parse(txt).body;
      });
    },
    async resetSubtitle(f) {
      this.loadingBcc = true;
      this.loadingText = true;
      this.subtitles = [];
      this.currentIndex = 0;

      await f();

      this.loadingBcc = false;
      this.loadingText = false;
    },
  },
};
</script>
