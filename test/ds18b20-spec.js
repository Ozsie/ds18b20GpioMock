'use strict';

let chai = require('chai');
let fs = require('fs');
let expect = chai.expect; // we are using the "expect" style of Chai
let ds18b20 = require('../ds18b20');

describe('ds18b20', function() {

  it('adding mock hardware should result in callback with no error', function(done) {
    ds18b20.add('1', {behavior: 'static', temperature: 1}, function(err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it('adding mock hardware with existing id should result in callback with error', function(done) {
    ds18b20.add('1', {behavior: 'static', temperature: 1}, function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('remove mock hardware should result in callback with no error', function(done) {
    ds18b20.remove('1', function(err) {
      expect(err).to.not.exist;
      done();
    });
  });

  it('stopping should remove all hardware', function(done) {
    ds18b20.add('1', {behavior: 'static', temperature: 1}, function(err) {
      expect(err).to.not.exist;
      ds18b20.stop();
      ds18b20.add('1', {behavior: 'static', temperature: 1}, function(err) {
        expect(err).to.not.exist;
        done();
      });
    });
  });

  it('calling functionHardware should update hardware', function(done) {
    ds18b20.add('2', {behavior: 'function', temperature: function() { return Math.random(); }}, function(err) {
      expect(err).to.not.exist;
      fs.readFile('sys/bus/w1/devices/2/w1_slave', 'utf8', function(err, tempData) {
        expect(err).to.not.exist;
        ds18b20.functionHardware();
        fs.readFile('sys/bus/w1/devices/2/w1_slave', 'utf8', function(err, tempDataAfterFunctionHardware) {
          expect(err).to.not.exist;
          expect(tempData).to.not.equal(tempDataAfterFunctionHardware);
          done();
        });
      });
    });
  });

  it('calling staticHardware should update hardware', function(done) {
    fs.writeFile('sys/bus/w1/devices/1/w1_slave',
                 '00 11 22 33 44 55 aa bb cc dd : crc=66 YES\n77 88 99 ee ff 00 11 22 33 44 t=52000',
                 function(err) {
      expect(err).to.not.exist;
      ds18b20.staticHardware();
      fs.readFile('sys/bus/w1/devices/1/w1_slave', 'utf8', function(err, tempDataAfterStaticHardware) {
        expect(err).to.not.exist;
        expect(tempDataAfterStaticHardware).to.not.equal('00 11 22 33 44 55 aa bb cc dd : crc=66 YES\n77 88 99 ee ff 00 11 22 33 44 t=12000');
        done();
      });
    });
  });
});