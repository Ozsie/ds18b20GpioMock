/* jshint node: true */
'use strict';

let fs = require('fs');
let mkdirp = require('mkdirp');

let sysPath = '/sys/bus/w1/devices/';
var mockPath = './sys/bus/w1/devices';

let ds18b20FileContents = '00 11 22 33 44 55 aa bb cc dd : crc=66 YES\n77 88 99 ee ff 00 11 22 33 44 t=';

var ds18b20 = {};

let functionHardware = function() {
  for (var id in ds18b20) {
    var sensor = ds18b20[id];
    if (sensor.stop || sensor.behavior !== 'function') {
      return;
    }
     handleFunctionSensor(id, sensor);
  }
};

let handleFunctionSensor = function(id, sensor) {
  var value = sensor.temperature();
  fs.writeFileSync(mockPath + '/' + id + '/w1_slave', ds18b20FileContents + value);
};

let staticHardware = function() {
  for (var id in ds18b20) {
    var sensor = ds18b20[id];
    if (sensor.stop || sensor.behavior !== 'static') {
      return;
    }
    handleStaticSensor(id, sensor);
  }
};

let handleStaticSensor = function(id, sensor) {
  fs.writeFileSync(mockPath + '/' + id + '/w1_slave', ds18b20FileContents + parseInt(sensor.temperature * 1000));
};

let updateSensors = function(callback) {

  let addW1Slave = function(key, callback) {
    let sensor = ds18b20[key];
    sensor.stop = false;
    mkdirp(mockPath + '/' + key, function(err) {
      if (!err) {
        sensor.added = true;
        if (sensor.behavior === 'external') {
          handleStaticSensor(key, sensor);
        } else if (sensor.behavior === 'function') {
          handleFunctionSensor(key, sensor);
        } else if (sensor.behavior === 'static') {
          handleStaticSensor(key, sensor);
        }
        callback();
      } else {
        callback(err);
      }
    });
  };

  for (var key in ds18b20) {
    if (!ds18b20[key].added) {
      addW1Slave(key, callback);
    }
  }
};

let stop = function() {
  for (var id in ds18b20) {
    var sensor = ds18b20[id];
    sensor.stop = true;
  }
  ds18b20 = {};
};

let add = function(id, sensor, callback) {
  if (ds18b20[id]) {
    callback(new Error("sensor already registered"));
  } else {
    set(id, sensor, callback);
  }
};

let set = function(id, sensor, callback) {
  ds18b20[id] = sensor;
  updateSensors(callback);
};

let remove = function(id, callback) {
  ds18b20[id] = undefined;
  callback();
};

module.exports = {
  functionHardware: functionHardware,
  staticHardware: staticHardware,
  stop: stop,
  add: add,
  set: set,
  remove: remove,
  sysPath: sysPath,
  mockPath: mockPath
};