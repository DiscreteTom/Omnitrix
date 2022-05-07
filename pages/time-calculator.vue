<template>
  <div>
    <!-- form -->
    <div class="mx-2">
      <v-switch v-model="live" label="Live" inset class="mt-0 mx-2" />

      <!-- live -->
      <div v-if="live" class="d-flex mb-3">
        <v-text-field
          type="number"
          label="Refresh Interval (ms)"
          v-model="intervalMs"
          outlined
          dense
          hide-details
          class="mr-3"
        />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn icon @click="resetTimer" v-on="on">
              <v-icon> mdi-check </v-icon>
            </v-btn>
          </template>
          <span>Apply Interval</span>
        </v-tooltip>
      </div>

      <!-- manual -->
      <div v-else class="d-flex mb-3">
        <v-row no-gutters>
          <v-col :cols="$vuetify.breakpoint.smAndUp ? 4 : 12">
            <v-select
              label="From"
              :items="formats"
              outlined
              dense
              hide-details
              v-model="fromFormat"
              :class="$vuetify.breakpoint.smAndUp ? 'mr-3' : 'mb-3'"
            />
          </v-col>
          <v-col :cols="$vuetify.breakpoint.smAndUp ? 8 : 12" class="d-flex">
            <v-text-field
              label="Value"
              v-model="fromValue"
              outlined
              dense
              hide-details
              :class="$vuetify.breakpoint.smAndUp ? 'mr-3' : 'mb-3 mr-3'"
              @keydown.enter="calculate"
              @input="calculate"
            />
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click="calculate">
                  <v-icon> mdi-check </v-icon>
                </v-btn>
              </template>
              <span> Calculate </span>
            </v-tooltip>
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- cards -->
    <div class="d-flex flex-wrap">
      <v-card
        v-for="(value, name) in result"
        :key="name"
        class="mx-2 my-2 flex-grow-1"
        hover
        @click="$copyText(value).then(() => $bus.$emit('append-msg', 'Copied'))"
      >
        <v-card-title>
          {{ name }}
        </v-card-title>
        <v-card-text>
          {{ value }}
        </v-card-text>
      </v-card>

      <v-card
        v-for="(item, i) in custom"
        :key="i"
        class="mx-2 my-2 flex-grow-1"
        hover
        @click="
          $copyText(item.txt).then(() => $bus.$emit('append-msg', 'Copied'))
        "
      >
        <v-card-title @click.stop @mousedown.stop>
          <v-combobox
            v-model="item.tz"
            :items="timezones"
            label="Timezone"
            outlined
            dense
            hide-details
            class="mr-3"
          />
          <v-btn icon @click.stop="custom.splice(i, 1)">
            <v-icon> mdi-close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          {{ item.txt }}
        </v-card-text>
      </v-card>
      <v-card
        class="mx-2 my-2 flex-grow-1 d-flex align-center justify-center"
        hover
        @click="
          custom.push({ tz: timezones[0] });
          update();
        "
      >
        <v-icon> mdi-plus </v-icon>
        <v-card-subtitle> Custom Timezone </v-card-subtitle>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      live: true,
      intervalMs: 1000,
      timer: null,

      result: {
        UTC: "",
        "Timestamp (ms)": "",
        ISO: "",
        Locale: "",
        Literal: "",
      },

      fromValue: "",
      fromFormat: "Timestamp (ms)",
      formats: ["Timestamp (ms)", "ISO", "UTC", "Locale", "Literal"],
      timezones: [
        // https://stackoverflow.com/questions/38399465/how-to-get-list-of-all-timezones-in-javascript
        "Europe/Andorra",
        "Asia/Dubai",
        "Asia/Kabul",
        "Europe/Tirane",
        "Asia/Yerevan",
        "Antarctica/Casey",
        "Antarctica/Davis",
        "Antarctica/DumontDUrville", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
        "Antarctica/Mawson",
        "Antarctica/Palmer",
        "Antarctica/Rothera",
        "Antarctica/Syowa",
        "Antarctica/Troll",
        "Antarctica/Vostok",
        "America/Argentina/Buenos_Aires",
        "America/Argentina/Cordoba",
        "America/Argentina/Salta",
        "America/Argentina/Jujuy",
        "America/Argentina/Tucuman",
        "America/Argentina/Catamarca",
        "America/Argentina/La_Rioja",
        "America/Argentina/San_Juan",
        "America/Argentina/Mendoza",
        "America/Argentina/San_Luis",
        "America/Argentina/Rio_Gallegos",
        "America/Argentina/Ushuaia",
        "Pacific/Pago_Pago",
        "Europe/Vienna",
        "Australia/Lord_Howe",
        "Antarctica/Macquarie",
        "Australia/Hobart",
        "Australia/Currie",
        "Australia/Melbourne",
        "Australia/Sydney",
        "Australia/Broken_Hill",
        "Australia/Brisbane",
        "Australia/Lindeman",
        "Australia/Adelaide",
        "Australia/Darwin",
        "Australia/Perth",
        "Australia/Eucla",
        "Asia/Baku",
        "America/Barbados",
        "Asia/Dhaka",
        "Europe/Brussels",
        "Europe/Sofia",
        "Atlantic/Bermuda",
        "Asia/Brunei",
        "America/La_Paz",
        "America/Noronha",
        "America/Belem",
        "America/Fortaleza",
        "America/Recife",
        "America/Araguaina",
        "America/Maceio",
        "America/Bahia",
        "America/Sao_Paulo",
        "America/Campo_Grande",
        "America/Cuiaba",
        "America/Santarem",
        "America/Porto_Velho",
        "America/Boa_Vista",
        "America/Manaus",
        "America/Eirunepe",
        "America/Rio_Branco",
        "America/Nassau",
        "Asia/Thimphu",
        "Europe/Minsk",
        "America/Belize",
        "America/St_Johns",
        "America/Halifax",
        "America/Glace_Bay",
        "America/Moncton",
        "America/Goose_Bay",
        "America/Blanc-Sablon",
        "America/Toronto",
        "America/Nipigon",
        "America/Thunder_Bay",
        "America/Iqaluit",
        "America/Pangnirtung",
        "America/Atikokan",
        "America/Winnipeg",
        "America/Rainy_River",
        "America/Resolute",
        "America/Rankin_Inlet",
        "America/Regina",
        "America/Swift_Current",
        "America/Edmonton",
        "America/Cambridge_Bay",
        "America/Yellowknife",
        "America/Inuvik",
        "America/Creston",
        "America/Dawson_Creek",
        "America/Fort_Nelson",
        "America/Vancouver",
        "America/Whitehorse",
        "America/Dawson",
        "Indian/Cocos",
        "Europe/Zurich",
        "Africa/Abidjan",
        "Pacific/Rarotonga",
        "America/Santiago",
        "America/Punta_Arenas",
        "Pacific/Easter",
        "Asia/Shanghai",
        "Asia/Urumqi",
        "America/Bogota",
        "America/Costa_Rica",
        "America/Havana",
        "Atlantic/Cape_Verde",
        "America/Curacao",
        "Indian/Christmas",
        "Asia/Nicosia",
        "Asia/Famagusta",
        "Europe/Prague",
        "Europe/Berlin",
        "Europe/Copenhagen",
        "America/Santo_Domingo",
        "Africa/Algiers",
        "America/Guayaquil",
        "Pacific/Galapagos",
        "Europe/Tallinn",
        "Africa/Cairo",
        "Africa/El_Aaiun",
        "Europe/Madrid",
        "Africa/Ceuta",
        "Atlantic/Canary",
        "Europe/Helsinki",
        "Pacific/Fiji",
        "Atlantic/Stanley",
        "Pacific/Chuuk",
        "Pacific/Pohnpei",
        "Pacific/Kosrae",
        "Atlantic/Faroe",
        "Europe/Paris",
        "Europe/London",
        "Asia/Tbilisi",
        "America/Cayenne",
        "Africa/Accra",
        "Europe/Gibraltar",
        "America/Godthab",
        "America/Danmarkshavn",
        "America/Scoresbysund",
        "America/Thule",
        "Europe/Athens",
        "Atlantic/South_Georgia",
        "America/Guatemala",
        "Pacific/Guam",
        "Africa/Bissau",
        "America/Guyana",
        "Asia/Hong_Kong",
        "America/Tegucigalpa",
        "America/Port-au-Prince",
        "Europe/Budapest",
        "Asia/Jakarta",
        "Asia/Pontianak",
        "Asia/Makassar",
        "Asia/Jayapura",
        "Europe/Dublin",
        "Asia/Jerusalem",
        "Asia/Kolkata",
        "Indian/Chagos",
        "Asia/Baghdad",
        "Asia/Tehran",
        "Atlantic/Reykjavik",
        "Europe/Rome",
        "America/Jamaica",
        "Asia/Amman",
        "Asia/Tokyo",
        "Africa/Nairobi",
        "Asia/Bishkek",
        "Pacific/Tarawa",
        "Pacific/Enderbury",
        "Pacific/Kiritimati",
        "Asia/Pyongyang",
        "Asia/Seoul",
        "Asia/Almaty",
        "Asia/Qyzylorda",
        "Asia/Qostanay", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
        "Asia/Aqtobe",
        "Asia/Aqtau",
        "Asia/Atyrau",
        "Asia/Oral",
        "Asia/Beirut",
        "Asia/Colombo",
        "Africa/Monrovia",
        "Europe/Vilnius",
        "Europe/Luxembourg",
        "Europe/Riga",
        "Africa/Tripoli",
        "Africa/Casablanca",
        "Europe/Monaco",
        "Europe/Chisinau",
        "Pacific/Majuro",
        "Pacific/Kwajalein",
        "Asia/Yangon",
        "Asia/Ulaanbaatar",
        "Asia/Hovd",
        "Asia/Choibalsan",
        "Asia/Macau",
        "America/Martinique",
        "Europe/Malta",
        "Indian/Mauritius",
        "Indian/Maldives",
        "America/Mexico_City",
        "America/Cancun",
        "America/Merida",
        "America/Monterrey",
        "America/Matamoros",
        "America/Mazatlan",
        "America/Chihuahua",
        "America/Ojinaga",
        "America/Hermosillo",
        "America/Tijuana",
        "America/Bahia_Banderas",
        "Asia/Kuala_Lumpur",
        "Asia/Kuching",
        "Africa/Maputo",
        "Africa/Windhoek",
        "Pacific/Noumea",
        "Pacific/Norfolk",
        "Africa/Lagos",
        "America/Managua",
        "Europe/Amsterdam",
        "Europe/Oslo",
        "Asia/Kathmandu",
        "Pacific/Nauru",
        "Pacific/Niue",
        "Pacific/Auckland",
        "Pacific/Chatham",
        "America/Panama",
        "America/Lima",
        "Pacific/Tahiti",
        "Pacific/Marquesas",
        "Pacific/Gambier",
        "Pacific/Port_Moresby",
        "Pacific/Bougainville",
        "Asia/Manila",
        "Asia/Karachi",
        "Europe/Warsaw",
        "America/Miquelon",
        "Pacific/Pitcairn",
        "America/Puerto_Rico",
        "Asia/Gaza",
        "Asia/Hebron",
        "Europe/Lisbon",
        "Atlantic/Madeira",
        "Atlantic/Azores",
        "Pacific/Palau",
        "America/Asuncion",
        "Asia/Qatar",
        "Indian/Reunion",
        "Europe/Bucharest",
        "Europe/Belgrade",
        "Europe/Kaliningrad",
        "Europe/Moscow",
        "Europe/Simferopol",
        "Europe/Kirov",
        "Europe/Astrakhan",
        "Europe/Volgograd",
        "Europe/Saratov",
        "Europe/Ulyanovsk",
        "Europe/Samara",
        "Asia/Yekaterinburg",
        "Asia/Omsk",
        "Asia/Novosibirsk",
        "Asia/Barnaul",
        "Asia/Tomsk",
        "Asia/Novokuznetsk",
        "Asia/Krasnoyarsk",
        "Asia/Irkutsk",
        "Asia/Chita",
        "Asia/Yakutsk",
        "Asia/Khandyga",
        "Asia/Vladivostok",
        "Asia/Ust-Nera",
        "Asia/Magadan",
        "Asia/Sakhalin",
        "Asia/Srednekolymsk",
        "Asia/Kamchatka",
        "Asia/Anadyr",
        "Asia/Riyadh",
        "Pacific/Guadalcanal",
        "Indian/Mahe",
        "Africa/Khartoum",
        "Europe/Stockholm",
        "Asia/Singapore",
        "America/Paramaribo",
        "Africa/Juba",
        "Africa/Sao_Tome",
        "America/El_Salvador",
        "Asia/Damascus",
        "America/Grand_Turk",
        "Africa/Ndjamena",
        "Indian/Kerguelen",
        "Asia/Bangkok",
        "Asia/Dushanbe",
        "Pacific/Fakaofo",
        "Asia/Dili",
        "Asia/Ashgabat",
        "Africa/Tunis",
        "Pacific/Tongatapu",
        "Europe/Istanbul",
        "America/Port_of_Spain",
        "Pacific/Funafuti",
        "Asia/Taipei",
        "Europe/Kiev",
        "Europe/Uzhgorod",
        "Europe/Zaporozhye",
        "Pacific/Wake",
        "America/New_York",
        "America/Detroit",
        "America/Kentucky/Louisville",
        "America/Kentucky/Monticello",
        "America/Indiana/Indianapolis",
        "America/Indiana/Vincennes",
        "America/Indiana/Winamac",
        "America/Indiana/Marengo",
        "America/Indiana/Petersburg",
        "America/Indiana/Vevay",
        "America/Chicago",
        "America/Indiana/Tell_City",
        "America/Indiana/Knox",
        "America/Menominee",
        "America/North_Dakota/Center",
        "America/North_Dakota/New_Salem",
        "America/North_Dakota/Beulah",
        "America/Denver",
        "America/Boise",
        "America/Phoenix",
        "America/Los_Angeles",
        "America/Anchorage",
        "America/Juneau",
        "America/Sitka",
        "America/Metlakatla",
        "America/Yakutat",
        "America/Nome",
        "America/Adak",
        "Pacific/Honolulu",
        "America/Montevideo",
        "Asia/Samarkand",
        "Asia/Tashkent",
        "America/Caracas",
        "Asia/Ho_Chi_Minh",
        "Pacific/Efate",
        "Pacific/Wallis",
        "Pacific/Apia",
        "Africa/Johannesburg",
      ],
      custom: [], // {tz: '', txt: ''}
    };
  },
  methods: {
    update(date) {
      if (date === undefined || date == null) date = new Date();
      this.result.UTC = date.toUTCString();
      this.result.ISO = date.toISOString();
      this.result.Locale = date.toLocaleString();
      this.result.Literal = date.toString();
      this.result["Timestamp (ms)"] = date.getTime();
      this.custom.map((e) => {
        if (this.timezones.includes(e.tz))
          e.txt = date.toLocaleString(navigator.language, { timeZone: e.tz });
      });
    },
    applyTimer() {
      this.timer = setInterval(() => this.update(), this.intervalMs);
      this.update();
    },
    clearTimer() {
      if (this.timer !== null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    resetTimer() {
      this.clearTimer();
      this.applyTimer();
    },
    calculate() {
      let date;
      switch (this.fromFormat) {
        case "Timestamp (ms)":
          date = new Date(parseInt(this.fromValue));
          break;
        default:
          date = new Date(this.fromValue);
          break;
      }
      this.update(date);
    },
    updateFromValue() {
      this.fromValue = this.result[this.fromFormat];
    },
  },
  mounted() {
    this.applyTimer();
  },
  destroyed() {
    this.clearTimer();
  },
  watch: {
    live(val) {
      if (val) {
        this.resetTimer();
      } else {
        this.clearTimer();
        this.updateFromValue();
      }
    },
    fromFormat() {
      this.updateFromValue();
    },
  },
};
</script>
