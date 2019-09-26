## Roller Derby Manager (RDMGR)

RDMGR is a peer-to-peer audio/video production application targeted to Banked Track Roller Derby. It's written in React, TypeScript, and Node.js, and packaged under Electron. 

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
- Simple UI, for controlling the flow of the game.
- Point-and-click controls that work well with touch screens, too.
- Keyboard mappings
- Team score, name, color, jam points, timeouts, challenges, and status.
- Game Clock, Break Clock, and Jam Clock
- Phase / Quarter control
- Game Status: Official Timeout, Injury, Official Review, Upheld, and Overturned
- Easy team selection, with board Reset options.
- Jam reset (according to RDCL rules)

### Capture Window

The capture window is what is displayed to fans, or used for capturing the camera for live-streaming. The benefit of using the Capture Window is that the presentation to fans looks better than the control form used by most roller derby leagues, thus providing a better experience and improved, professional presentation.

The Capture Window can also be used for live-streaming. All animations, overlays, etc., such as the game score, are contained within, and therefore avoid the need to use filters and masks in streaming software such as OBS. Fans watching at home therefore get a greater experience of the game.

### Chat

The chat application allows operators to communicate through the peer-to-peer network. Since it's just text, this is very low bandwidth, even when connecting 5+ devices.

### Media Queue

The Media Queue allows for the creation of putting videos and slideshows into a queue, and transitioning from one to the next seamlessly. For example, an operator can queue up a introductory video, and as soon as that video is complete, the slideshow for a team introduction is displayed. This creates a better experience, and allows the operator to prepare their presentation flow ahead of time.

The Media Queue can also be set to loop, so if you have highlight reels, you can queue those videos to loop and play as fans are arriving for the bout. It also works in combination with slideshows, so you can provide a mix of slideshows and videos to loop and play through automatically.

#### Sponsors

The Media Queue also has a component for running a sponsor slideshow, and a scoreboard ticker at the bottom of the capture window. This keeps sponsors happy with their advertisements, and fans informed of those sponsors, plus the state of the game.

### Penalty Tracker

The Penalty Tracker is used to assign penalties to each team. The app comprises four major parts: Team A (left side), Team B (right side), Penalty Codes, and penalty box. Built with touch in mind, a user simply needs to click (or touch) the skater's number, then the penalty codes, to add them to the penalty box. Finally, the penalty tracker submits the changes, and updates listening peers. (Ie, displays the penalties to fans and scorekeepers.)

### Roster

The Roster application allows users to assign skaters to the current teams. Skaters for teams can be automatically loaded, if they've been assigned to one of the two teams on the scoreboard. The roster updates the skaters available on the Penalty Tracker and the Scorekeeper

### Scorekeeper

Fans watching the live stream at home enjoy knowing who is jamming. The scorekeeper app was built (again, with touch/tablet in mind) to make it easy for an operator to record the jammers on the track. The Capture Window can also display the profile picture, and jersey number, of the jammers.

#### Decks

Each team is assigned two decks on the scorekeeper: On-Track, and On-Deck. This allows the scorekeeper to assign a Jammer, Pivot, and three blockers, to each deck, for a total of 10 positions on the team (and 20 total for the jam). A simple button press shifts the skaters from one deck to the next: for example, after a jam, the operator can click the shift button, and the on-track skaters are unassigned, and the on-deck skaters are assigned as the on-track skaters.

#### Star-Pass

A star-pass is when the jammer passes their helmet cover to the pivot, thus changing roles. The scorekeeper has a button that makes it easy to swap the on-track jammer and pivot.

### Raffle Tickets

A simple interface for entering and displaying raffle ticket numbers to fans. It's available under the MediaQueue, and has a simple entry for digits 0-9, a maximum of three tickets (which cycle through when a new number is added), and an option to show/hide the display on the Capture Window.

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

State management is done through Redux, using controllers. When combined with P2P real-time communication, states can be updated between peers to affect only those parts they wish to keep updated. This allows separation of concerns in the code, and separation of concerns in the user roles.

Utilizing WebRTC, with the peerjs library, allows for state to be updated between peers in real-time. This is crucial for game flow where clocks need to be 100% accurate to players and referees. A scenario that has been tested, and works over Lan and Wi-Fi, is sending the scoreboard state to seven listening peers - each receiving the state in real-time, so clocks, scores, and other stats, are constantly synced up.

#### Redux Controllers

Basically put, a Redux Controller (to me at least), is a constant with methods and properties that abstract the redux store and state. This enables me (the developer) to have a single point of entry into state management, thus allowing for easier management of code.

The controllers each contain their own API, again, for a separation of concerns. For example, the Raffle controller can be accessed with /api/raffle, and allows developers to add/remove/purge tickets, and show/hide them on the screen. In essence, you can create a small application just for displaying raffle ticket numbers to fans.

### Purpose

RDMGR was created to bring professional level audio/video production to banked track roller derby. The sport has become a source for women looking to improve their lives through athletics, and I feel it's one way to give my best to a community that I've personally seen transform women into confident leaders of their own lives.

#### Notes

- Built for Windows only (so far), and developed on Windows 7 x64
- If running on Windows 10, and streaming with OBS, you may need to run RDMGR in compatability mode for Windows 7.
- The base folder location is hard-coded (for now) between production and development.

#### Demonstration Purposes

This repo is private, and was made after I (almost) lost all the source code due to a Hard Drive failure. (Thankfully, I didn't disable the Developer Tools in the production release, and was able to extract most of the code from Electron's inspection tools, saving my years of work.)

I've published it here more so for demonstration purposes, to potential clients and employers seeking my services.