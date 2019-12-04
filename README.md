## Roller Derby Manager (RDMGR)

RDMGR is a peer-to-peer A/V production application for Roller Derby. It's written in React, Typescript, and Node.js, packaged under Electron. You can support the development of this software at [patreon.com/rollerderby](https://patreon.com/rollerderby) .

## Features
- Scoreboard
- Capture Window
- Chat
- Media Queue
- Penalty Tracker
- Raffle Tickets
- Roster
- Scorekeeper
- Slideshows
- Video
- REST APIs
- Peer-to-peer networking (using peerjs).
- Camera

### Scoreboard
- Simple UI for controlling the flow of the game.
- Point-and-click controls that work well with touch screens, too.
- Keyboard and Game Controller mappings.
- Team score, name, color, jam points, timeouts, challenges, and status.
- Game Clock, Break Clock, and Jam Clock
- Phase / Quarter control
- Game Status: Official Timeout, Injury, Official Review, Upheld, and Overturned
- Easy team selection, with board and roster reset.
- Jam reset (according to RDCL rules)

### Capture Window

The Capture Window is what fans see on projectors and monitors. Since it's a second window, you'll ideally place it on an extended desktop (two or more displays). Furthermore, using the camera and scorebanner, you can capture the window to live-stream your bouts.

### Media Queue

The Media Queue is essentially a playlist of videos, slideshows, and national anthem singer screens. It can be set to loop, so you can play videos as fans arrive, or during breaks.

#### Sponsors

Most leagues have sponsors, and you can create a Slideshow for sponsor slides (as images) that loops indefinitely. Furthermore, you can include a scoreboard ticker at the bottom of the screen.

### Penalty Tracker

You can assign penalties to skaters, to display a list to fans, and scorekeepers in the booth.

### Roster

Use the Roster to organize the skaters on the Scorekeeper, Penalty Tracker, and intros.

### Scorekeeper

The Scorekeeper lets you place the skaters into positions. Jammer photos can also be displayed on the Capture Window, along with their jersey # and team color.

The Scorekeeper has two decks: on-track, and on-deck (for skaters in the next jam). It also has an option to signal a 'Star Pass', switching the Jammer and the Pivot.

### Raffle Tickets

RDMGR makes it easy to display raffle ticket numbers to fans (up to three). It's available in the Media Queue, and has 0-9 digit buttons (or text entry).

### Slideshows (and Sponsors)

A big part of sports A/V production is displaying to fans great imagery, during introductions, and for sponsor advertisements. An automated slideshow for sponsors can also be run in the background, and is hidden during bout production phases, such as playing videos, team introductions, and when the jam clock runs.

### Video

No A/V production would be complete without video presentation. As part of the Media Queue, a user can queue up videos to play on the capture window, for fans at the venue, and fans at home during a live-stream.

### REST APIs

RDMGR is a peer-to-peer application, and relies on real-time communication between peers for state control. However, each peer has an API, so developers can create applications that can control various aspects of the game.

For example, you can get the state of the scoreboard, and create an application that displays what you want, and how you want it! (Of course, nothing beats real-time when it comes to clocks!)

Each client (or operator) has their own API, which uses Express to handle GET/POST/PUT/PURGE/DELETE requests. Some API calls include images or videos, which effectively turns each client into a media server. 

For example, you can stream video from a client by creating a video element in HTML, and pointing its src to http://127.0.0.1:12345/api/video/myvideo.mp4

## Architecture

RDMGR is an Electron App, and thus runs on Node.js and Chromium. It was built using TypeScript, React, and Node.js, for rapid development, code management, and simplicity. 

State management is done through Redux. When combined with WebRTC, states can be updated between peers to affect only those parts they wish to keep updated. This allows separation of concerns in the code, and separation of concerns in the user roles (ie, one Scoreboard, one Penalty Tracker, one Scorekeeper, etc).

This is accomplished with a big thanks to the peerjs library: https://github.com/peers/peerjs/

#### Notes

- Built for Windows only (so far), and developed on Windows 7 x64
- If running on Windows 10, and streaming with OBS, you may need to run RDMGR in compatability mode for Windows 7.
- The base folder location is hard-coded (for now) between production and development.