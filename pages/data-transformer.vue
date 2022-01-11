<template>
  <div>
    <code-transform
      :leftChoices="languages"
      :leftValue="leftLang"
      :leftLang="leftLang"
      @left-change="leftLang = $event"
      :rightChoices="languages"
      :rightValue="rightLang"
      :rightLang="rightLang"
      @right-change="rightLang = $event"
      :transformer="transformer"
    />
  </div>
</template>

<script>
import CodeTransform from "../components/code-transform.vue";
import yaml from "js-yaml";

export default {
  components: { CodeTransform },
  data() {
    return {
      leftLang: "json",
      rightLang: "yaml",
      languages: ["json", "yaml", "javascript"],
    };
  },
  methods: {
    transformer(leftTxt) {
      if (leftTxt.length === 0) {
        return "";
      }

      try {
        let input;
        switch (this.leftLang) {
          case "json":
            input = JSON.parse(leftTxt);
            break;
          case "yaml":
            input = yaml.load(leftTxt);
            break;
          case "javascript":
            input = eval(`(${leftTxt})`);
            break;
        }

        switch (this.rightLang) {
          case "json":
          case "javascript":
            return JSON.stringify(input, null, 2);
          case "yaml":
            return yaml.dump(input);
        }
      } catch (e) {
        return e.toString();
      }
    },
  },
};
</script>
