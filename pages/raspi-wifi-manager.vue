<template>
  <div>
    <v-card class="mb-3">
      <v-card-title> Bluetooth LE Configurations </v-card-title>
      <v-card-text>
        <v-text-field
          label="Secret"
          :type="showSecret ? 'text' : 'password'"
          v-model="secret"
          outlined
          dense
          hide-details
          :append-icon="showSecret ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showSecret = !showSecret"
          class="mb-3"
        />
        <v-expansion-panels class="mb-3">
          <v-expansion-panel>
            <v-expansion-panel-header>
              Additional Settings
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-switch
                v-model="acceptAllDevices"
                label="Accept All Devices"
                inset
                hide-details
              />
              <v-text-field
                :disabled="acceptAllDevices"
                label="Device Name Prefix"
                v-model="namePrefix"
                outlined
                dense
                hide-details
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-btn
          block
          @click="connect"
          :loading="loading"
          :disabled="device != null"
        >
          Connect to Raspi
        </v-btn>
      </v-card-text>
    </v-card>

    <v-card :disabled="device == null">
      <v-card-title> Raspberry Pi </v-card-title>
      <v-card-text>
        <v-text-field
          label="Wifi Name"
          v-model="info.ssid"
          outlined
          dense
          hide-details
          class="mb-3"
        />
        <v-text-field
          label="Wifi Password"
          v-model="info.psk"
          outlined
          dense
          hide-details
          :type="showPsk ? 'text' : 'password'"
          :append-icon="showPsk ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPsk = !showPsk"
          class="mb-3"
        />
        <v-text-field
          label="Current IP"
          v-model="info.currentIp"
          outlined
          dense
          hide-details
          disabled
          class="mb-3"
          placeholder="192.168.0.1"
        />
        <v-switch
          v-model="info.ipIsStatic"
          label="Use Static IP"
          inset
          class="mb-3"
          hide-details
        />
        <v-text-field
          label="Static IP"
          v-model="info.staticIp"
          outlined
          dense
          hide-details
          :disabled="!info.ipIsStatic"
          class="mb-3"
          placeholder="192.168.0.1/24"
        />
        <v-btn block> Save Configuration </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { v5 as uuidv5 } from "uuid";

export default {
  data() {
    return {
      secret: "Omnitrix",
      showSecret: false,
      acceptAllDevices: false,
      namePrefix: "Raspi Wifi Manager",
      loading: false,
      device: null,
      server: null,
      service: null,
      char: null,
      info: {
        ssid: "",
        psk: "",
        currentIp: "",
        ipIsStatic: false,
        staticIp: "",
      },
      showPsk: false,
    };
  },
  methods: {
    async connect() {
      this.loading = true;

      let namespaceUUID = uuidv5("discretetom.github.io", uuidv5.DNS);
      let serviceUUID = uuidv5(this.secret, namespaceUUID);
      let charUUID = uuidv5("info", serviceUUID);

      let filter = {};
      if (this.acceptAllDevices) filter.acceptAllDevices = true;
      else filter.namePrefix = this.namePrefix;

      try {
        this.device = await navigator.bluetooth.requestDevice({
          filters: [filter],
          optionalServices: [serviceUUID],
        });

        this.$bus.$emit("append-msg", "Connecting...");
        this.server = await this.device.gatt.connect();

        this.$bus.$emit("append-msg", "Getting service...");
        this.service = await this.server.getPrimaryService(serviceUUID);

        this.$bus.$emit("append-msg", "Getting characteristic...");
        this.char = await this.service.getCharacteristic(charUUID);

        this.$bus.$emit("append-msg", "Getting information...");
        let res = await this.char.readValue();
        let decoder = new TextDecoder("utf-8");
        let info = JSON.parse(decoder.decode(res.buffer));
        this.info.ssid = info.SSID;
        this.info.psk = info.PSK;
        this.info.currentIp = info.CurrentIP;
        this.info.ipIsStatic = info.Static;
        this.info.staticIp = info.StaticIP;
      } catch (e) {
        console.log(e);
        this.server = null;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
