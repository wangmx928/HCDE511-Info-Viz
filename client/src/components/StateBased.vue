<template>
  <div id="state-based-view">
    <div v-b-visible="handleStatsVisibility" class="stats-badge vertical">
      <StatsCard title="State" v-bind:value="highlightedState.State" />
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
      />
    </div>

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
    </transition>

    <div v-if="showErrorMessage">Error, please refresh the page...</div>

    <div id="tile-map"></div>
  </div>
</template>

<script>
import axios from "axios";
import Highcharts from "highcharts";
import { endpoints, stateGeoLocations, stateCodeToName } from "../constants.js";
import StatsCard from "./StatsCard.vue";

// Load module after Highcharts is loaded
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/heatmap")(Highcharts);
require("highcharts/modules/tilemap")(Highcharts);

export default {
  name: "StateBased",
  components: { StatsCard },
  props: ["insuranceQualities", "filtersGroup", "selectedStateFromMap"],
  data() {
    return {
      AvgStatePremium: [{}],
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
    async getAvgMonthlyPremiumByParams() {
      try {
        const res = await axios.post(endpoints.insurancePlans, {
          crossDomain: true,
          query: `query getAvgStatePremiumByParams ($Age: String, $PlanType: [String], $CoveredDiseases: [String], $IndividualRateRange: PriceRangeType) {
          AvgStatePremiumByParams ( Age: $Age, PlanType: $PlanType, CoveredDiseases: $CoveredDiseases, IndividualRateRange: $IndividualRateRange) {
            StateCode
            AvgMonthlyPremium
          }}`,
          variables: {
            Age: this.filtersGroup.Age,
            PlanType: this.filtersGroup.PlanType,
            CoveredDiseases: this.filtersGroup.CoveredDiseases,
            IndividualRateRange: this.filtersGroup.IndividualRateRange
          }
        });

        this.AvgStatePremium = res.data.data.AvgStatePremiumByParams;
        console.log("> getAvgMonthlyPremiumByParams: Has data returned");
        return;
      } catch (e) {
        console.log("err", e);
        // Should work on retry later
        this.$store.commit("stateBasedViewIsLoading", false);
        this.showErrorMessage = true;
        return;
      }
    },
    generateTileMap(seriesData) {
      let chartOptions = {
        chart: {
          type: "tilemap",
          inverted: true,
          width: "1000",
          height: "700"
        },
        title: {
          text: "US Insurance Plan Spread"
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
          minColor: "#fafbfb",
          maxColor: "#3078b5"
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
        series: seriesData
      };
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
  watch: {
    filtersGroup(newVal, oldVal) {
      this.$store.commit("stateBasedViewIsLoading", true);
      this.getAvgMonthlyPremiumByParams();

      if (newVal.StateCode != oldVal.StateCode) {
        // State changed by the filter
        this.highlightedState = this._.find(this.insuranceQualities, o => {
          return o.State == stateCodeToName[newVal.StateCode];
        });
      }
    },
    AvgStatePremium() {
      let statePriceHash = {};

      // Converting retrived data response: {${StateCode}: AvgMonthlyPremium}
      if (!this._.isEmpty(this.AvgStatePremium[0])) {
        statePriceHash = this._.reduce(
          this.AvgStatePremium,
          function(res, row) {
            res[row.StateCode] = row.AvgMonthlyPremium;
            return res;
          },
          {}
        );
      }

      let tileMapSeriesData = [
        {
          name: "AverageMonthlyRatePerState",
          min: this._.minBy(this.AvgStatePremium, "AvgMonthlyPremium"),
          max: this._.maxBy(this.AvgStatePremium, "AvgMonthlyPremium"),
          cursor: "pointer",
          events: {
            click: event => {
              //TODO: Work on the greying out effect
              this.highlightedState = this._.find(
                this.insuranceQualities,
                o => {
                  return o.State == event.point.name;
                }
              );

              if (this.highlightedState) {
                this.highlightedState.AverageMonthlyPrice = event.point.value;
                this.$emit(
                  "update:selectedStateFromMap",
                  this.highlightedState
                );
                // TODO: Add logic for updating state filters
              } else {
                console.log(
                  "could not find highlights state: ",
                  event.point.name
                );
              }
            }
          },
          data: stateGeoLocations.map(point => {
            if (statePriceHash[point.stateCode]) {
              point.value = statePriceHash[point.stateCode];
              point.color = null;
            } else {
              point.value = null;
              point.color = "#4f5d6750";
              point.dataLabels = {
                color: "#FFFFFF"
              };
            }
            return point;
          })
        }
      ];
      console.log("tileMapSeriesData: ", tileMapSeriesData);
      this.generateTileMap(tileMapSeriesData);
    }
  }
};
</script>

<style>
#state-based-view {
  width: 90vw;
  margin: auto;
  margin-top: 100px;
  display: inline-flex;
  justify-content: space-evenly;
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
</style>
