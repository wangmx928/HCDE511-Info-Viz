import _ from "lodash";
import {
  defaultPlanTypes,
  defaultCoveredDiseasesPrograms,
  stateCodeToName,
  stateNameToCode,
  statesWithInsurancePlans
} from "./constants";
import { getAvgMonthlyPremiumByParams } from "./api"

const defaultFiltersOptions = {
  age: [{ value: null, text: "All" }].concat(_.range(18, 31)),
  coveredDiseasesPrograms: defaultCoveredDiseasesPrograms,
  metalLevel: ['Bronze', 'Expanded Bronze'],
  planType: defaultPlanTypes,
  price: { min: null, max: null },
  state: [{ value: null, text: "State" }].concat(statesWithInsurancePlans)
};

export const appStore = {
  state: {
    isLoading: {
      filter: true,
      stateBasedView: true,
      // planBasedView: { cheapestPlan: true, spiderChart: true },
    },
    needsRefresh: false,
    selectedFilters: {
      age: null,
      coveredDiseasesPrograms: [],
      metalLevel: null,
      planType: defaultPlanTypes,
      price: { min: null, max: null },
      state: { code: null, name: null }
    },
    averageStatePremium: null,
    averageStatePremiumPriceRange: { min: null, max: null }
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
      }
    },
    ageOptions() {
      return defaultFiltersOptions.age;
    },
    coveredDiseasesProgramsOptions() {
      return defaultFiltersOptions.coveredDiseasesPrograms;
    },
    metalLevelOptions() {
      return defaultFiltersOptions.metalLevel;
    },
    planTypeOptions() {
      let distinctPlanType = defaultFiltersOptions.planType;
      return defaultFiltersOptions.planType.map(plan => {
        console.log(plan, distinctPlanType)
        let hasValue = _.indexOf(distinctPlanType, plan) > -1
        return {
          text: plan.text || plan,
          value: hasValue ? plan.text || plan : null,
          disabled: !hasValue
        };
      });
    },
    priceOptions() {
      return defaultFiltersOptions.price
    },
    stateOptions() {
      // stateOptions() {
      //   if (this.availableStateList.length) {
      //     let updatedSet = new Set(this.availableStateList);
      //     let updated = statesWithInsurancePlans.map(function (state) {
      //       return {
      //         value: state,
      //         text: state,
      //         disabled: !updatedSet.has(state)
      //       };
      //     });
      //     return [{ value: null, text: "State" }].concat(
      //       this._.sortBy(updated, ["value"])
      //     );
      //   }
      return defaultFiltersOptions.state;
    },
    isPageLoading(state) {
      let subComponentsStatus = _.invertBy(state.isLoading.planBasedView);
      return (state.isLoading.filter || state.isLoading.stateBasedView ||
        ((true in subComponentsStatus) && subComponentsStatus[true].length));
    },
    currentLoadingComponent(state) {
      let currentLoadingComponent = [];
      if (state.isLoading.filter) {
        currentLoadingComponent.push('Filters');
      }
      if (state.isLoading.stateBasedView) {
        currentLoadingComponent.push('State Map');
      }
      let subComponentsStatus = _.invertBy(state.isLoading.planBasedView);
      if (true in subComponentsStatus && subComponentsStatus[true].length) {
        currentLoadingComponent = currentLoadingComponent.concat(subComponentsStatus[true])
      }
      return currentLoadingComponent;
    }
  },
  actions: {
    async updateStateMap({ commit, state }) {
      commit("stateBasedViewIsLoading", true);
      commit('hasAvgStatePremiumData', await getAvgMonthlyPremiumByParams(state.selectedFilters))
      commit("stateBasedViewIsLoading", false);
    },
    async updateSelectedAge({ dispatch, state }, newVal) {
      if (newVal != state.selectedFilters.age) {
        state.selectedFilters.age = newVal ? _.toString(newVal) : null;
        dispatch("updateStateMap");
      }
    },
    async updateSelectedFilter({ commit, dispatch, state }, { newVal, filterType, type }) {
      const oldVal = state.selectedFilters[filterType];
      try {
        if (_.indexOf(['planType', 'coveredDiseasesPrograms'], filterType) > -1) {
          if (JSON.stringify(state.selectedFilters[filterType].sort()) != JSON.stringify(newVal.sort())) {
            state.selectedFilters[filterType] = newVal;
            dispatch("updateStateMap");
          }
        } else if (filterType == 'age') {
          if (state.selectedFilters[filterType] != newVal) {
            state.selectedFilters[filterType] = newVal ? _.toString(newVal) : null;
            dispatch("updateStateMap");
          }
        } else if (filterType == 'state') {
          if (state.selectedFilters.state[type] != newVal) {
            if (!newVal) {
              state.selectedFilters.state.code = null;
              state.selectedFilters.state.name = null;
            }
            if (type == 'code') {
              if (newVal) {
                state.selectedFilters.state.code = newVal;
                state.selectedFilters.state.name = stateCodeToName[newVal];
              }
            }
            else if (type == 'name') {
              if (newVal) {
                state.selectedFilters.state.name = newVal;
                state.selectedFilters.state.code = stateNameToCode[newVal];
              }
            }
            dispatch("updateStateMap");
          }
        }
      } catch (e) {
        console.log(e);
        // reset the value
        state.selectedFilters[filterType] = oldVal;
        commit("stateBasedViewIsLoading", false);
        // TODO: show stateView error message or retry
      }
    },
  },
  mutations: {
    filterIsLoading(state, isLoading) {
      state.isLoading.filter = isLoading;
      if (isLoading) {
        state.isLoading.stateBasedView = isLoading;
        state.isLoading.planBasedView.cheapestPlan = isLoading;
        state.isLoading.planBasedView.spiderChart = isLoading;
      }
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
        state.averageStatePremiumPriceRange = {
          min: _.minBy(data, "AvgMonthlyPremium"),
          max: _.maxBy(data, "AvgMonthlyPremium")
        }
      }
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
      if (JSON.stringify(state.selectedFilters.metalLevel.sort()) != JSON.stringify(newVal.sort())) {
        state.selectedFilters.metalLevel = newVal;
      }
    },
    updateSelectedMinPrice(state, newVal) {
      if (newVal != state.selectedFilters.price.min) {
        state.selectedFilters.price.min = isNaN(parseInt(newVal)) ? null : parseInt(newVal);
      }
    },
    updateSelectedMaxPrice(state, newVal) {
      if (newVal != state.selectedFilters.price.max) {
        state.selectedFilters.price.max = isNaN(parseInt(newVal)) ? null : parseInt(newVal);
      }
    }
  }
};