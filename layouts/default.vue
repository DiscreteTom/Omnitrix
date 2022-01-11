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
          <v-btn icon v-on="on" :data-clipboard-text="url" id="share-btn">
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
  </v-app>
</template>

<script>
import ClipboardJS from "clipboard";

export default {
  data() {
    return {
      leftDrawer: true,
      isMounted: false,
      clipboard: null,
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
          icon: "mdi-code-tags",
          text: "Text Codec",
        },
        {
          to: "/random",
          icon: "mdi-help-circle-outline",
          text: "Random Generator",
        },
      ],
    };
  },
  computed: {
    url() {
      return this.isMounted ? window.location.href : "";
    },
  },
  mounted() {
    this.isMounted = true;
    this.clipboard = new ClipboardJS("#share-btn");
  },
  destroyed() {
    delete this.clipboard;
  },
};
</script>
