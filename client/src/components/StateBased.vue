<template>
  <div id="state-based-view">
    <div class="state-info-section">
      <div class="state-title">
        <img alt="State-based View Icon" src="../assets/state.png" />
        <div>STATE-BASED</div>
      </div>

      <div class="state-info">
        <b-icon icon="info" font-scale="1"></b-icon>
        <div>Hover/click to see more information.</div>
      </div>
    </div>

    <div id="state-map">
      <div v-b-visible="handleStatsVisibility" class="stats-badge vertical">
        <StatsCard title="State" v-bind:value="highlightedState.State" type="State" />
        <StatsCard
          title="US News Rank"
          v-bind:value="`#${highlightedState.USNewsRank}`"
          v-bind:toolTip="stateWithHighestRank"
          type="USNewsRank"
        />
        <StatsCard
          title="Composite Score"
          v-bind:value="highlightedState.WalletHubCompositeScore"
          v-bind:toolTip="stateWithHighestCompScore"
          type="WalletHubCompositeScore"
        />
        <StatsCard
          title="Avg Monthly Price"
          v-bind:value="`$${highlightedState.AverageMonthlyPrice}`"
          type="AvgMonthlyPrice"
        />
      </div>
      <div v-if="showErrorMessage">Error, please refresh the page...</div>
      <div id="tile-map"></div>
    </div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import { stateGeoLocations, stateNameToCode } from "../constants.js";
import StatsCard from "./StatsCard.vue";

// Load module after Highcharts is loaded
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/heatmap")(Highcharts);
require("highcharts/modules/tilemap")(Highcharts);

export default {
  name: "StateBased",
  components: { StatsCard },
  props: [],
  data() {
    return {
      tileMapChart: null,
      showFixedCollapsedStats: false,
      showErrorMessage: false,
      highlightedState: {
        State: "-",
        USNewsRank: "-",
        WalletHubCompositeScore: "-",
        AverageMonthlyPrice: "-"
      }
    };
  },
  computed: {
    averageStatePremium() {
      return this.$store.state.averageStatePremium;
    },
    insuranceQualities() {
      return this.$store.state.insuranceQualities;
    },
    selectedStateFilterName() {
      return this.$store.state.selectedFilters.state.name;
    },
    stateWithHighestCompScore() {
      return this._.maxBy(this.insuranceQualities, "WalletHubCompositeScore");
    },
    stateWithHighestRank() {
      return this._.minBy(this.insuranceQualities, "USNewsRank");
    }
  },
  methods: {
    handleStatsVisibility(isVisible) {
      this.showFixedCollapsedStats = !isVisible;
    },
    getSeriesData(rawData) {
      let avgPriceRange = this.$store.state.avgPriceRange;
      console.log(">> rawData", rawData);
      console.log(">> avgPriceRange", avgPriceRange);
      return [
        {
          name: "AverageMonthlyRatePerState",
          min: avgPriceRange.min,
          max: avgPriceRange.max,
          cursor: "pointer",
          events: {
            click: event => {
              //TODO: Work on the greying out effect

              if (rawData[stateNameToCode[event.point.name]]) {
                this.highlightedState = this._.find(
                  this.insuranceQualities,
                  o => {
                    return o.State == event.point.name;
                  }
                );
                this.highlightedState.AverageMonthlyPrice = event.point.value;
                this.$store.dispatch("updateContentBySelectedFilter", {
                  newVal: this.highlightedState.State,
                  filterType: "state",
                  type: "name"
                });
              } else {
                console.log(
                  "No data for the clicked state: ",
                  event.point.name
                );
              }
            }
          },
          data: stateGeoLocations.map(point => {
            if (rawData[point.stateCode]) {
              if (point.value == "AK") {
                console.log("???rawData", point);
              }
              point.value = rawData[point.stateCode];
              point.color = null;
            } else {
              if (point.value == "AK") {
                console.log("wwwwwww");
                console.log(point);
              }
              console.log(point);
              point.value = null;
              point.color = "#4f5d6750";
              point.dataLabels = {
                color: "#FFFFFF",
                text: null
              };
            }
            return point;
          })
        }
      ];
    },
    getTileMapOptions(seriesData) {
      return {
        chart: {
          type: "tilemap",
          inverted: true,
          width: "800",
          height: "550"
        },
        title: {
          text: "Average Monthly Premium Rate Per State in U.S. 2020"
        },
        subtitle: {
          text:
            "Average Monthly Premium Rate. Can have link Source:<a href='https://simple.wikipedia.org/wiki/List_of_U.S._states_by_population'>Wikipedia</a>"
        },
        xAxis: {
          visible: false
        },
        yAxis: {
          visible: false
        },
        colorAxis: {
          min: seriesData.min,
          max: seriesData.max,
          minColor: "#C7D8E8",
          maxColor: "#005BB0"
        },
        tooltip: {
          formatter: function() {
            if (this.point.value) {
              return `Average cost of health insurance in <b> ${this.point.name} </b> is <b>${this.point.value}</b>`;
            } else {
              return "Value is not available.";
            }
          }
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                if (this.point.value) {
                  return `${this.point.stateCode}<br/>$${this.point.value}`;
                } else {
                  return `${this.point.stateCode}`;
                }
              },
              color: "#000000",
              align: "left",
              style: { textOutline: false, textAnchor: "middle" }
            },
            states: {
              hover: {
                halo: true
              }
            }
          }
        },
        legend: {
          layout: "vertical",
          align: "right",
          padding: 0,
          y: -20
        },
        series: seriesData,
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  align: "center",
                  verticalAlign: "bottom",
                  layout: "horizontal"
                }
              }
            }
          ]
        }
      };
    },
    generateTileMap(chartOptions) {
      if (!this.tileMapChart) {
        this.tileMapChart = Highcharts.chart("tile-map", chartOptions);
      } else {
        this.tileMapChart.update(chartOptions);
      }
      // Last Step on this page
      this.$store.commit("stateBasedViewIsLoading", false);
      return;
    }
  },
  mounted() {
    this.$store.dispatch("updateStateMapWithType", "averageStatePremium");
  },
  watch: {
    averageStatePremium(newVal) {
      if (this.$store.state.currentStateMapType != "averageStatePremium") {
        return;
      }
      this.$store.commit("stateBasedViewIsLoading", true);

      let seriesData = this.getSeriesData(newVal);
      let chartOptions = this.getTileMapOptions(seriesData);

      if (!this.tileMapChart) {
        console.log("> chartOptions", chartOptions);
        this.tileMapChart = Highcharts.chart("tile-map", chartOptions);
      } else {
        console.log("> has tilemap", chartOptions);
        this.tileMapChart.update(chartOptions);
      }

      this.$store.commit("stateBasedViewIsLoading", false);
    },
    selectedStateFilterName(newVal) {
      if (!newVal) {
        this.highlightedState = {
          State: "-",
          USNewsRank: "-",
          WalletHubCompositeScore: "-",
          AverageMonthlyPrice: "-"
        };
      } else {
        this.highlightedState = this._.find(this.insuranceQualities, o => {
          return o.State == newVal;
        });
      }
    }
  }
};
</script>

<style>
#state-based-view {
  padding-top: 270px;
}

#state-map {
  width: 95vw;
  margin: auto;
  display: inline-flex;
  justify-content: space-evenly;
}

.state-info-section {
  display: inline-flex;
  align-items: center;
}

.state-title {
  display: inline-flex;
  margin-left: 75px;
}

.state-title img {
  width: 47px;
  height: 32px;
  display: inline-table;
  margin: auto;
}

.state-title div {
  color: var(--optional-blue);
  font-size: 20px;
  font-weight: bold;
  margin-left: 5px;
  display: inline-table;
}

.state-info {
  color: var(--hover-grey);
  font-size: 14px;
  margin-left: 24px;
}

.state-info {
  display: inline-flex;
}

.state-info .b-icon.bi {
  margin: auto;
}

.stats-badge {
  display: flex;
  justify-content: space-evenly;
}

.vertical {
  flex-flow: column;
  display: inline-flex;
  margin: 50px 0;
}

.vertical .stats-card {
  width: 150px;
}

.vertical .content {
  margin: auto;
  margin-bottom: 0;
  padding: 15px;
}

#tile-map {
  display: flex;
  justify-content: center;
  border-radius: 20px;
}

.floated-stats {
  position: fixed;
  top: 20vh;
  left: 20px;
  flex-flow: column;
  display: inline-flex;
}

.floated-stats .stats-card {
  width: 100px;
  margin: 10px;
}

.floated-stats .stats-card .content {
  margin: auto;
  padding: 5px;
}

.floated-stats .stats-card .title {
  font-size: 14px;
}

.floated-stats .stats-card .description {
  font-size: 16px;
}

@media screen and (min-width: 480px) {
}
</style>


<!--
<transition name="fade">
  <div v-if="showFixedCollapsedStats && highlightedState.State != '-'" class="floated-stats">
    <StatsCard v-bind:value="highlightedState.State" noIcon="true" />
    <StatsCard
      v-bind:value="`#${highlightedState.USNewsRank}`"
      type="USNewsRank"
      noIcon="true"
    />
    <StatsCard
      v-bind:value="highlightedState.WalletHubCompositeScore"
      type="WalletHubCompositeScore"
    />
    <StatsCard v-bind:value="`$${highlightedState.AverageMonthlyPrice}`" />
  </div>
</transition>-->