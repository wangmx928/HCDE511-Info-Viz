// PRODUCTION
export const endpoints = {
  insuranceQuality: "https://agile-tundra-42522.herokuapp.com:443/graphql/insuranceQuality",
  insurancePlans: "https://agile-tundra-42522.herokuapp.com:443/graphql/insurancePlans"
}

// DEVELOPMENT
// export const endpoints = {
//   insuranceQuality: "http://localhost:3000/graphql/insuranceQuality",
//   insurancePlans: "http://localhost:3000/graphql/insurancePlans"
// }

export const defaultPlanTypes = ["EPO", "HMO", "POS", "PPO"];

export const defaultCoveredDiseasesPrograms = [
  "Pregnancy",
  "Depression",
  "Asthma",
  "Low Back Pain",
  "Weight Loss Programs",
  "Heart Disease",
  "Pain Management",
  "High Blood Pressure And Cholesterol",
  "Diabetes"
];

export const stateNameToCode = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "District of Columbia": "DC",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
};

export const stateCodeToName = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District of Columbia",
  "FL": "Florida",
  "GA": "Georgia",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};

export const statesWithInsurancePlans = ["FL", "AL", "KS", "NC", "MI", "OH", "LA", "NJ", "NH", "OR", "MO", "GA", "NM", "MT", "MS", "TN", "DE", "ME", "AZ", "HI", "IA", "IL", "TX", "UT", "VA", "WI", "IN", "AR", "OK", "ND", "KY", "PA", "AK", "NE", "SC", "SD", "WV"].sort();

export const statesWithHealthQualityData = ["AK", "AL", "AR", "AZ", "DE", "FL", "GA", "HI", "IA", "IL", "IN", "KS", "KY", "LA", "ME", "MI", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "OH", "OK", "OR", "PA", "SC", "SD", "TN", "TX", "UT", "VA", "WI", "WV"];

export const allStates = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

export const stateGeoLocations = [
  {
    stateCode: "AL",
    name: "Alabama",
    x: 6,
    y: 7,
    value: null
  },
  {
    stateCode: "AK",
    name: "Alaska",
    x: 0,
    y: 0,
    value: null
  },
  {
    stateCode: "AZ",
    name: "Arizona",
    x: 5,
    y: 3,
    value: null
  },
  {
    stateCode: "AR",
    name: "Arkansas",
    x: 5,
    y: 6,
    value: null
  },
  {
    stateCode: "CA",
    name: "California",
    x: 5,
    y: 2,
    value: null
  },
  {
    stateCode: "CO",
    name: "Colorado",
    x: 4,
    y: 3,
    value: null
  },
  {
    stateCode: "CT",
    name: "Connecticut",
    x: 3,
    y: 11,
    value: null
  },
  {
    stateCode: "DE",
    name: "Delaware",
    x: 4,
    y: 9,
    value: null
  },
  {
    stateCode: "DC",
    name: "District of Columbia",
    x: 4,
    y: 10,
    value: null
  },
  {
    stateCode: "FL",
    name: "Florida",
    x: 8,
    y: 8,
    value: null
  },
  {
    stateCode: "GA",
    name: "Georgia",
    x: 7,
    y: 8,
    value: null
  },
  {
    stateCode: "HI",
    name: "Hawaii",
    x: 8,
    y: 0,
    value: null
  },
  {
    stateCode: "ID",
    name: "Idaho",
    x: 3,
    y: 2,
    value: null
  },
  {
    stateCode: "IL",
    name: "Illinois",
    x: 3,
    y: 6,
    value: null
  },
  {
    stateCode: "IN",
    name: "Indiana",
    x: 3,
    y: 7,
    value: null
  },
  {
    stateCode: "IA",
    name: "Iowa",
    x: 3,
    y: 5,
    value: null
  },
  {
    stateCode: "KS",
    name: "Kansas",
    x: 5,
    y: 5,
    value: null
  },
  {
    stateCode: "KY",
    name: "Kentucky",
    x: 4,
    y: 6,
    value: null
  },
  {
    stateCode: "LA",
    name: "Louisiana",
    x: 6,
    y: 5,
    value: null
  },
  {
    stateCode: "ME",
    name: "Maine",
    x: 0,
    y: 11,
    value: null
  },
  {
    stateCode: "MD",
    name: "Maryland",
    x: 4,
    y: 8,
    value: null
  },
  {
    stateCode: "MA",
    name: "Massachusetts",
    x: 2,
    y: 10,
    value: null
  },
  {
    stateCode: "MI",
    name: "Michigan",
    x: 2,
    y: 7,
    value: null
  },
  {
    stateCode: "MN",
    name: "Minnesota",
    x: 2,
    y: 4,
    value: null
  },
  {
    stateCode: "MS",
    name: "Mississippi",
    x: 6,
    y: 6,
    value: null
  },
  {
    stateCode: "MO",
    name: "Missouri",
    x: 4,
    y: 5,
    value: null
  },
  {
    stateCode: "MT",
    name: "Montana",
    x: 2,
    y: 2,
    value: null
  },
  {
    stateCode: "NE",
    name: "Nebraska",
    x: 4,
    y: 4,
    value: null
  },
  {
    stateCode: "NV",
    name: "Nevada",
    x: 4,
    y: 2,
    value: null
  },
  {
    stateCode: "NH",
    name: "New Hampshire",
    x: 1,
    y: 11,
    value: null
  },
  {
    stateCode: "NJ",
    name: "New Jersey",
    x: 3,
    y: 10,
    value: null
  },
  {
    stateCode: "NM",
    name: "New Mexico",
    x: 6,
    y: 3,
    value: null
  },
  {
    stateCode: "NY",
    name: "New York",
    x: 2,
    y: 9,
    value: null
  },
  {
    stateCode: "NC",
    name: "North Carolina",
    x: 5,
    y: 9,
    value: null
  },
  {
    stateCode: "ND",
    name: "North Dakota",
    x: 2,
    y: 3,
    value: null
  },
  {
    stateCode: "OH",
    name: "Ohio",
    x: 3,
    y: 8,
    value: null
  },
  {
    stateCode: "OK",
    name: "Oklahoma",
    x: 6,
    y: 4,
    value: null
  },
  {
    stateCode: "OR",
    name: "Oregon",
    x: 4,
    y: 1,
    value: null
  },
  {
    stateCode: "PA",
    name: "Pennsylvania",
    x: 3,
    y: 9,
    value: null
  },
  {
    stateCode: "RI",
    name: "Rhode Island",
    x: 2,
    y: 11,
    value: null
  },
  {
    stateCode: "SC",
    name: "South Carolina",
    x: 6,
    y: 8,
    value: null
  },
  {
    stateCode: "SD",
    name: "South Dakota",
    x: 3,
    y: 4,
    value: null
  },
  {
    stateCode: "TN",
    name: "Tennessee",
    x: 5,
    y: 7,
    value: null
  },
  {
    stateCode: "TX",
    name: "Texas",
    x: 7,
    y: 4,
    value: null
  },
  {
    stateCode: "UT",
    name: "Utah",
    x: 5,
    y: 4,
    value: null
  },
  {
    stateCode: "VT",
    name: "Vermont",
    x: 1,
    y: 10,
    value: null
  },
  {
    stateCode: "VA",
    name: "Virginia",
    x: 5,
    y: 8,
    value: null
  },
  {
    stateCode: "WA",
    name: "Washington",
    x: 2,
    y: 1,
    value: null
  },
  {
    stateCode: "WV",
    name: "West Virginia",
    x: 4,
    y: 7,
    value: null
  },
  {
    stateCode: "WI",
    name: "Wisconsin",
    x: 2,
    y: 5,
    value: null
  },
  {
    stateCode: "WY",
    name: "Wyoming",
    x: 3,
    y: 3,
    value: null
  }
];