import Vue from "vue";
const bus = new Vue();

export default (context, inject) => {
  inject("bus", bus);
};
