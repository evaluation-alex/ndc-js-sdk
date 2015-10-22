# NDC client

[![Build Status](https://travis-ci.org/iata-ndc/ndc-js-sdk.png?branch=master)](https://travis-ci.org/iata-ndc/ndc-js-sdk)

A Node.js client wrapper for IATA's NDC API.

## Installation

Use npm to install:

    npm install ndc-client

Or install from repo:

    npm install iata-ndc/ndc-js-sdk

Or just clone with git:

    git clone https://github.com/iata-ndc/ndc-js-sdk.git

## Usage

Have a config ready:

```json
{
  "courrencyCode": "USD",
  "countryCode": "US",
  "cityCode": "NYC",
  "providerName": "THISNTHAT NDC GATEWAY",
  "endpoint": "http://thisnthat.example.com/ndcapi",
  "APIAuthKey": "xxxxxxxxxxxxxxxxxxxxxxxxx",
  "agency": {
    "IATANumber": "0000XXXX",
    "name": "ThisNThat Agency",
    "userId": "developer.test",
    "type": "TravelManagementCompany",
    "email": "info@thisnthat.example.com"
  },
  "sender": {
  	"id": "C9",
	"name": "Kronos Air",
	"type": "TravelManagementCompany",
	"email": "test@example.org",
	"IATANumber": "00000001"
  },
  "airline": {
    "id": "XX",
    "name": "ThisNThat Air"
  }
}
```

And then make a request.

```javascript
var NDC = require('ndc-client');
var ndc = new NDC(require('./config.json'));

/* OneWay with multiple pax */
var reqData = {
    pointOfSaleEvent: {
        code: 9,
        definition: 'Shop'
    },
    onds: [{
        flights: [{
            departure: {
                date: new Date('2016-01-01'),
                airportCode: 'MUC'
            },
            arrival: {
                airportCode: 'LHR'
            },
            airline: config.sender
        }]
    }],
    cabin: 'C',
    travelers: [
        /* two anonymous adults */
        {
            anonymous: true,
            count: 2,
            type: 'ADT'
        },
        /* 1 anonymous children */
        {
            anonymous: true,
            count: 1,
            type: 'CNN'
        },
        /* 1 anonymous infant */
        {
            anonymous: true,
            count: 1,
            type: 'INF'
        }
    ]
};

// Direct request
ndc.request('AirShopping', reqData, function (err, response) {
    console.log(response);
});

//Or if you need to work with message body:
var message = ndc.messages.AirShopping(reqData);

// print JSON message.
console.log(message.toJSON());
// print pretty XML code.
console.log(message.toXML(true));
// forced XML body
message.forceBody(message.toXML().replace(/thisString/g, 'thatString'))
// make request
message.request(function (err, response) {
    // view response
    console.log(response); 
});
```

For further details on each message parameters, have a look to the test folder in the `test-data.js` file, with examples.
