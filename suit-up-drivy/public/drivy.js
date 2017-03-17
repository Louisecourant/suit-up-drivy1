/*eslint-disable space-unary-ops*/
'use strict';

var DRIVY = DRIVY || {};

DRIVY = (function namespace () {
  var MS_PER_DAY = 1000 * 60 * 60 * 24;


  var getCar = function getCar () {
    return {
      'model': document.querySelector('#car .model').value,
      'pricePerDay': document.querySelector('#car .price-by-day').value,
      'pricePerKm': document.querySelector('#car .price-by-km').value
    };
  };

 
  var getDays = function getDays (begin, end) {
    begin = new Date(begin).getTime();
    end = new Date(end).getTime();

    return Math.floor((end - begin) / MS_PER_DAY) + 1;
  };

 
  var discount = function discount (days) {
    if (days > 10) {
      return 0.5;
    }

    if (days > 4) {
      return 0.3;
    }

    if (days > 1) {
      return 0.1;
    }

    return 0;
  };

  
  var rantalCommission = function rantalCommission (price, days) {
    var value = ~~(price * 0.3).toFixed(2);
    var insurance = ~~(value * 0.5).toFixed(2);
    var assistance = 1 * days;

    return {
      'value': value,
      'insurance': insurance,
      'assistance': assistance,
      'drivy': ~~(value - insurance - assistance).toFixed(2)
    };
  };

 
  var rentalPrice = function rentalPrice (car, days, distance) {
    var percent = discount(days);
    var pricePerDay = car.pricePerDay - car.pricePerDay * percent;

    return ~~(days * pricePerDay + distance * car.pricePerKm).toFixed(2);
  };

  var payActors = function payActors (car, begin, end, distance, option) {
    option = option || false;

    var days = getDays(begin, end);
    var price = rentalPrice(car, days, distance);
    var commission = rantalCommission(price, days);
    var deductibleOption = option ? 4 * days : 0;

    var actors = [{
      'who': 'driver',
      'type': 'debit',
      'amount': price + deductibleOption
    }, {
      'who': 'owner',
      'type': 'credit',
      'amount': price - commission.value
    }, {
      'who': 'insurance',
      'type': 'credit',
      'amount': commission.insurance
    }, {
      'who': 'assistance',
      'type': 'credit',
      'amount': commission.assistance
    }, {
      'who': 'drivy',
      'type': 'credit',
      'amount': commission.drivy + deductibleOption
    }];

    return actors;
  };

  return {
    'getCar': getCar,
    'payActors': payActors
  };
}());
