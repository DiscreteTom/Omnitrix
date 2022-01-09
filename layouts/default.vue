<template>
  <v-app dark>
    <v-navigation-drawer v-model="leftDrawer" clipped fixed app>
      <v-list>
        <v-list-item exact to="/data-format-transform">
          <v-list-item-action>
            <v-icon> mdi-file-replace-outline </v-icon>
          </v-list-item-action>
          <v-list-item-content>Data Transformer</v-list-item-content>
        </v-list-item>
        <v-list-item exact to="/time">
          <v-list-item-action>
            <v-icon> mdi-clock-outline </v-icon>
          </v-list-item-action>
          <v-list-item-content>Time Calculator</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar clipped-left fixed app dense>
      <v-app-bar-nav-icon @click.stop="leftDrawer = !leftDrawer" />
      <v-toolbar-title>
        <span style="color: #55f50a"> &gt; </span>
        Omnitrix
        <span style="color: #55f50a"> &lt; </span>
      </v-toolbar-title>

      <v-spacer />

      <!-- Github Btn -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" href="https://github.com/DiscreteTom/omnitrix">
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
