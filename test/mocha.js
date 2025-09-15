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
Peer.prototype.disconnect = function() {
  var L = this;
  var R = L.other;
  if (!R) throw 'Not connected';
  setTimeout(function() {
    L.disconnected();
    R.disconnected();
  }, 0);
};
Peer.prototype.connected = function() {
  var f, c;
  if (this.EH['datachannel']) for (f of this.EH['datachannel']) for (c of this.CR) f({ channel: c });
  for (c of this.CL) if (c.EH['open']) for (f of c.EH['open']) f();
};
Peer.prototype.disconnected = function() {
  var f, c;
  for (c of this.CL) if (c.EH['close']) for (f of c.EH['close']) f();
  for (c of this.CR) if (c.EH['close']) for (f of c.EH['close']) f();
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
  if (!this.EH[evt]) this.EH[evt] = [];
  this.EH[evt].push(fun);
};

function Chan(lab) {
  this.label = lab;
  this.EH = {};
  this.other = undefined;
}
Chan.prototype.addEventListener = function(evt, fun) {
  if (!this.EH[evt]) this.EH[evt] = [];
  this.EH[evt].push(fun);
};
Chan.prototype.send = function(msg) {
  var self = this;
  //console.log('Chan send:', msg);
  setTimeout(function() {
    if (self.other && self.other.EH['message']) {
      for (var f of self.other.EH['message']) f({ data: msg });
    }
  }, 5);
};

describe('WebRTC', function() {
  var RTC0 = new JZZ.RTC();
  var RTC1 = new JZZ.RTC('WebRTC1');
  var RTC2 = new JZZ.RTC();
  var Peer0 = new Peer();
  var Peer1 = new Peer();
  Peer0.createDataChannel('not MIDI');

  it('constructor', function() {
    assert.equal(RTC0.pref, 'WebRTC');
    assert.equal(RTC1.pref, 'WebRTC1');
    assert.equal(RTC2.pref, 'WebRTC2');
  });
  it('connect', function() {
    RTC0.connect(Peer0);
    RTC1.connect(Peer1);
    Peer0.connect(Peer1);
  });
  it('midi-in', function(done) {
    var widget = new JZZ.Widget();
    RTC0.addMidiIn('Widget', widget);
    RTC0.addMidiIn('Widget', widget);
    RTC2.addMidiIn('Widget', widget);
    setTimeout(function() {
      JZZ().openMidiIn('WebRTC1 - Widget').connect(function() {
        RTC0.removeMidiIn('Widget');
        RTC0.removeMidiIn('Widget');
        done();
      });
      widget.noteOn(0, 'C5');
    }, 20);
  });
  it('midi-out', function(done) {
    var widget = new JZZ.Widget({ _receive: function() {
      RTC0.removeMidiOut('Widget');
      RTC0.removeMidiOut('Widget');
      done();
    } });
    RTC0.addMidiOut('Widget', widget);
    RTC0.addMidiOut('Widget', widget);
    RTC2.addMidiOut('Widget', widget);
    setTimeout(function() {
      JZZ().openMidiOut('WebRTC1 - Widget').noteOn(0, 'C5');
    }, 20);
  });
  it('disconnect', function(done) {
    var widget = new JZZ.Widget();
    RTC1.addMidiIn('Widget', widget);
    RTC1.addMidiOut('Widget', widget);
    setTimeout(function() {
      Peer0.disconnect();
      RTC0.close();
      RTC1.close();
      RTC2.close();
      done();
    }, 20);
  });
});
