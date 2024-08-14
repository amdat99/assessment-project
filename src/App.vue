<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App",
});
</script>

<template>
  <div
    id="app"
    class="container-fluid d-flex flex-column justify-content-center align-items-center py-4"
  >
    <div class="row w-100">
      <div class="col-12 col-md-8 col-lg-6 mx-auto">
        <router-view :key="$route.path" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-fluid {
  min-height: 100vh;
  box-sizing: border-box;
}
</style>
