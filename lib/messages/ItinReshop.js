'use strict';
var util = require('util');
var common = require('./common');
var ItinReshop = function (data) {
    return {
        PointOfSale: common.PointOfSale(data),
        Document: common.Document(data),
        Party: common.Party(data, true),
        Query: {
            Reshop: {
                Actions: (function () {
                    return util._extend(util._extend({
                        ActionType: 'Create',
                        OrderID: {
                            _Owner: data.order.owner,
                            _: data.order.id
                        },
                        OrderItems: {
                            OrderItem: {
                                FlightItem: {
                                    OriginDestination: data.onds.map(function (ond) {
                                        return common.OriginDestinations(ond, data, 'Flight');
                                    })
                                }
                            }
                        }
                    }, common.Preferences(data)), common.Travelers(data, 'Passengers', 'Passenger'));
                }())
            }
        },
        DataLists: (function () {
            return util._extend({
                FlightSegmentList: data.dataList.onds.map(function (ond) {
                    return common.OriginDestinations(ond, data, 'FlightSegment');
                }),
                OriginDestinationList: {
                    OriginDestination: {
                        DepartureCode: data.dataList.onds[0].flights[0].departure.airportCode,
                        ArrivalCode: data.dataList.onds[data.dataList.onds.length - 1].flights[data.dataList.onds[data.dataList.onds.length - 1].flights.length - 1].arrival.airportCode
                    }
                }
            }, common.Travelers(data.dataList, 'RecognizedTravelerList', 'RecognizedTraveler'));
        }())
    };
};
module.exports = ItinReshop;
