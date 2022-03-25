<template>
  <div>
    <!-- ble config -->
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
                class="mb-3"
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

    <!-- wifi management -->
    <v-card :disabled="wifiChar == null" class="mb-3">
      <v-card-title> Raspberry Pi Network </v-card-title>
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
        />
        <v-text-field
          label="Current Router"
          v-model="info.router"
          outlined
          dense
          hide-details
          disabled
          class="mb-3"
        />
        <v-switch
          v-model="info.ipIsStatic"
          label="Use Static IP"
          inset
          class="mb-3"
          hide-details
        />
        <v-text-field
          label="Static IP with Prefix Length"
          v-model="info.staticIp"
          outlined
          dense
          :rules="[
            (value) => value.includes('/') && value.split('/')[1].length > 0,
          ]"
          hide-details
          :disabled="!info.ipIsStatic"
          class="mb-3"
          placeholder="192.168.0.123/24"
        />
        <v-text-field
          label="Static Router"
          v-model="info.staticRouter"
          outlined
          dense
          hide-details
          :disabled="!info.ipIsStatic"
          class="mb-3"
          placeholder="192.168.0.1"
        />
        <v-btn block @click="save" :loading="saving" class="mb-3">
          Save Configuration
        </v-btn>
        <v-btn block @click="refresh" :loading="refreshing"> Refresh </v-btn>
      </v-card-text>
    </v-card>

    <!-- commands -->
    <v-card :disabled="cmdChar == null" class="mb-3">
      <v-card-title> Run Commands </v-card-title>
      <v-card-text>
        <div class="d-flex align-center">
          <v-text-field
            label="Shell Command"
            v-model="currentCmd"
            placeholder="echo 123"
            outlined
            dense
            hide-details
            class="mr-3"
          />
          <v-btn icon @click="runCommand">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
        <v-expansion-panels>
          <v-expansion-panel v-for="result in cmdResults" :key="result.UUID">
            <v-card>
              <v-card-title>
                {{ result.Cmd }}
              </v-card-title>
              <v-card-subtitle>UUID: {{ result.UUID }}</v-card-subtitle>
              <v-card-text v-if="result.loading">
                <v-progress-circular indeterminate />
              </v-card-text>
              <v-card-text v-else>
                {{ result.Output }}
              </v-card-text>
            </v-card>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import * as uuid from "uuid";

export default {
  data() {
    return {
      secret: "Omnitrix",
      showSecret: false,
      acceptAllDevices: false,
      namePrefix: "BLE Raspi Manager",
      loading: false,
      device: null,
      server: null,
      service: null,
      wifiChar: null,
      cmdChar: null,
      info: {
        ssid: "",
        psk: "",
        currentIp: "",
        ipIsStatic: false,
        staticIp: "",
        router: "",
        staticRouter: "",
      },
      oldInfo: {
        ssid: "",
        psk: "",
        currentIp: "",
        ipIsStatic: false,
        staticIp: "",
        router: "",
        staticRouter: "",
      },
      showPsk: false,
      saving: false,
      refreshing: false,
      currentCmd: "",
      cmdResults: [], // [{Cmd: '', Output: '', UUID:'', loading: true}]
    };
  },
  methods: {
    async connect() {
      this.loading = true;

      let namespaceUUID = uuid.v5("discretetom.github.io", uuid.v5.DNS);
      let serviceUUID = uuid.v5(this.secret, namespaceUUID);
      let wifiCharUUID = uuid.v5("wifi", serviceUUID);
      let cmdCharUUID = uuid.v5("cmd", serviceUUID);

      let filter = {};
      if (this.acceptAllDevices) filter.acceptAllDevices = true;
      else filter.namePrefix = this.namePrefix;

      try {
        this.device = await navigator.bluetooth.requestDevice({
          filters: [filter],
          optionalServices: [serviceUUID],
        });
        this.device.addEventListener("gattserverdisconnected", () => {
          this.disconnect("Raspi disconnected.");
        });

        this.$bus.$emit("append-msg", "Connecting...");
        this.server = await this.device.gatt.connect();

        this.$bus.$emit("append-msg", "Getting service...");
        this.service = await this.server.getPrimaryService(serviceUUID);

        this.$bus.$emit("append-msg", "Getting characteristic...");
        this.wifiChar = await this.service.getCharacteristic(wifiCharUUID);
        this.cmdChar = await this.service.getCharacteristic(cmdCharUUID);
        this.refresh();
      } catch (e) {
        console.log(e);
        this.disconnect(e);
      } finally {
        this.loading = false;
      }
    },
    async save() {
      if (!this.server?.connected) {
        this.disconnect("BLE server disconnected.");
        return;
      }
      this.saving = true;
      try {
        let result = {
          SSID: this.info.ssid,
          PSK: this.info.psk,
          Static: this.info.ipIsStatic,
          StaticIP: this.info.staticIp,
          Router: this.info.staticRouter,
        };
        let encoder = new TextEncoder();
        await this.wifiChar.writeValue(encoder.encode(JSON.stringify(result)));
        this.$bus.$emit("append-msg", "Saved.");

        if (
          (!this.info.ipIsStatic && this.oldInfo.ipIsStatic) ||
          (this.info.ipIsStatic &&
            (this.info.staticIp != this.oldInfo.staticIp ||
              this.info.staticRouter != this.oldInfo.staticRouter))
        ) {
          this.disconnect("Raspi will reboot. Disconnected.");
        }
      } catch (e) {
        console.log(e);
        this.disconnect(e);
      } finally {
        this.saving = false;
      }
    },
    disconnect(e) {
      this.$bus.$emit("append-msg", e);
      try {
        this.device.gatt.disconnect();
      } catch {}
      this.device = null;
      this.server = null;
    },
    async refresh() {
      this.refreshing = true;
      try {
        this.$bus.$emit("append-msg", "Getting information...");
        let res = await this.wifiChar.readValue();
        let decoder = new TextDecoder("utf-8");
        let info = JSON.parse(decoder.decode(res.buffer));
        this.info.ssid = info.SSID;
        this.info.psk = info.PSK;
        this.info.currentIp = info.CurrentIP;
        this.info.ipIsStatic = info.Static;
        this.info.staticIp = info.StaticIP;
        if (info.Static) {
          this.info.staticRouter = info.Router;
        } else {
          this.info.staticRouter = "";
        }
        this.info.router = info.Router;
        this.oldInfo = JSON.parse(JSON.stringify(this.info)); // deep copy
        this.$bus.$emit("append-msg", "Updated.");
      } catch (e) {
        this.disconnect(e);
      } finally {
        this.refreshing = false;
      }
    },
    async runCommand() {
      let encoder = new TextEncoder();
      let result = { Cmd: this.currentCmd, UUID: uuid.v4() };
      await this.cmdChar.writeValue(encoder.encode(JSON.stringify(result)));
      result.loading = true;
      this.cmdResults.push(result);
      while (true) {
        // sleep
        await new Promise((r) => setTimeout(r, 1000));

        let res = await this.cmdChar.readValue();
        let decoder = new TextDecoder("utf-8");
        let info = JSON.parse(decoder.decode(res.buffer));
        if (info.UUID == result.UUID) {
          this.cmdResults.map((r) => {
            if (r.UUID == info.UUID) {
              r.loading = false;
              r.Output = info.Output;
            }
          });
          break;
        }
      }
    },
  },
};
</script>