var assert = require('assert');
var JZZ = require('jzz');
require('..')(JZZ);

// fake WebRTC connection
function Peer() {
  this.CH = {};
  this.EH = {};
  this.other = undefined;
}
Peer.prototype.connect = function(P) {
  this.other = P;
  P.other = this;
  this.connected();
  P.connected();
};
Peer.prototype.connected = function() {
  if (this.EH['datachannel']) {
  }
};
Peer.prototype.createDataChannel = function(lab) {
  return new Chan(lab);
};
Peer.prototype.addEventListener = function(evt, fun) {
  // console.log('Peer.addEventListener', evt, fun);
  if (!this.EH[evt]) this.EH[evt] = [];
  this.EH[evt].push(fun);
};

function Chan(lab) {
  this.label = lab;
  this.EH = {};
}
Chan.prototype.addEventListener = function(evt, fun) {
  // console.log('Chan.addEventListener', evt, fun);
  if (!this.EH[evt]) this.EH[evt] = [];
  this.EH[evt].push(fun);
};

describe('WebRTC', function() {
  var RTC0 = new JZZ.RTC();
  var RTC1 = new JZZ.RTC('WebRTC1');
  var RTC2 = new JZZ.RTC();
  var RTC3 = new JZZ.RTC();
  var Peer0 = new Peer();
  var Peer1 = new Peer();

  it('constructor', function() {
    assert.equal(RTC0.pref, 'WebRTC');
    assert.equal(RTC1.pref, 'WebRTC1');
    assert.equal(RTC2.pref, 'WebRTC2');
    assert.equal(RTC3.pref, 'WebRTC3');
  });
  it('connect', function() {
    RTC0.connect(Peer0);
    RTC1.connect(Peer1);
    Peer0.connect(Peer1);
  });
});
