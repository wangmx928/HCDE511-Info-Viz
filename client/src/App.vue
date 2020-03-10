<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
    <Loading />
    <GeneralFilters
      v-bind:insuranceQualities="insuranceQualities"
      v-bind:selectedStateFromMap="selectedStateFromMap"
      defaultOptions="defaultFilterOptions"
      ref="GeneralFilters"
      :key="filterComponentKey"
    />
    <b-button variant="outline-primary" v-on:click="resetFilters" style>Reset All</b-button>

    <Navigation />

    <StateBased
      v-bind:insuranceQualities="insuranceQualities"
      v-bind:selectedStateFromMap.sync="selectedStateFromMap"
    />

    <!-- <PlanBased v-bind:filtersGroup="filtersGroup" /> -->
  </div>
</template>

<script>
import { endpoints } from "./constants.js";
import axios from "axios";
import Navigation from "./components/Navigation.vue";
import StateBased from "./components/StateBased.vue";
// import PlanBased from "./components/PlanBased.vue";
import Loading from "./components/Loading.vue";
import GeneralFilters from "./components/GeneralFilters.vue";

export default {
  name: "App",
  components: {
    Navigation,
    StateBased,
    GeneralFilters,
    // PlanBased,
    Loading
  },
  data() {
    return {
      insuranceQualities: [{}],
      filterComponentKey: 0,
      selectedStateFromMap: null
    };
  },
  computed: {
    count() {
      return this.$store.state.count;
    }
  },
  methods: {
    resetFilters() {
      this.filterComponentKey += 1;
      console.log("reset Filters", this.filterComponentKey);
    },
    async getAllHealthInsuranceQuality() {
      try {
        const res = await axios.post(endpoints.insuranceQuality, {
          crossDomain: true,
          query: `{
                      InsuranceQuality {
                        State
                        USNewsRank
                        WalletHubCompositeScore
                      }
                    }`
        });
        this.insuranceQualities = res.data.data.InsuranceQuality;
      } catch (e) {
        console.log("err", e);
      }
    }
  },
  mounted() {
    this.getAllHealthInsuranceQuality();
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
}

#app {
  background-color: var(--primary-grey);
  margin: 0;
  min-width: 1200px;
  font-family: "PT Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}
</style>
