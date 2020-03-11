<template>
  <div class="attribute-card" v-b-tooltip.hover.v-info :title="toolTipText">
    <div class="content">
      <div v-if="showAttributeName">
        <div v-if="cardTitle" class="title">
          <b-icon icon="info" font-scale="1"></b-icon>
          {{cardTitle}}
        </div>
        <div class="description">{{description}}</div>
      </div>

      <div v-if="!showAttributeName">
        <div v-if="cardTitle" class="title">
          <b-icon icon="info" font-scale="1"></b-icon>
          {{price}}
          <br />
          {{cardTitle}}
        </div>
        <div class="description">{{description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AttributeCard",
  components: {},
  props: [
    "title",
    "plan",
    "toolTip",
    "selectedAttribute",
    "selectedAttributeName",
    "index",
    "showAttributeName"
  ],
  computed: {
    cardTitle: function() {
      if (this.title) {
        return this.title;
      } else {
        return this.plan.PlanMarketingName;
      }
    },
    price: function() {
      if (this.showAttributeName) {
        return;
      }
      return `$${this.plan.IndividualRate}`;
    },
    description: function() {
      if (this.showAttributeName) {
        return this.selectedAttributeName;
      }
      return `Rank #${this.index + 1} - ${this.plan[this.selectedAttribute]}`;
    },
    toolTipText: function() {
      if (this.showAttributeName) {
        return `Click on point on the graph to compare against the selected attribute.`;
      }
      return null;
    }
  }
};
</script>

<style scoped>
.attribute-card {
  width: 250px;
  margin: auto;
  margin-bottom: 20px;
  text-align: center;
  background-color: #fff;
  border: none;
  display: inline-flex;
  border-radius: 0.625rem;
  box-shadow: 0px 4px 20px rgba(14, 30, 94, 0.1);
}

.content {
  padding: 20px 50px;
}

.title {
  font-size: 14px;
}
.description {
  font-weight: bold;
  font-size: 20px;
}

.v-b-tooltip.bottom {
  background-color: var(--theme-blue);
}
</style>