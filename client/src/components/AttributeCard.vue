<template>
  <div class="attribute-card" v-b-tooltip.right.hover.v-info :title="toolTipText">
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
          {{price}}
          <br />
          {{cardTitle}}
          <br />
          <b>{{`Rank #${this.index + 1}`}}</b>
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
  data() {
    return {
      toolTipTextHash: {
        CoveredDiseasesCount:
          "Total number covered diseasese programs by the insurance plan",
        SBCHavingaBabyDeductible:
          "The dollar amount of the deductible for the sample Summary of Benefits & Coverage (SBC) scenario of having a baby",
        SBCHavingaBabyCopayment:
          "The dollar amount of the copayment for the sample SBC scenario of having a baby",
        SBCHavingaBabyCoinsurance:
          "The dollar amount of the coinsurance for the sample SBC scenario of having a baby",
        SBCHavingaBabyLimit:
          "The dollar amount of the benefit limits or exclusions for the sample SBC scenario of having a baby",
        SBCHavingDiabetesDeductible:
          "The dollar amount of the deductible for the sample SBC scenario of having diabetes",
        SBCHavingDiabetesCopayment:
          "The dollar amount of the copayment for the sample SBC scenario of having diabetes",
        SBCHavingDiabetesCoinsurance:
          "The dollar amount of the coinsurance for the sample SBC scenario of having diabetes",
        SBCHavingDiabetesLimit:
          "The dollar amount of the benefit limits or exclusions for the sample SBC scenario of having diabetes",
        SBCHavingSimplefractureDeductible:
          "The dollar amount of the deductible for the sample SBC scenario of treatment of a simple fracture",
        SBCHavingSimplefractureCopayment:
          "The dollar amount of the copayment for the sample SBC scenario of treatment of a simple fracture",
        SBCHavingSimplefractureCoinsurance:
          "The dollar amount of the coinsurance for the sample SBC scenario of treatment of a simple fracture",
        IndividualRate:
          "Dollar value for the insurance premium cost applicable to a non-tobacco user for the insurance plan in a rating area, or to a general subscriber if there is no tobacco preference"
      }
    };
  },
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
      return `${this.plan[this.selectedAttribute]}`;
    },
    toolTipText: function() {
      if (this.showAttributeName) {
        if (!this.selectedAttributeName) {
          return `Click on chart to compare plans against the selected attribute.`;
        }
        return this.toolTipTextHash[this.selectedAttribute];
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