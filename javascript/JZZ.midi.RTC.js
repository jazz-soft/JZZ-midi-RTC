(function(global, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory.RTC = factory;
    module.exports = factory;
  }
  else if (typeof define === 'function' && define.amd) {
    define('JZZ.midi.RTC', ['JZZ'], factory);
  }
  else {
    factory(JZZ);
  }
})(this, function(JZZ) {

  /* istanbul ignore next */
  if (JZZ.RTC) return;

  function connect(rtc) {
    var self = new JZZ.lib.R();
    var ins = {};
    var outs = {};
    var inputs = [];
    var outputs = [];

    const channel = rtc.createDataChannel('MIDI');
    channel.addEventListener('open', function(evt) {
      channel.send("Hi you!");
    });
    channel.addEventListener('message', function(evt) {
      console.log('local:', evt.data);
    });

    rtc.addEventListener('datachannel', function(evt) {
      const channel = evt.channel;
      if (channel.label != 'MIDI') return;
      channel.addEventListener('open', function(evt) {
        channel.send("Hi back!");
      });
      channel.addEventListener('message', function(evt) {
        console.log('remote:', evt.data);
      });
    });

    self.addMidiIn = function(name, widget) {
    };
    self.addMidiOut = function(name, widget) {
    };
    self.removeMidiIn = function(name) {
    };
    self.removeMidiOut = function(name) {
    };
    return self._thenable();
  }

  function _encode(m) {
    var x = { midi: m.splice(0, m.length) };
    var k = Object.keys(m);
    for (var n = 0; n < k.length; n++) if (k[n] != 'length' && k[n] != '_from') x[k[n]] = m[k[n]];
    return x;
  }
  function _decode(x) {
    var m = new JZZ.MIDI(x.midi);
    var k = Object.keys(x);
    for (var n = 0; n < k.length; n++) if (k[n] != 'midi') m[k[n]] = k[k[n]];
    return m;
  }

  JZZ.RTC = {
    connect: connect,
    decode: _decode,
    encode: _encode
  };
});
