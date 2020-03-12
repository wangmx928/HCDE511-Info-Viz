<template>
  <div class="footer-section">
    <div class="rows">
      <div class="sections">
        <div class="description-item">
          Course:
          <span>HCDE 511 Information Visualization</span>
        </div>
        <div class="description-item">
          Term:
          <span>Winter 2020</span>
        </div>
      </div>

      <div class="sections">
        <div class="description-item">
          Team:
          <span>Kelly Cao, Max Edelmann, Mofé Osanyintolu, Miaoxin Wang</span>
        </div>
        <div class="description-item">
          Data source:
          <a :href="dataSource">Center for Medicare & Medicaid Services</a>
        </div>
      </div>

      <div class="sections">
        <div class="description-item">
          Credit for JavaScript charting engine
          <a :href="highchartsCredit">Highcharts</a>
        </div>

        <div class="description-item">
          Open Source tools:
          <a :href="vuejs">Vuejs</a>,
          <a :href="nodejs">Nodejs</a>,
          <a :href="graphQL">GraphQL</a>,
          <a :href="SQLite3">SQLite3</a>
        </div>
      </div>
    </div>

    <div class="rows">
      <div class="sections" style="text-align: center;">
        <div class="description-item">©VizHealth</div>
        <div class="description-item">Last Edited on March 11, 2020</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      dataSource:
        "https://www.cms.gov/cciio/resources/data-resources/marketplace-puf",
      highchartsCredit: "https://www.highcharts.com/?credits",
      graphQL: "https://graphql.org/",
      vuejs: "https://vuejs.org/",
      nodejs: "https://nodejs.org/en/",
      SQLite3: "https://www.sqlite.org/index.html"
    };
  }
};
</script>

<style scoped>
.footer-section {
  margin-top: 120px;
  height: 200px;
  background-color: var(--secondary-grey);
  justify-content: center;
  color: black;
  display: flex;
  flex-flow: column;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
.rows {
  display: flex;
  flex-flow: row;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 20px;
}

.sections {
}

.description-item {
  font-size: 12px;
  font-weight: bold;
}

.description-item span {
  color: var(--optional-blue);
}

a {
  text-decoration: none;
  color: var(--optional-blue);
}
</style>