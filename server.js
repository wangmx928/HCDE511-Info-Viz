const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const graphiqlData = require("./graphql/graphqlData.js");
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 443;

// Create the server
const app = express()

app.use(cors());

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/dist')))

// GraphQL
app.use('/graphql/insuranceQuality', graphqlHTTP({
  schema: graphiqlData.schema.insuranceQuality,
  graphiql: true,
}));

app.use('/graphql/insurancePlans', graphqlHTTP({
  schema: graphiqlData.schema.insurancePlans,
  graphiql: true,
}));


// Anything that doesn't match the above, send back the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'))
})

// Choose the port and start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
