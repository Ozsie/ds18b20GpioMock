# DS18B20 GPIO Mock
[![NPM](https://nodei.co/npm/ds18b20-gpio-mock.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ds18b20-gpio-mock/)

[![Build Status](https://travis-ci.org/Ozsie/ds18b20GpioMock.svg?branch=master)](https://travis-ci.org/Ozsie/ds18b20GpioMock)
[![Coverage Status](https://coveralls.io/repos/github/Ozsie/ds18b20GpioMock/badge.svg?branch=master)](https://coveralls.io/github/Ozsie/ds18b20GpioMock?branch=master)

A DS18B20 module for [GPIO Mock](https://www.npmjs.com/package/gpio-mock).

### Simulating DS18B20 digital thermometer
```
let gpioMock = require('gpio-mock');
let ds18b20 = require('mc-tempsensor');

// Hardware definition for DS18B20;
let f = {
  "behavior": "function",
  "temperature": function() {
    return Math.random() * 100000;
  }
};

gpioMock.start(function(err) {
  gpioMock.addMockHardwareModule('ds18b20', 'ds18b20.js', function(err) {
    if (!err) {
      gpioMock.addMockHardware('ds18b20', '28-800000263717', f, function(err) {
        if (!err) {
          tempsensor.init('28-800000263717');
      
          tempSensor.readAndParse(function(err, data) {
            if (err) {
              // Handle error
            } else {
              console.log('Temperature is ' + data[0].temperature.celcius + ' C');
            }
          });
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
    }
  });
});
```