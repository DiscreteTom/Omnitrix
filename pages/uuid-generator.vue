<template>
  <div>
    <v-card
      @click="$copyText(nil).then(() => $bus.$emit('append-msg', 'Copied'))"
      class="mb-3"
    >
      <v-card-title> NIL </v-card-title>
      <v-card-subtitle> All zeros </v-card-subtitle>
      <v-card-text>
        <v-text-field
          v-model="nil"
          disabled
          outlined
          hide-details
          dense
          class="mr-3"
          label="UUID NIL"
        />
      </v-card-text>
    </v-card>
    <v-card
      @click="$copyText(v1txt).then(() => $bus.$emit('append-msg', 'Copied'))"
      class="mb-3"
    >
      <v-card-title> UUID v1 </v-card-title>
      <v-card-subtitle> Timestamp </v-card-subtitle>
      <v-card-text class="d-flex align-center">
        <v-text-field
          v-model="v1txt"
          disabled
          outlined
          hide-details
          dense
          class="mr-3"
          label="UUID v1"
        />
        <v-btn icon @click.stop="getV1">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card
      @click="$copyText(v3txt).then(() => $bus.$emit('append-msg', 'Copied'))"
      class="mb-3"
    >
      <v-card-title> UUID v3 </v-card-title>
      <v-card-subtitle> MD5 </v-card-subtitle>
      <v-card-text>
        <v-text-field
          v-model="v3namespace"
          outlined
          hide-details
          dense
          class="mb-3"
          label="Namespace"
          @click.stop
          @input="getV3"
          :rules="[(value) => validate(value)]"
        />
        <v-text-field
          v-model="v3name"
          outlined
          hide-details
          dense
          class="mb-3"
          label="Name"
          @click.stop
          @input="getV3"
        />
        <v-text-field
          v-model="v3txt"
          disabled
          outlined
          hide-details
          dense
          label="UUID v3"
        />
      </v-card-text>
    </v-card>
    <v-card
      @click="$copyText(v4txt).then(() => $bus.$emit('append-msg', 'Copied'))"
      class="mb-3"
    >
      <v-card-title> UUID v4 </v-card-title>
      <v-card-subtitle> Random </v-card-subtitle>
      <v-card-text class="d-flex align-center">
        <v-text-field
          v-model="v4txt"
          disabled
          outlined
          hide-details
          dense
          class="mr-3"
          label="UUID v4"
        />
        <v-btn icon @click.stop="getV4">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card
      @click="$copyText(v5txt).then(() => $bus.$emit('append-msg', 'Copied'))"
      class="mb-3"
    >
      <v-card-title> UUID v5 </v-card-title>
      <v-card-subtitle> SHA1 </v-card-subtitle>
      <v-card-text>
        <v-text-field
          v-model="v5namespace"
          outlined
          hide-details
          dense
          class="mb-3"
          label="Namespace"
          @click.stop
          @input="getV5"
          :rules="[(value) => validate(value)]"
        />
        <v-text-field
          v-model="v5name"
          outlined
          hide-details
          dense
          class="mb-3"
          label="Name"
          @click.stop
          @input="getV5"
        />
        <v-text-field
          v-model="v5txt"
          disabled
          outlined
          hide-details
          dense
          label="UUID v5"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import * as uuid from "uuid";

export default {
  data() {
    return {
      nil: "",
      v1txt: "",
      v3name: "",
      v3namespace: uuid.NIL,
      v3txt: "",
      v4txt: "",
      v5name: "",
      v5namespace: uuid.NIL,
      v5txt: "",
      validate: uuid.validate,
    };
  },
  methods: {
    getV1() {
      this.v1txt = uuid.v1();
    },
    getV3() {
      try {
        this.v3txt = uuid.v3(this.v3name, this.v3namespace);
      } catch (e) {
        this.v3txt = e;
      }
    },
    getV4() {
      this.v4txt = uuid.v4();
    },
    getV5() {
      try {
        this.v5txt = uuid.v5(this.v5name, this.v5namespace);
      } catch (e) {
        this.v5txt = e;
      }
    },
    getNil() {
      this.nil = uuid.NIL;
    },
  },
  mounted() {
    this.getV1();
    this.getV3();
    this.getV4();
    this.getV5();
    this.getNil();
  },
};
</script>
