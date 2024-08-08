<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "SubmitComponent",
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit("submit");
    },
  },
});
</script>

<template>
  <b-button type="submit" @click="handleClick">{{ text }}</b-button>
</template>
