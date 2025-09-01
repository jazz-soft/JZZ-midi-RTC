# JZZ-midi-RTC
## MIDI via WebRTC

[![npm](https://img.shields.io/npm/v/jzz-midi-rtc.svg)](https://www.npmjs.com/package/jzz-midi-rtc)
[![npm](https://img.shields.io/npm/dt/jzz-midi-rtc.svg)](https://www.npmjs.com/package/jzz-midi-rtc)
[![build](https://github.com/jazz-soft/JZZ-midi-RTC/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ-midi-RTC/actions)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/JZZ-midi-RTC/badge.svg)](https://coveralls.io/github/jazz-soft/JZZ-midi-RTC)

This module allows two WebRTC peers communicate with each other's MIDI ports.  
And YES, these ports are visible from the Web MIDI API!

If, instead, you are building a client-server application,  
you may want to check https://github.com/jazz-soft/JZZ-midi-WS

## Usage
##### Plain HTML
```html
<script src="JZZ.js"></script>
<script src="JZZ.midi.RTC.js"></script>
//...
```
##### CDN (jsdelivr)
```html
<script src="https://cdn.jsdelivr.net/npm/jzz"></script>
<script src="https://cdn.jsdelivr.net/npm/jzz-midi-rtc"></script>
//...
```
##### CDN (unpkg)
```html
<script src="https://unpkg.com/jzz"></script>
<script src="https://unpkg.com/jzz-midi-rtc"></script>
//...
```
##### CommonJS
```js
var JZZ = require('jzz');
require('jzz-midi-rtc')(JZZ);
//...
```

## Example
```js
var MidiRTC = new JZZ.RTC();
var RTCPC = new RTCPeerConnection();
// ...
// ... boring boilerplate WebRTC code here ...
// ...
MidiRTC.connect(RTCPC);
```

## API
```js
var MidiRTC = new JZZ.RTC(name);
```
Constructor. `name` - name to be used as preffix for remote MIDI ports.
If not set, will be `WebRTC`, `WebRTC1`, `WebRTC2`, etc...

```js
MidiRTC.connect(RTCPC);
```
Connect to WebRTC session. `RTCPC` - a `RTCPeerConnection` object.  
If the previous WebRTC session was closed, MidiRTC can be connected to another session.

```js
MidiRTC.close();
```
Disconnect and close all remote MIDI ports.

```js
MidiRTC.addMidiIn(name, port);
MidiRTC.addMidiOut(name, port);
```
Add MIDI port. `name` - name to bee seen by the remotr peer; `port` - MIDI port (real or virtual).

```js
MidiRTC.removeMidiIn(name);
MidiRTC.removeMidiOut(name);
```
Remove MIDI port.

`{add/remove}Midi{In/Out}(...)` functions can be called before or after the connection is made.


## See also
- [RTC-MIDI-Test](https://github.com/jazz-soft/RTC-MIDI-Test) - MIDI via WebRTC test / demo
- [JZZ-midi-WS](https://github.com/jazz-soft/JZZ-midi-WS) - MIDI via WebSockets
- [JZZ](https://github.com/jazz-soft/JZZ) - MIDI library for Node.js and web-browsers