import _ from "lodash";
import {
  defaultPlanTypes,
  defaultCoveredDiseasesPrograms,
  stateCodeToName,
  stateNameToCode,
  statesWithInsurancePlans
} from "./constants";
import {
  getAvgMonthlyPremiumByParams,
  getCheapestPlans,
  getAgeFilterOptions,
  getStateFilterOptions,
  getPlanTypeFilterOptions,
  getCoveredDiseasesFilterOptions
} from "./api";

const defaultFiltersOptions = {
  age: [{ value: null, text: "All" }].concat(_.range(18, 31)),
  coveredDiseasesPrograms: defaultCoveredDiseasesPrograms,
  metalLevel: ["Bronze", "Expanded Bronze"],
  planType: defaultPlanTypes,
  price: { min: null, max: null },
  state: [{ value: null, text: "State" }].concat(statesWithInsurancePlans)
};

export const appStore = {
  strict: true,
  state: {
    isLoading: {
      filter: true,
      stateBasedView: true,
      planBasedView: { cheapestPlan: true, spiderChart: true }
    },
    selectedFilters: {
      age: null,
      coveredDiseasesPrograms: [],
      metalLevel: null,
      planType: defaultPlanTypes,
      price: { min: null, max: null },
      state: { code: null, name: null }
    },
    averageStatePremium: null,
    averageStatePremiumPriceRange: { min: null, max: null },
    cheapestPlans: [],
    availableFilterOptions: {
      age: null,
      coveredDiseasesPrograms: null,
      planType: null,
      state: null
    }
  },
  getters: {
    filtersOptions(state, getters) {
      return {
        age: getters.ageOptions,
        coveredDiseasesPrograms: getters.coveredDiseasesProgramsOptions,
        metalLevel: getters.metalLevelOptions,
        planType: getters.planTypeOptions,
        price: getters.priceOptions,
        state: getters.stateOptions
      };
    },
    ageOptions(state) {
      console.log(state.availableFilterOptions.age);
      return defaultFiltersOptions.age;
    },
    coveredDiseasesProgramsOptions(state) {
      if (state.availableFilterOptions.coveredDiseasesPrograms) {
        return state.availableFilterOptions.coveredDiseasesPrograms;
      } else {
        return defaultFiltersOptions.coveredDiseasesPrograms;
      }
    },
    metalLevelOptions() {
      return defaultFiltersOptions.metalLevel;
    },
    planTypeOptions(state) {
      console.log(state.availableFilterOptions.planType);
      let distinctPlanType = defaultFiltersOptions.planType;
      return defaultFiltersOptions.planType.map(plan => {
        let hasValue = _.indexOf(distinctPlanType, plan) > -1;
        return {
          text: plan.text || plan,
          value: hasValue ? plan.text || plan : null,
          disabled: !hasValue
        };
      });
    },
    priceOptions(state) {
      console.log(state.availableFilterOptions.state);
      return defaultFiltersOptions.price;
    },
    stateOptions(state) {
      if (state.availableFilterOptions.state) {
        return state.availableFilterOptions.state;
      } else {
        return defaultFiltersOptions.state;
      }
    },
    isPageLoading(state) {
      let subComponentsStatus = _.invertBy(state.isLoading.planBasedView);
      return (
        state.isLoading.filter ||
        state.isLoading.stateBasedView ||
        (true in subComponentsStatus && subComponentsStatus[true].length)
      );
    },
    currentLoadingComponent(state) {
      let currentLoadingComponent = [];
      if (state.isLoading.filter) {
        currentLoadingComponent.push("Filters");
      }
      if (state.isLoading.stateBasedView) {
        currentLoadingComponent.push("State Map");
      }
      let subComponentsStatus = _.invertBy(state.isLoading.planBasedView);
      if (true in subComponentsStatus && subComponentsStatus[true].length) {
        currentLoadingComponent = currentLoadingComponent.concat(
          subComponentsStatus[true]
        );
      }
      return currentLoadingComponent;
    }
  },
  actions: {
    async updateStateMap({ commit, state }) {
      commit("stateBasedViewIsLoading", true);
      commit(
        "hasAvgStatePremiumData",
        await getAvgMonthlyPremiumByParams(state.selectedFilters)
      );
      commit("stateBasedViewIsLoading", false);
    },
    async updateCheapestPlan({ commit, state }) {
      commit("cheapestPlanIsLoading", true);
      commit(
        "hasCheapestPlanData",
        await getCheapestPlans(state.selectedFilters)
      );
      commit("cheapestPlanIsLoading", false);
    },
    async updateContentBySelectedFilter(
      { commit, dispatch, state },
      { newVal, filterType, type }
    ) {
      const oldVal = state.selectedFilters[filterType];
      try {
        if (
          _.indexOf(["planType", "coveredDiseasesPrograms"], filterType) > -1
        ) {
          if (
            JSON.stringify(state.selectedFilters[filterType].sort()) !=
            JSON.stringify(newVal.sort())
          ) {
            commit("setSelectedFilters", { newVal, type: filterType });
            dispatch("getFiltersOptionsWithDisabledMark", filterType);
            dispatch("updateStateMap");
            dispatch("updateCheapestPlan");
          }
        } else if (filterType == "age") {
          if (state.selectedFilters[filterType] != newVal) {
            let value = newVal ? _.toString(newVal) : null;
            commit("setSelectedFilters", { newVal: value, type: filterType });
            dispatch("getFiltersOptionsWithDisabledMark", filterType);
            dispatch("updateStateMap");
            dispatch("updateCheapestPlan");
          }
        } else if (filterType == "state") {
          if (state.selectedFilters.state[type] != newVal) {
            if (!newVal) {
              state.selectedFilters.state.code = null;
              state.selectedFilters.state.name = null;
            }
            if (type == "code") {
              if (newVal) {
                state.selectedFilters.state.code = newVal;
                state.selectedFilters.state.name = stateCodeToName[newVal];
              }
            } else if (type == "name") {
              if (newVal) {
                state.selectedFilters.state.name = newVal;
                state.selectedFilters.state.code = stateNameToCode[newVal];
              }
            }
            dispatch("getFiltersOptionsWithDisabledMark", filterType);
            dispatch("updateStateMap");
            dispatch("updateCheapestPlan");
          }
        }
      } catch (e) {
        console.log("errr", e);
        // reset the value
        state.selectedFilters[filterType] = oldVal;
        commit("stateBasedViewIsLoading", false);
        // TODO: show stateView error message or retry
      }
    },
    async getFiltersOptionsWithDisabledMark({ commit, state }, filterType) {
      console.log(">>> inside of getFiltersOptionsWithDisabledMark");
      commit("filterIsLoading", true);

      let funcs = {
        age: async function (selectedFilters) {
          console.log("commit('updateAvailableAgeFilterOptions'");
          commit(
            "updateAvailableAgeFilterOptions",
            await getAgeFilterOptions(selectedFilters)
          );
        },
        state: async function (selectedFilters) {
          console.log("commit('updateAvailableStateFilterOptions'");
          commit(
            "updateAvailableStateFilterOptions",
            await getStateFilterOptions(selectedFilters)
          );
        },
        planType: async function (selectedFilters) {
          console.log("commit('updateAvailablePlanTypeFilterOptions'");
          commit(
            "updateAvailablePlanTypeFilterOptions",
            await getPlanTypeFilterOptions(selectedFilters)
          );
        },
        coveredDiseasesPrograms: async function (selectedFilters) {
          console.log("commit('updateAvailableCoveredDiseasesFilterOptions'");
          commit(
            "updateAvailableCoveredDiseasesFilterOptions",
            await getCoveredDiseasesFilterOptions(selectedFilters)
          );
        }
      };

      ["age", "state", "planType", "coveredDiseasesPrograms"].forEach(function (
        name
      ) {
        if (name != filterType) {
          funcs[name](state.selectedFilters);
        }
      });

      commit("filterIsLoading", false);
    },
    resetFilters({ dispatch, state }) {
      state.selectedFilters = {
        age: null,
        coveredDiseasesPrograms: [],
        metalLevel: null,
        planType: defaultPlanTypes,
        price: { min: null, max: null },
        state: { code: null, name: null }
      };
      state.availableFilterOptions = {
        age: null,
        coveredDiseasesPrograms: null,
        planType: null,
        state: null
      };

      dispatch("updateStateMap");
      dispatch("updateCheapestPlan");
    }
  },
  mutations: {
    setSelectedFilters(state, { newVal, type }) {
      state.selectedFilters[type] = newVal;
    },
    filterIsLoading(state, isLoading) {
      state.isLoading.filter = isLoading;
      if (isLoading) {
        state.isLoading.stateBasedView = isLoading;
        // state.isLoading.planBasedView.cheapestPlan = isLoading;
        // state.isLoading.planBasedView.spiderChart = isLoading;
      }
    },
    updateAvailableAgeFilterOptions(state, data) {
      console.log(">> available Age Rows", data.length);
      state.availableFilterOptions.age = data;
    },
    updateAvailableStateFilterOptions(state, data) {
      console.log(">> available State Rows", data.length);
      let distinctStateCode = [...new Set(_.map(data, row => row.StateCode))];

      if (distinctStateCode.length) {
        let updatedSet = new Set(distinctStateCode);
        let updated = statesWithInsurancePlans.map(function (state) {
          return {
            value: state,
            text: state,
            disabled: !updatedSet.has(state)
          };
        });
        state.availableFilterOptions.state = [
          { value: null, text: "State" }
        ].concat(_.sortBy(updated, ["value"]));
      }
    },
    updateAvailablePlanTypeFilterOptions(state, data) {
      console.log(">> available Plantype Rows", data.length);
      state.availableFilterOptions.planType = data;
    },
    updateAvailableCoveredDiseasesFilterOptions(state, data) {
      console.log(">> available Age Rows", data.length);
      let temp = new Set();
      data.map(function (row) {
        temp = new Set(
          Array.from(temp).concat(
            row.DiseaseManagementProgramsOffered.split(",").map(item =>
              item.trim()
            )
          )
        );
      });
      state.availableFilterOptions.coveredDiseasesPrograms = defaultFiltersOptions.coveredDiseasesPrograms.map(
        item => {
          return temp.has(item) ? item : { text: item, disabled: true };
        }
      );
    },
    hasAvgStatePremiumData(state, data) {
      console.log(">> avgStatepremium Rows", data.length);
      if (data) {
        state.averageStatePremium = _.reduce(
          data,
          function (res, row) {
            res[row.StateCode] = row.AvgMonthlyPremium;
            return res;
          },
          {}
        );
        state.averageStatePremiumPriceRange = {
          min: _.minBy(data, "AvgMonthlyPremium"),
          max: _.maxBy(data, "AvgMonthlyPremium")
        };
      }
    },
    hasCheapestPlanData(state, data) {
      console.log(">> hasCheapestPlanData Rows", data.length);
      state.cheapestPlans = data;
    },
    stateBasedViewIsLoading(state, isLoading) {
      state.isLoading.stateBasedView = isLoading;
    },
    cheapestPlanIsLoading(state, isLoading) {
      state.isLoading.planBasedView.cheapestPlan = isLoading;
    },
    spiderChartIsLoading(state, isLoading) {
      state.isLoading.planBasedView.spiderChart = isLoading;
    },
    updateSelectedMetalLevel(state, newVal) {
      if (
        JSON.stringify(state.selectedFilters.metalLevel.sort()) !=
        JSON.stringify(newVal.sort())
      ) {
        state.selectedFilters.metalLevel = newVal;
      }
    },
    updateSelectedMinPrice(state, newVal) {
      if (newVal != state.selectedFilters.price.min) {
        state.selectedFilters.price.min = isNaN(parseInt(newVal))
          ? null
          : parseInt(newVal);
      }
    },
    updateSelectedMaxPrice(state, newVal) {
      if (newVal != state.selectedFilters.price.max) {
        state.selectedFilters.price.max = isNaN(parseInt(newVal))
          ? null
          : parseInt(newVal);
      }
    }
  }
};
