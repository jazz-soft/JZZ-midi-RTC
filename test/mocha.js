var assert = require('assert');
var JZZ = require('jzz');
require('..')(JZZ);

// fake WebRTC connection
function Peer() {
  this.CL = [];
  this.CR = [];
  this.EH = {};
  this.other = undefined;
}
Peer.prototype.connect = function(R) {
  var L = this;
  if (L.other || R.other) throw 'Already connected';
  L.other = R;
  R.other = L;
  var c;
  for (c of L.CL) R.CR.push(c.other);
  for (c of R.CL) L.CR.push(c.other);
  setTimeout(function() {
    L.connected();
    R.connected();
  }, 0);
};
Peer.prototype.connected = function() {
  var f, c;
  if (this.EH['datachannel']) for (f of this.EH['datachannel']) for (c of this.CR) f({ channel: c });
};
Peer.prototype.createDataChannel = function(lab) {
  var c = new Chan(lab);
  c.other = new Chan(lab);
  c.other.other = c;
  this.CL.push(c);
  if (this.other) {
    this.other.CR.push(c.other);
  }
  return c;
};
Peer.prototype.addEventListener = function(evt, fun) {
  // console.log('Peer.addEventListener', evt, fun);
  if (!this.EH[evt]) this.EH[evt] = [];
  this.EH[evt].push(fun);
};

function Chan(lab) {
  this.label = lab;
  this.EH = {};
  this.other = undefined;
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
