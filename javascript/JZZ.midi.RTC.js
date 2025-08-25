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

  function RTC() {
    this.ins = {};
    this.outs = {};
    this.inputs = [];
    this.outputs = [];
  }

  RTC.prototype.connect = function(rtc) {
    var self = this;
    var chan = rtc.createDataChannel('MIDI');
    this.chan = chan;
    chan.addEventListener('open', function(evt) {
      _send(self, _info(self));
    });
    chan.addEventListener('close', function(evt) {
      self.chan = undefined;
    });
    chan.addEventListener('message', function(evt) {
      try {
        var x = JSON.parse(evt.data);
        if (x.midi) {
          if (self.outs[x.id]) self.outs[x.id].send(_decode(x.midi));
        }
      }
      catch(e) {/**/}
    });
    rtc.addEventListener('datachannel', function(evt) {
      const channel = evt.channel;
      if (channel.label != 'MIDI') return;
      channel.addEventListener('open', function(evt) {
        //channel.send("Hi back!");
      });
      channel.addEventListener('message', function(evt) {
        console.log(evt.data);
      });
    });
  };

  RTC.prototype.close = function() {
  };

  RTC.prototype.addMidiIn = function(name, widget) {
    if (this.ins[name]) return;
    this.ins[name] = widget;
    this.inputs.push(name);
    var self = this;
    widget.connect(function(msg) {
      _send(self, JSON.stringify({ id: name, midi: _encode(msg) }));
    });
    _send(this, _info(this));
  };
  RTC.prototype.addMidiOut = function(name, widget) {
    if (this.outs[name]) return;
    this.outs[name] = widget;
    this.outputs.push(name);
    _send(this, _info(this));
  };
  RTC.prototype.removeMidiIn = function(name) {
    var n = this.inputs.indexOf(name);
    if (n != -1) {
      this.inputs.splice(n, 1);
      this.ins[name].disconnect();
      delete this.ins[name];
      _send(this, _info(this));
    }
  };
  RTC.prototype.removeMidiOut = function(name) {
    var n = this.outputs.indexOf(name);
    if (n != -1) {
      this.outputs.splice(n, 1);
      this.outs[name].disconnect();
      delete this.outs[name];
      _send(this, _info(this));
    }
  };
  function _add(a, x) {
    for (var n = 0; n < a.length; n++) if (a[n] == x) return a;
    a.push(x);
    return a;
  }
  function _remove(a, x) {
    var v = [];
    for (var n = 0; n < a.length; n++) if (a[n] != x) v.push(x);
    return v;
  }
  function _info(self) {
    return JSON.stringify({ info: { inputs: self.inputs, outputs: self.outputs }});
  }
  function _send(self, msg) { if (self.chan) self.chan.send(msg); }
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
  function _diff(a, b) {
    var i, aa = [], bb = [];
    for (i = 0; i < a.length; i++) if (!b.includes(a[i])) aa.push(a[i]);
    for (i = 0; i < b.length; i++) if (!a.includes(b[i])) bb.push(b[i]);
    return [aa, bb];
  }

  JZZ.RTC = RTC;
});
