<template>
  <div v-if="isLoading" id="loadingPlaceholder">
    <b-spinner label="Loading..."></b-spinner>
    <div v-for="comp in currentLoadingComponent" :key="comp">
      <p>{{comp}} is trying hard to load</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  computed: {
    isLoading() {
      return this.$store.getters.isPageLoading;
    },
    currentLoadingComponent() {
      return this.$store.getters.currentLoadingComponent;
    }
  }
};
</script>

<style scoped>
#loadingPlaceholder {
  height: 100vh;
  width: 100vw;
  color: var(--theme-blue);
  z-index: 10;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #ffffff80;
}

#loadingPlaceholder span {
  margin: auto;
}
</style>