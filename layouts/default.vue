<template>
  <v-app dark>
    <v-navigation-drawer v-model="leftDrawer" clipped fixed app>
      <v-list>
        <v-list-item v-for="page in pages" :key="page.text" exact :to="page.to">
          <v-list-item-action>
            <v-icon> {{ page.icon }} </v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ page.text }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app dense>
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <v-toolbar-title class="d-flex">
        <div style="color: #55f50a; transform: scale(0.8, 1.5)">&gt;</div>
        <span class="mx-2">Omnitrix</span>
        <div style="color: #55f50a; transform: scale(0.8, 1.5)">&lt;</div>
      </v-toolbar-title>

      <v-spacer />

      <!-- Github Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" href="https://github.com/DiscreteTom/Omnitrix">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </template>
        <span>View Source Code</span>
      </v-tooltip>
      <!-- Share Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            v-on="on"
            @click="
              $copyText(getUrl()).then(() => $bus.$emit('append-msg', 'Copied'))
            "
          >
            <v-icon>mdi-share-variant</v-icon>
          </v-btn>
        </template>
        <span>Copy Link</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer inset absolute app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>

    <v-snackbars
      :messages.sync="messages"
      :timeout="msgTimeout"
      bottom
      right
      app
    >
      <template v-slot:action="{ close }">
        <timeout-progress
          color="white"
          :width="2"
          :timeout="msgTimeout"
          :rotate="-90"
        >
          <v-btn icon @click="close()">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </timeout-progress>
      </template>
    </v-snackbars>
  </v-app>
</template>

<script>
import VSnackbars from "v-snackbars";
import TimeoutProgress from "../components/timeout-progress.vue";

export default {
  components: {
    "v-snackbars": VSnackbars,
    TimeoutProgress,
  },
  data() {
    return {
      leftDrawer: true,
      messages: [],
      msgTimeout: 5000,
      pages: [
        {
          to: "/data-transformer",
          icon: "mdi-file-replace-outline",
          text: "Data Transformer",
        },
        {
          to: "/time-calculator",
          icon: "mdi-clock-outline",
          text: "Time Calculator",
        },
        {
          to: "/text-codec",
          icon: "mdi-message-text-lock-outline",
          text: "Text Codec",
        },
        {
          to: "/code-reader",
          icon: "mdi-code-tags",
          text: "Code Reader",
        },
        {
          to: "/cidr-calculator",
          icon: "mdi-web",
          text: "CIDR Calculator",
        },
        {
          to: "/number-convertor",
          icon: "mdi-hexadecimal",
          text: "Number Convertor",
        },
        {
          to: "/random",
          icon: "mdi-help-circle-outline",
          text: "Random Generator",
        },
        {
          to: "/qrcode",
          icon: "mdi-qrcode",
          text: "QR Code Generator",
        },
        {
          to: "/uuid-generator",
          icon: "mdi-numeric",
          text: "UUID Generator",
        },
        {
          to: "/raspi-wifi-manager",
          icon: "mdi-bluetooth-settings",
          text: "Raspi Wifi Manager",
        },
      ],
    };
  },
  methods: {
    getUrl() {
      return window.location.href;
    },
  },
  async mounted() {
    this.$bus.$on("append-msg", (e) => this.messages.push(e));

    // show msg when new content available
    const workbox = await window.$workbox;
    if (workbox) {
      workbox.addEventListener("installed", (event) => {
        if (event.isUpdate) {
          this.$bus.$emit(
            "append-msg",
            "New content available. Please refresh this page."
          );
        }
      });
    }
  },
};
</script>
