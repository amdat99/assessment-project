<script>
export default {
  name: "ErrorPage",
  props: {
    errorMessage: {
      type: String,
      default: "An unknown error occurred",
    },
  },
};
</script>

<template>
  <div>
    <h1>Error</h1>
    <p>{{ errorMessage }}</p>
    <router-link to="/">Go to Home</router-link>
  </div>
</template>
