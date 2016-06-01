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
                                var offerItem = {
                                    OfferItemID: {
                                        _Owner: item.owner || data.shoppingRS.owner,
                                        _: item.id
                                    },
                                    Passengers: {
                                        PassengerReference: item.passenger
                                    }
                                };

                                if (item.associatedServices) {
                                    offerItem.AssociatedServices = {
                                        AssociatedService: item.associatedServices.map(function (service) {
                                            return {
                                                ServiceID: {
                                                    _Owner: service.owner || data.shoppingRS.owner,
                                                    _: service.id
                                                }
                                            };
                                        })
                                    };
                                }

                                return offerItem;
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

    Query.DataLists = {
        FlightSegmentList: {
        	FlightSegment: data.segments.map(function (segment) {
        		return {
        			_SegmentKey: segment.id,
        			Departure: {
        				AirportCode: segment.departure.code,
        				Date: segment.departure.date,
        				Time: segment.departure.time,
                        AirportName: segment.departure.name
        			},
        			Arrival: {
        				AirportCode: segment.arrival.code,
        				Date: segment.arrival.date,
        				Time: segment.arrival.time,
                        AirportName: segment.arrival.name
        			},
        			MarketingCarrier: {
        				AirlineID: segment.marketingCarrier.code,
        				Name: segment.marketingCarrier.name,
        				FlightNumber: segment.marketingCarrier.number
        			},
        			OperatingCarrier: {
        				AirlineID: segment.operatingCarrier.code,
        				Name: segment.operatingCarrier.name,
        				FlightNumber: segment.operatingCarrier.number
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

    if (data.services) {
        Query.DataLists.ServiceList = {
            Service: data.services.map(function (service) {
                return {
                    _ObjectKey: service.key,
                    ServiceID: {
                        _Owner: service.owner || data.shoppingRS.owner,
                        _: service.id
                    },
                    Name: service.name,
                    Encoding: (service.encoding ? {
                        RFIC: {
                            Code: service.encoding
                        }
                    } : ''),
                    Code: service.code,
                    FeeMethod: service.feeMethod,
                    Descriptions: {
                        Description: {
                            Text: service.description,
                            Link: service.media.link,
                            Media: [{
                                ObjectID: service.media.id
                            }, {
                                MediaLink: service.media.link
                            }],
                        }
                    },
                    Settlement: {
                        Method: {
                            Code: service.settlement.code,
                            Definition: service.settlement.definition
                        },
                    },
                    Price: {
                        Total: service.price.total,
                        PassengerReferences: service.price.passengerReference
                    }
                };
            })
        };
    }

    Query.Metadata = common.Metadata(data);

    return {
        PointOfSale: common.PointOfSale(data),
        Document: common.Document(data),
        Party: common.Party(data, true),
        Query: Query,
    };
};

module.exports = OrderCreate;
