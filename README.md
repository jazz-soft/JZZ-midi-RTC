# JZZ-midi-RTC
## MIDI via WebRTC

coming soon...

[![npm](https://img.shields.io/npm/v/jzz-midi-rtc.svg)](https://www.npmjs.com/package/jzz-midi-rtc)
[![npm](https://img.shields.io/npm/dt/jzz-midi-rtc.svg)](https://www.npmjs.com/package/jzz-midi-rtc)
[![build](https://github.com/jazz-soft/JZZ-midi-RTC/actions/workflows/build.yml/badge.svg)](https://github.com/jazz-soft/JZZ-midi-RTC/actions)
[![Coverage Status](https://coveralls.io/repos/github/jazz-soft/JZZ-midi-RTC/badge.svg)](https://coveralls.io/github/jazz-soft/JZZ-midi-RTC)

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
var MidiRTC = new JZZ.RTC();
```
Constructor.

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