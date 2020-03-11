<template>
  <div id="app">
    <Loading />
    <Navigation />
    <GeneralFilters />
    <StateBased />
    <PlanBased />
  </div>
</template>

<script>
import Navigation from "./components/Navigation.vue";
import StateBased from "./components/StateBased.vue";
import PlanBased from "./components/PlanBased.vue";
import Loading from "./components/Loading.vue";
import GeneralFilters from "./components/GeneralFilters.vue";

export default {
  name: "App",
  components: {
    Navigation,
    StateBased,
    GeneralFilters,
    PlanBased,
    Loading
  },
  data() {
    return {
      selectedStateFromMap: null
    };
  },
  mounted() {
    this.$store.dispatch("getAllHealthInsuranceQualityData");
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=PT+Sans&display=swap");

:root {
  --primary-grey: #fafbfb;
  --grey-blue: #4f5d67;
  --secondary-grey: #f0f3f4;
  --stoke-grey: #cacaca;
  --contrast-grey: #8d8d8d;
  --theme-blue: #3078b5;
  --optional-blue: #2b5c8a;
  --light-grey: #f4f7fa;
  --hover-grey: #4b555b;
}

body {
  min-width: 1200px;
}

#app {
  background-color: var(--primary-grey);
  margin: 0;
  font-family: "PT Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.highcharts-container {
  position: initial !important;
  z-index: auto !important;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
</style>
