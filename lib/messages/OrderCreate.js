'use strict';

var util = require('util');
var common = require('./common');
var OrderCreate = function (data) {
    var Query = common.Travelers(data, 'Passengers', 'Passenger');
    Query.OrderItems = {
        ShoppingResponse: {
            Owner: data.shoppingRS.owner,
            ResponseID: data.shoppingRS.id,
            Offers: {
                Offer: data.shoppingRS.offers.map(function (offer) {
                    return {
                        OfferID: {
                            _Owner: offer.owner || data.shoppingRS.owner,
                            _: offer.id
                        },
                        OfferItems: {
                            OfferItem: offer.items.map(function (item) {
                                return {
                                    OfferItemID: {
                                        _Owner: item.owner || data.shoppingRS.owner,
                                        _: item.id
                                    },
                                    Passengers: {
                                        PassengerReference: item.passenger
                                    }
                                };
                            })
                        }
                    };
                })
            }
        }
    };
    Query.Payments = {
        Payment: {
            Method: {
                PaymentCard: {
                    CardCode: data.payment.card.type,
                    CardNumber: data.payment.card.number,
                    SeriesCode: data.payment.card.series,
                    EffectiveExpireDate: {
                        Effective: data.payment.card.expiration
                    }
                }
            },
            Amount: {
                _Taxable: (!!data.payment.taxable).toString(),
                _: data.payment.amount.toString()
            },
            Payer: {
                Name: {
                    Surname: data.payment.payer.surname,
                    Given: data.payment.payer.given
                },
                Contacts: {
                    Contact: {
                        AddressContact: {
                            Street: data.payment.payer.street,
                            CityName: data.payment.payer.city,
                            PostalCode: data.payment.payer.postalCode,
                            CountryCode: data.payment.payer.country
                        },
                        EmailContact: {
                            Address: data.payment.payer.email
                        }
                    }
                }
            }
        }
    };

    Query.Metadata = common.Metadata(data);

    Query.DataLists = {
        FlightSegmentList: {
        	FlightSegment: data.segments.map(function (segment) {
        		return {
        			_SegmentKey: segment.id,
        			Departure: {
        				AirportCode: segment.departure.code,
        				AirportName: segment.departure.name,
        				Date: segment.departure.date,
        				Time: segment.departure.time
        			},
        			Arrival: {
        				AirportCode: segment.arrival.code,
        				AirportName: segment.arrival.name,
        				Date: segment.arrival.date,
        				Time: segment.arrival.time
        			},
        			MarketingCarrier: {
        				AirlineID: segment.carrier.code,
        				Name: segment.carrier.name,
        				FlightNumber: segment.carrier.number
        			},
        			OperatingCarrier: {
        				AirlineID: segment.carrier.code,
        				Name: segment.carrier.name,
        				FlightNumber: segment.carrier.number
        			},
        			Equipment: {
        				AircraftCode: segment.equipment.code,
        				Name: segment.equipment.name
        			},
        			FlightDetail: {
        				FlightDuration: {
        					Value: segment.duration
        				}
        			}
        		};
        	})
        },
        FlightList: {
        	Flight: data.flights.map(function(flight){
        		return {
        			_FlightKey: flight.id,
        			Journey: {
        				Time: flight.duration
        			},
        			SegmentReferences: flight.segments
        		}
        	})
        },
        OriginDestinationList: {
        	OriginDestination: data.ods.map(function(od){
        		return {
                    _OriginDestinationKey: od.id,
            		DepartureCode: od.origin,
            		ArrivalCode: od.destination,
            		FlightReferences: od.flights
                };
        	})
        }
    };


    return {
        PointOfSale: common.PointOfSale(data),
        Document: common.Document(data),
        Party: common.Party(data, true),
        Query: Query,
    };
};

module.exports = OrderCreate;
