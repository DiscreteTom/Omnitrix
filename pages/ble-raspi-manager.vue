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
                class="mb-3"
              />
              <v-text-field
                label="Read Interval for Long Content (ms)"
                v-model="bleReadInterval"
                outlined
                dense
                hide-details
                type="number"
                class="mb-3"
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
          label="Connected Wifi"
          v-model="wifiStatus.currentWifi"
          outlined
          dense
          hide-details
          disabled
          class="mb-3"
        />
        <v-text-field
          label="Current IP"
          v-model="wifiStatus.currentIp"
          outlined
          dense
          hide-details
          disabled
          class="mb-3"
        />
        <v-text-field
          label="Current Router"
          v-model="wifiStatus.router"
          outlined
          dense
          hide-details
          disabled
          class="mb-3"
        />
        <v-text-field
          label="Static IP with Prefix Length"
          v-model="wifiStatus.staticIp"
          outlined
          dense
          :rules="[
            (value) => value.includes('/') && value.split('/')[1].length > 0,
          ]"
          hide-details
          class="mb-3"
          placeholder="192.168.0.123/24"
        />
        <v-text-field
          label="Static Router"
          v-model="wifiStatus.staticRouter"
          outlined
          dense
          :disabled="!wifiStatus.staticIp"
          hide-details
          class="mb-3"
          placeholder="192.168.0.1"
        />
        <v-card class="mb-3">
          <v-card-title>WIFIs</v-card-title>
          <v-card-text>
            <div
              v-for="(wifi, i) in wifiStatus.wifis"
              :key="i"
              class="d-flex mb-3"
            >
              <v-text-field
                v-model="wifi.SSID"
                label="SSID"
                outlined
                dense
                hide-details
                class="mb-3"
              />
              <v-text-field
                v-model="wifi.PSK"
                label="PSK"
                outlined
                dense
                hide-details
                class="mb-3 mx-3"
                :type="wifi.showPsk ? 'text' : 'password'"
                :append-icon="wifi.showPsk ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="wifi.showPsk = !wifi.showPsk"
              />
              <v-btn icon @click="wifiStatus.wifis.splice(i, 1)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
            <v-btn
              block
              @click="
                wifiStatus.wifis.push({ SSID: '', PSK: '', showPsk: false })
              "
              class="mb-3"
            >
              Add WIFI
            </v-btn>
          </v-card-text>
        </v-card>
        <v-btn block @click="save" :loading="saving" class="mb-3">
          Save Configuration
        </v-btn>
        <v-btn block @click="refreshWifi" :loading="refreshingWifi">
          Refresh
        </v-btn>
      </v-card-text>
    </v-card>

    <!-- commands -->
    <v-card :disabled="cmdChar == null" class="mb-3">
      <v-card-title> Run Commands </v-card-title>
      <v-card-text>
        <div class="d-flex align-center mb-3">
          <v-text-field
            label="Shell Command"
            v-model="currentCmd"
            placeholder="echo 123"
            outlined
            dense
            hide-details
            class="mr-3"
            @keydown.enter="runCommand"
          />
          <v-btn icon @click="runCommand">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </div>
        <v-expansion-panels>
          <v-expansion-panel
            v-for="(result, i) in cmdResults"
            :key="result.UUID"
          >
            <v-card>
              <v-card-title class="d-flex align-center">
                <div class="flex-grow-1">
                  {{ result.Cmd }}
                </div>
                <v-btn icon @click="cmdResults.splice(i, 1)">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-subtitle>UUID: {{ result.UUID }}</v-card-subtitle>
              <v-card-text style="overflow: auto">
                <pre>{{ result.Output }}</pre>
                <v-progress-circular v-if="result.loading" indeterminate />
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
      wifiStatus: {
        currentWifi: "",
        currentIp: "",
        staticIp: "",
        router: "",
        wifis: [],
        staticRouter: "",
      },
      oldwifiStatus: {
        currentWifi: "",
        currentIp: "",
        staticIp: "",
        router: "",
        wifis: [],
      },
      showPsk: false,
      saving: false,
      refreshingWifi: false,
      currentCmd: "",
      cmdResults: [], // [{Cmd: '', Output: '', UUID:'', loading: true}]
      bleReadInterval: 500,
    };
  },
  methods: {
    async connect() {
      this.loading = true;

      let namespaceUUID = uuid.v5("discretetom.github.io", uuid.v5.DNS);
      let serviceUUID = uuid.v5(this.secret, namespaceUUID);
      let wifiCharUUID = uuid.v5("wifi", serviceUUID);
      let cmdCharUUID = uuid.v5("cmd", serviceUUID);

      let condition = {};
      if (this.acceptAllDevices) condition.acceptAllDevices = true;
      else condition.filters = [{ namePrefix: this.namePrefix }];

      // choose device
      try {
        this.device = await navigator.bluetooth.requestDevice({
          ...condition,
          optionalServices: [serviceUUID],
        });

        this.$bus.$emit("append-msg", "Connecting...");
        this.server = await this.device.gatt.connect();

        this.$bus.$emit("append-msg", "Getting service...");
        this.service = await this.server.getPrimaryService(serviceUUID);

        this.$bus.$emit("append-msg", "Getting characteristic...");
        this.wifiChar = await this.service.getCharacteristic(wifiCharUUID);
        this.cmdChar = await this.service.getCharacteristic(cmdCharUUID);
        this.refreshWifi();
      } catch (e) {
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
      let WIFIs = [];
      this.wifiStatus.wifis.map((w) =>
        WIFIs.push({ SSID: w.SSID, PSK: w.PSK })
      );
      let req = {
        RefreshOnly: false,
        StaticIP: this.wifiStatus.staticIp,
        Router:
          this.wifiStatus.staticIp.length > 0
            ? this.wifiStatus.staticRouter
            : "",
        WIFIs,
      };

      try {
        await this.bleWrite(this.wifiChar, uuid.v4(), JSON.stringify(req));
        this.$bus.$emit("append-msg", "Saved.");
        await this.refreshWifi();
      } catch (e) {
        this.disconnect(e);
      } finally {
        this.saving = false;
      }
    },
    disconnect(e) {
      console.log(e);
      this.$bus.$emit("append-msg", e);
      try {
        this.device.gatt.disconnect();
      } catch {}
      this.device = null;
      this.server = null;
    },
    async refreshWifi() {
      this.refreshingWifi = true;
      try {
        this.$bus.$emit("append-msg", "Getting information...");
        let id = uuid.v4();

        await this.bleWrite(
          this.wifiChar,
          id,
          JSON.stringify({ RefreshOnly: true })
        );
        let res = await this.bleRead(this.wifiChar, id);
        let info = JSON.parse(res);
        console.log(info);

        this.wifiStatus.currentWifi = info.CurrentWIFI;
        this.wifiStatus.currentIp = info.CurrentIP;
        this.wifiStatus.router = info.Router;
        this.wifiStatus.staticIp = info.StaticIP;
        this.wifiStatus.staticRouter =
          info.StaticIP.length > 0 ? info.Router : "";
        this.wifiStatus.wifis = info.WIFIs.map((w) => {
          w.showPsk = false;
          return w;
        });

        this.oldwifiStatus = JSON.parse(JSON.stringify(this.wifiStatus)); // deep copy
        this.$bus.$emit("append-msg", "Updated.");
      } catch (e) {
        console.log(e);
        this.$bus.$emit("append-msg", e);
        // this.disconnect(e);
      } finally {
        this.refreshingWifi = false;
      }
    },
    async runCommand() {
      let id = uuid.v4();
      let result = { Cmd: this.currentCmd, UUID: id, loading: true };
      this.currentCmd = "";
      this.cmdResults.unshift(result);

      await this.bleWrite(this.cmdChar, id, result.Cmd);

      try {
        let res = await this.bleRead(this.cmdChar, id);
        this.cmdResults.map((r) => {
          if (r.UUID == result.UUID) {
            r.loading = false;
            r.Output = res;
          }
        });
      } catch (e) {
        this.cmdResults.map((r) => {
          if (r.UUID == result.UUID) {
            r.loading = false;
            r.Output = e;
          }
        });
      }
    },
    async bleWrite(char, uuid, content) {
      let encoder = new TextEncoder();
      let uuidBytes = encoder.encode(uuid);
      let contentBytes = encoder.encode(content);
      let start = 0;
      while (true) {
        let end = start + 256; // send 256 byte every time
        if (end > contentBytes.byteLength) end = contentBytes.byteLength;
        await char.writeValue(
          this.concatBytes(uuidBytes, contentBytes.slice(start, end))
        );
        if (end == contentBytes.byteLength) break;
        start = end;
      }
      // send uuid only to finish
      await char.writeValue(uuidBytes);
    },
    async bleRead(char, uuid) {
      let buffer = new Uint8Array();
      let decoder = new TextDecoder("utf-8");
      const UUID_Length = 36;
      while (true) {
        // wait for command execution
        await new Promise((r) => setTimeout(r, this.bleReadInterval));

        let res = await char.readValue();
        if (decoder.decode(res.buffer.slice(0, UUID_Length)) == uuid) {
          if (res.buffer.byteLength == UUID_Length) {
            // uuid only, read completed
            return decoder.decode(buffer);
          }

          // else, concat buffer
          buffer = this.concatBytes(
            buffer,
            new Uint8Array(res.buffer.slice(UUID_Length))
          );
        } else {
          // uuid mismatch
          throw "Error: Communication was interrupted.";
        }
      }
    },
    concatBytes(a, b) {
      return new Uint8Array([...a, ...b]);
    },
  },
};
</script>
