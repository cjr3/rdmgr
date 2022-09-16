# rdmgr
Roller Derby Manager (RDMGR), is an A/V production application, built on Electron, React, and TypeScript.

## Peer-to-Peer Networking

To enable Peer-to-Peer networking, you'll need the following
- An available port on your firewall. RDMGR runs a local express server to establish connections from other peers, so pick a port number a high number not likely taken by another application.
- A record in the list of peers (in the config panel) with a host of 127.0.0.1. This will be your computer's peer record.
- Enable networking, which can be found in the config panel.
- At least one additional peer record, with their local ip address and port.
- Each peer record should have a unique name, preferably with only alpha-numerics. This will be their unique ID to connect with, and should match the one the other users have on their computers.

The config panel can be accessed from the lower-right tools icon.

After enabling networking, you must restart RDMGR. You may be prompted to enable firewall access, and you'll need to allow it.

You'll then see a globe icon on the bottom set of icons.
- Click the globe icon to see a panel. At the top is your network ip address and port number.
- Other users can enter this IP address and port to set you up as a peer for them to send/receive data.
- Click "Start Server", and you'll connect to your local server instance.

To connect to a peer, click the globe icon next to the peer, and if they're available, it will light up green. It will also light up green when they connect to you.

To configure which data peers can send/receive, open the config panel, select a peer record, and check the boxes for the applications you want to send/receive.
- Receive: This is application data you're willing to accept from the peer.
- Send: This is application data you'll send to the peer.

It's recommended you select one peer to receive data from for each type of data, but you can send data to multiple peers.

The currently data is
- Scoreboard: All scoreboard related data, except clocks.
- Clocks: Game clock, jam clock, and break clock.
