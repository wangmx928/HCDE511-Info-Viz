import _ from "lodash";
import {
  defaultPlanTypes,
  defaultCoveredDiseasesPrograms,
  stateCodeToName,
  stateNameToCode,
  statesWithInsurancePlans
} from "./constants";
import {
  getAllHealthInsuranceQuality,
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
    avgPriceRange: null,
    cheapestPlans: [],
    currentStateMapType: 'averageStatePremium',
    insuranceQualities: null,
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
      if (state.availableFilterOptions.age) {
        return state.availableFilterOptions.age;
      } else {
        return defaultFiltersOptions.age;
      }
    },
    coveredDiseasesProgramsOptions(state) {
      if (state.availableFilterOptions.coveredDiseasesPrograms) {
        return state.availableFilterOptions.coveredDiseasesPrograms;
      } else {
        return defaultFiltersOptions.coveredDiseasesPrograms;
      }
    },
    metalLevelOptions(state) {
      if (state.availableFilterOptions.metalLevel) {
        return state.availableFilterOptions.metalLevel;
      } else {
        return defaultFiltersOptions.metalLevel;
      }
    },
    planTypeOptions(state) {
      if (state.availableFilterOptions.planType) {
        return state.availableFilterOptions.planType;
      } else {
        return defaultFiltersOptions.planType;
      }
    },
    priceOptions(state) {
      if (state.availableFilterOptions.price) {
        return state.availableFilterOptions.price;
      } else {
        return defaultFiltersOptions.price;
      }
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
    updatePageAccordingToFiltersResult({ dispatch, state }, filterType) {
      dispatch("getFiltersOptionsWithDisabledMark", filterType);
      if (state.currentStateMapType == 'averageStatePremium') {
        dispatch("updateStateMap");
      }
      dispatch("updateCheapestPlan");
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
            dispatch("updatePageAccordingToFiltersResult", filterType);
          }
        } else if (filterType == "age") {
          if (state.selectedFilters[filterType] != newVal) {
            let value = newVal ? _.toString(newVal) : null;
            commit("setSelectedFilters", { newVal: value, type: filterType });
            dispatch("updatePageAccordingToFiltersResult", filterType);
          }
        } else if (filterType == "state") {
          if (state.selectedFilters.state[type] != newVal) {
            if (!newVal) {
              commit("updateSelectedStateFilter", { code: null, name: null });
              state.selectedFilters.state.code = null;
              state.selectedFilters.state.name = null;
            } else {
              if (type == "code") {
                if (newVal) {
                  commit("updateSelectedStateFilter", { code: newVal, name: stateCodeToName[newVal] });
                }
              } else if (type == "name") {
                if (newVal) {
                  commit("updateSelectedStateFilter", { name: newVal, code: stateNameToCode[newVal] });
                }
              }
            }
            dispatch("updatePageAccordingToFiltersResult", filterType);
          }
        } else if (filterType == "price") {
          let newPrice = null;
          if (type == "min") {
            newPrice = { min: parseInt(newVal), max: state.selectedFilters.price.max };
          } else if (type == "max") {
            newPrice = { min: state.selectedFilters.price.min, max: parseInt(newVal) }
          }
          commit("setSelectedFilters", { newVal: newPrice, type: filterType });
          dispatch("updatePageAccordingToFiltersResult", filterType);
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
    },
    async updateStateMapWithType({ commit, state }, type) {
      console.log("> updateStateMapWithType")
      commit("stateBasedViewIsLoading", true);

      if (type == 'averageStatePremium') {
        commit(
          "hasAvgStatePremiumData",
          await getAvgMonthlyPremiumByParams(state.selectedFilters)
        );
      }

      commit("stateBasedViewIsLoading", false);
    },
    async getAllHealthInsuranceQualityData({ commit }) {
      console.log("> get quality data from store")
      commit("updateHealthQualityData", await getAllHealthInsuranceQuality())
    }
  },
  mutations: {
    updateSelectedStateFilter(state, data) {
      state.selectedFilters.state.name = data.name;
      state.selectedFilters.state.code = data.code;
    },
    updateHealthQualityData(state, data) {
      console.log("> updateHealthQualityData");
      state.insuranceQualities = data;
    },
    setSelectedFilters(state, { newVal, type }) {
      state.selectedFilters[type] = newVal;
    },
    filterIsLoading(state, isLoading) {
      state.isLoading.filter = isLoading;
      if (isLoading) {
        state.isLoading.stateBasedView = isLoading;
        state.isLoading.planBasedView.cheapestPlan = isLoading;
        state.isLoading.planBasedView.spiderChart = isLoading;
      }
    },
    updateAvailableAgeFilterOptions(state, data) {
      let ageSet = new Set(_.map(data, row => row.Age));
      let result = defaultFiltersOptions.age.map(function (age) {
        if (age.value == null) {
          return age;
        }
        return { text: age, disabled: !ageSet.has(age) };
      });
      state.availableFilterOptions.age = result;
    },
    updateAvailableStateFilterOptions(state, data) {
      let distinctStateCode = new Set(_.map(data, row => row.StateCode));

      let result = defaultFiltersOptions.state.map(function (state) {
        if (state.value == null) {
          return state;
        }

        return {
          value: state,
          text: state,
          disabled: !distinctStateCode.has(state)
        };
      });
      state.availableFilterOptions.state = result;
    },
    updateAvailablePlanTypeFilterOptions(state, data) {
      let distinctPlanType = new Set(_.map(data, row => row.PlanType));
      let hasValue = null;
      let updatedPlanOptions = defaultFiltersOptions.planType.map(plan => {
        hasValue = distinctPlanType.has(plan)
        return {
          text: plan,
          value: hasValue ? plan : null,
          disabled: !hasValue
        };
      });

      state.availableFilterOptions.planType = updatedPlanOptions;
    },
    updateAvailableCoveredDiseasesFilterOptions(state, data) {
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
      console.log('temp', temp);
      state.availableFilterOptions.coveredDiseasesPrograms = defaultFiltersOptions.coveredDiseasesPrograms.map(
        item => {
          console.log('item', item);
          return temp.has(item) ? item : { text: item, disabled: true };
        }
      );
    },
    hasAvgStatePremiumData(state, data) {
      if (data) {
        state.averageStatePremium = _.reduce(
          data,
          function (res, row) {
            res[row.StateCode] = row.AvgMonthlyPremium;
            return res;
          },
          {}
        );

        let priceRange = _.values(state.averageStatePremium).sort();
        state.avgPriceRange = {
          min: _.head(priceRange),
          max: _.last(priceRange)
        }
      }
    },
    hasCheapestPlanData(state, data) {
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
