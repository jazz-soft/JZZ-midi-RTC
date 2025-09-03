var assert = require('assert');
var JZZ = require('jzz');
require('..')(JZZ);

function Peer() {
  this.other = undefined;
}
Peer.prototype.connect = function(P) {
  this.other = P;
  P.other = this;
};
Peer.prototype.createDataChannel = function() {
  return new Chan();
};
Peer.prototype.addEventListener = function() {
};

function Chan() {
}
Chan.prototype.addEventListener = function() {
};

describe('WebRTC', function() {
  var RTC0 = new JZZ.RTC();
  var RTC1 = new JZZ.RTC('WebRTC1');
  var RTC2 = new JZZ.RTC();

  it('constructor', function() {
    assert.equal(RTC0.pref, 'WebRTC');
    assert.equal(RTC1.pref, 'WebRTC1');
    assert.equal(RTC2.pref, 'WebRTC2');
  });
  it('connect', function() {
    var rtc = new Peer();
    RTC0.connect(rtc);
  });
});
