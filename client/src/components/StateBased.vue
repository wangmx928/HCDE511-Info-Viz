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
      <div class="graph-section">
        <div id="tile-map"></div>
        <div v-show="showCompScoreMap" id="comp-score-map"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from "highcharts";
import { stateGeoLocations, stateNameToCode } from "../constants.js";
import StatsCard from "./StatsCard.vue";

// Load module after Highcharts is loaded
require("highcharts/highcharts-more")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/heatmap")(Highcharts);
require("highcharts/modules/tilemap")(Highcharts);
require("highcharts/modules/dumbbell")(Highcharts);
require("highcharts/modules/lollipop")(Highcharts);

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
      },
      compScoreMap: null,
      subtitleText:
        "Data is calculated based on the states in United States, which includes all ages and coverages. <br/>Changing filters will update the average rate showing on the map.",
      showCompScoreMap: false
    };
  },
  computed: {
    stateMapSize() {
      return this.$store.state.stateMapSize;
    },
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
      return [
        {
          name: "AverageMonthlyRatePerState",
          min: avgPriceRange.min,
          max: avgPriceRange.max,
          cursor: "pointer",
          allowPointSelect: true,
          states: {
            select: {
              borderColor: "#000000",
              borderWidth: "3"
            }
          },
          events: {
            click: event => {
              if (rawData[stateNameToCode[event.point.name]]) {
                this.updateHighlightedState(event.point.name);
                this.highlightedState.AverageMonthlyPrice = event.point.value;
              } else {
                console.log(
                  "No data for the clicked state: ",
                  event.point.name
                );
                // reset selectedState
                this.updateHighlightedState(null);
              }
              this.$store.dispatch("updateContentBySelectedFilter", {
                newVal: this.highlightedState.State,
                filterType: "state",
                type: "name"
              });
            }
          },
          data: stateGeoLocations.map(point => {
            point.borderWidth = 0;
            point.selected = false;
            if (rawData[point.stateCode]) {
              point.value = rawData[point.stateCode];
              point.color = null;
              point.dataLabels = {
                color: "#000000"
              };
            } else {
              point.value = null;
              point.color = "#4f5d6750";
              point.dataLabels = {
                color: "#FFFFFF"
              };
            }
            if (point.stateCode == this.highlightedState.Code) {
              point.selected = true;
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
          width: this.$store.state.stateMapSize.width,
          height: this.$store.state.stateMapSize.height
        },
        title: {
          text: "Average Monthly Premium Rate Per State in U.S. 2020"
        },
        subtitle: {
          text: this.subtitleText
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
          title: {
            text: "Rate in US Dollar"
          },
          floating: true,
          y: 80,
          x: 130,
          layout: "horizontal",
          align: "center",
          verticalAlign: "top"
        },
        series: seriesData
      };
    },
    generateCompScoreMap() {
      let data = this.insuranceQualities.map(row => {
        return {
          name: row.Code,
          low: row.WalletHubCompositeScore
        };
      });
      data = this._.reverse(this._.sortBy(data, "low"));
      this.compScoreMap = Highcharts.chart("comp-score-map", {
        chart: {
          type: "lollipop",
          width: "800",
          height: "150"
        },
        plotOptions: {
          series: {
            states: {
              hover: {
                halo: true
              }
            }
          }
        },
        legend: {
          enabled: false
        },
        title: {
          text: "Wallet Hub Insurance Composite Score per State"
        },
        tooltip: {
          formatter: function() {
            return `Composite score for <b> ${this.point.name} </b> is <b>${this.point.low}</b>`;
          }
        },
        xAxis: {
          type: "category"
        },
        yAxis: {
          title: {
            text: "Composite Score"
          }
        },
        series: [{ data }]
      });
    },
    updateHighlightedState(newVal) {
      if (!newVal) {
        this.highlightedState = {
          State: "-",
          Code: "-",
          USNewsRank: "-",
          WalletHubCompositeScore: "-",
          AverageMonthlyPrice: "-"
        };
      } else {
        let temp = this._.find(this.insuranceQualities, o => {
          return o.State == newVal;
        });
        if (temp == undefined || this._.isEmpty(temp)) {
          return;
        }
        temp.AverageMonthlyPrice = this.averageStatePremium[
          stateNameToCode[temp.State]
        ];
        this.highlightedState.Code = stateNameToCode[temp.State];
        this.highlightedState = temp;
      }
    }
  },
  mounted() {
    this.$store.dispatch("updateStateMapWithType", "averageStatePremium");
  },
  watch: {
    stateMapSize(newVal) {
      if (this.tileMapChart && newVal.width && newVal.height) {
        let legend = null;
        if (newVal.height > 500) {
          this.tileMapChart.setTitle(null, { text: this.subtitleText }, false);
          this.showCompScoreMap = false;
          legend = {
            y: 80,
            x: 150
          };
        } else {
          this.tileMapChart.setTitle(null, { text: null }, false);
          this.showCompScoreMap = true;
          legend = {
            y: 30,
            x: 80
          };
        }
        this.tileMapChart.update({
          chart: {
            width: newVal.width,
            height: newVal.height
          },
          legend
        });
      }
    },
    // insuranceQualities(newVal) {
    //   if (newVal && newVal.length) {
    //     this.generateCompScoreMap();
    //   }
    // },
    averageStatePremium(newVal) {
      this.$store.commit("stateBasedViewIsLoading", true);

      let seriesData = this.getSeriesData(newVal);
      let chartOptions = this.getTileMapOptions(seriesData);

      if (!this.tileMapChart) {
        this.tileMapChart = Highcharts.chart("tile-map", chartOptions);
      } else {
        this.tileMapChart.update(chartOptions);
      }

      this.$store.commit("stateBasedViewIsLoading", false);
    },
    selectedStateFilterName(newVal) {
      this.updateHighlightedState(newVal);
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

.graph-section {
  display: flex;
  flex-flow: column;
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