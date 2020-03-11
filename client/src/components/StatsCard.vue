<template>
  <div
    class="stats-card"
    v-b-tooltip.hover.v-info
    :title="toolTipText"
    @click="updateStateMapWithType"
  >
    <div class="content">
      <div v-if="title" class="title">
        <!-- <b-icon icon="info" font-scale="1"></b-icon> -->
        <img alt="stats card icon" :src="getImgUrl()" />
        {{title}}
      </div>
      <div class="description">{{value}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsCard",
  components: {},
  props: ["title", "value", "type", "toolTip", "iconUrl"],
  data() {
    return {
      iconUrlHash: {
        State: "stats-state.png",
        USNewsRank: "stats-rank.png",
        WalletHubCompositeScore: "stats-comp-score.png",
        AvgMonthlyPrice: "stats-avg.png"
      }
    };
  },
  computed: {
    toolTipText: function() {
      if (this.toolTip) {
        return `${this.toolTip.State} has the highest ${this.title}: ${
          this.toolTip[this.type]
        }`;
      }
      return null;
    }
  },
  methods: {
    getImgUrl() {
      return require("../assets/" + this.iconUrlHash[this.type]);
    },
    updateStateMapWithType() {
      console.log(">> on stats card clicked", this.type);
      this.$store.dispatch("updateStateMapWithType", this.type);
    }
  }
};
</script>

<style scoped>
.stats-card {
  width: 250px;
  margin: auto;
  margin-bottom: 20px;
  text-align: center;
  background-color: #fff;
  border: none;
  display: inline-flex;
  border-radius: 0.625rem;
  box-shadow: 0 0.46875rem 2.1875rem rgba(90, 97, 105, 0.1),
    0 0.9375rem 1.40625rem rgba(90, 97, 105, 0.1),
    0 0.25rem 0.53125rem rgba(90, 97, 105, 0.12),
    0 0.125rem 0.1875rem rgba(90, 97, 105, 0.1);
}

.content {
  padding: 20px 50px;
}

.title {
  font-size: 16px;
}
.description {
  font-weight: bold;
  font-size: 22px;
}

.v-b-tooltip.bottom {
  background-color: var(--theme-blue);
}
</style>