const express = require('express');
const app = express();
const cors = require('cors')
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');

// This is the secret message
// Do not share this with anybody who is unauthenticated
const SECRET_MESSAGE = "nice token. the secret code is 42"
  
// enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

// Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://newco.eu.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'https://newco.eu.auth0.com/api/v2/',
  algorithms: ['RS256']
});

// create API endpoint
app.get('/', checkJwt, function (req, res) {
  res.status(201).send(`message from server: "${SECRET_MESSAGE}"`);
})

// launch the API Server at localhost:8080
app.listen(8080);