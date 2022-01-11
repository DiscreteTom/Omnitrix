<template>
  <div>
    <v-row>
      <!-- from -->
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-select
                class="mr-3"
                outlined
                dense
                @input="updateRight"
                :items="leftChoices"
                v-model="left"
                :label="leftLabel"
                hide-details
              />
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="clipboard-btn"
                    :data-clipboard-text="leftTxt"
                    v-on="on"
                  >
                    <v-icon> mdi-content-copy </v-icon>
                  </v-btn>
                </template>
                <span>Copy</span>
              </v-tooltip>
            </div>
            <code-jar
              @input="onInput"
              codeStyle="background:#272822;"
              :highlighter="highlighter"
              :lang="leftLang"
              line-numbers
            />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- to -->
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-select
                class="mr-3"
                outlined
                dense
                @input="updateRight"
                v-model="right"
                :items="rightChoices"
                :label="rightLabel"
                hide-details
              />

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">
                    <v-switch
                      v-model="live"
                      inset
                      hide-details
                      class="mt-0 ml-2"
                    />
                  </span>
                </template>
                <span>Live</span>
              </v-tooltip>

              <v-tooltip top v-if="!live">
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on" @click="updateRight" class="mr-2">
                    <v-icon> mdi-check </v-icon>
                  </v-btn>
                </template>
                <span>{{ transformButtonText }}</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    class="clipboard-btn"
                    :data-clipboard-text="rightTxt"
                    v-on="on"
                  >
                    <v-icon> mdi-content-copy </v-icon>
                  </v-btn>
                </template>
                <span>Copy</span>
              </v-tooltip>
            </div>
            <code-jar
              :value="rightTxt"
              readonly
              codeStyle="background:#272822;"
              :highlighter="highlighter"
              :lang="rightLang"
              line-numbers
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import CodeJar from "vue-codejar";
import ClipboardJS from "clipboard";

export default {
  components: { CodeJar },
  props: {
    leftLabel: { type: String, default: "From" },
    rightLabel: {
      type: String,
      default: "To",
    },
    leftChoices: {
      type: Array,
      default: [],
    },
    rightChoices: {
      type: Array,
      default: [],
    },
    transformer: {
      type: Function,
      default: (t) => t,
    },
    transformButtonText: {
      type: String,
      default: "Transform",
    },
    leftValue: String,
    rightValue: String,
    leftLang: String,
    rightLang: String,
  },
  data() {
    return {
      left: "",
      right: "",
      leftTxt: "",
      rightTxt: "",
      clipboard: null,
      live: true,
    };
  },
  methods: {
    onInput(code) {
      this.leftTxt = code;
      if (this.live) this.updateRight();
    },
    highlighter(editor) {
      this.$prism.highlightElement(editor);
    },
    updateRight() {
      this.$nextTick(() => {
        this.rightTxt = this.transformer(this.leftTxt);
      });
    },
  },
  mounted() {
    this.clipboard = new ClipboardJS(".clipboard-btn");
    this.left = this.leftValue;
    this.right = this.rightValue;
  },
  destroyed() {
    delete this.clipboard;
  },
  watch: {
    left(val, old) {
      if (old !== val) this.$emit("left-change", val);
    },
    right(val, old) {
      if (old !== val) this.$emit("right-change", val);
    },
    leftValue(val) {
      this.left = val;
    },
    rightValue(val) {
      this.right = val;
    },
  },
};
</script>
