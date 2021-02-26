/*
  Copyright 2019 Square Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const squareConnect = require('square-connect');
const request = require('request');
const { url } = require('inspector');
const fs = require('fs');
const app = express();
const port = 3000;

if (!fs.existsSync('./config.js')) {
  console.log('WARN: Make a copy of confing-dist.js to config.js and configure it.');
  process.exit(1);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// Load config
const config = require('./config.js'); 

// Set Square Connect credentials and environment
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = config.square['access_token'];

// Set 'basePath' to switch between sandbox env and production env
defaultClient.basePath = config.square['base_url'];

app.post('/process-payment', async (req, res) => {
  const request_params = req.body;

  var data = {
    "nonce": request_params.nonce,
    "verificationToken": request_params.verificationToken,
    "paymentLinkId": paymentLinkId,
    "amount": request_params.amount,
    "billingContact": {
        "AddressLine1": request_params.billingContact.addressLines[0],
        "addressLine2": "",
        "city": request_params.billingContact.city,
        "country": request_params.billingContact.country,
        "countryName": request_params.billingContact.country,
        "email": request_params.billingContact.email,
        "familyName": request_params.billingContact.familyName,
        "givenName": request_params.billingContact.givenName,
        "phone": request_params.billingContact.phone,
        "postalCode": request_params.billingContact.postalCode,
        "region": ""
    }
  };


  console.log(JSON.stringify(data, null, 2));

  res.send(data);

});

app.listen(
  port,
  () => { 
    console.log(`listening on - http://localhost:${port}...`)
  }
);
