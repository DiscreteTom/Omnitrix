<template>
  <div>
    <div class="d-flex my-3">
      <v-text-field
        class="mr-3"
        v-model="left"
        label="IP/CIDR"
        outlined
        dense
        hide-details
        @input="update"
      />
      <v-text-field
        v-model="right"
        label="Another IP/CIDR"
        outlined
        dense
        hide-details
        @input="update"
      />
    </div>

    <v-card>
      <v-card-title> Result </v-card-title>
      <v-card-text>
        {{ result }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import IPCIDR from "ip-cidr";

export default {
  data() {
    return {
      left: "172.31.0.0/16",
      right: "172.31.0.1",
      result: "",
    };
  },
  methods: {
    update() {
      if (this.left.includes("/")) {
        if (this.right.includes("/")) {
          this.bothCidr();
        } else {
          this.oneCidrOneIp(this.right, this.left);
        }
      } else {
        if (this.right.includes("/")) {
          this.oneCidrOneIp(this.left, this.right);
        } else {
          this.bothIp();
        }
      }
    },
    bothCidr() {
      // calculate overlap

      let leftCidr, rightCidr;
      try {
        leftCidr = new IPCIDR(this.left);
        rightCidr = new IPCIDR(this.right);
      } catch {
        this.result = `Invalid input.`;
        return;
      }

      if (
        leftCidr.start({ type: "bigInteger" }) <=
          rightCidr.end({ type: "bigInteger" }) &&
        leftCidr.end({ type: "bigInteger" }) >=
          rightCidr.start({ type: "bigInteger" })
      ) {
        this.result = `CIDR overlapped.`;
      } else {
        this.result = `CIDR NOT overlapped.`;
      }
    },
    bothIp() {
      this.result = `Please input at least one CIDR.`;
      return;
      // if (
      //   !IPCIDR.isValidAddress(this.left) ||
      //   !IPCIDR.isValidAddress(this.right)
      // ) {
      //   this.result = `Invalid input.`;
      //   return;
      // }
    },
    oneCidrOneIp(ip, cidr) {
      // calculate whether cidr contains ip

      if (!IPCIDR.isValidAddress(ip)) {
        this.result = `Invalid input.`;
        return;
      }

      let cidrObj;
      try {
        cidrObj = new IPCIDR(cidr);
      } catch {
        this.result = `Invalid input.`;
        return;
      }

      if (cidrObj.contains(ip)) {
        this.result = `CIDR ${cidr} contains IP ${ip}.`;
      } else {
        this.result = `CIDR ${cidr} does NOT contain IP ${ip}.`;
      }
    },
  },
  mounted() {
    this.update();
  },
};
</script>
