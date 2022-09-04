import { AppCapture } from 'AppCapture';
import React from 'react';
import { render } from 'react-dom';
import { Anthem, AnthemSingers } from 'tools/anthem/functions';
import Data from 'tools/data';
// import Data from 'tools/data';
import { MainController } from 'tools/MainController';
import { Peers } from 'tools/peers/functions';
import { Penalties } from 'tools/penalties/functions';
import { PenaltyTracker } from 'tools/penaltytracker/functions';
import { Phases } from 'tools/phases/functions';
import { Roster } from 'tools/roster/functions';
import { Scoreboard } from 'tools/scoreboard/functions';
import { GameClock } from 'tools/scoreboard/gameclock';
import { Scorekeeper } from 'tools/scorekeeper/functions';
import { Skaters } from 'tools/skaters/functions';
import { Slideshows } from 'tools/slideshows/functions';
import { Sponsors } from 'tools/sponsors/functions';
import { Teams } from 'tools/teams/functions';
import { UIController } from 'tools/UIController';
import { Videos } from 'tools/videos/functions';
import {App} from './App';
import './index.global.scss';
import './capture.global.scss';
import { CaptureIPC, ControlIPC } from 'tools/ipc';
import { KeyboardController } from 'tools/input/keyinput';
import { GameController } from 'tools/input/gamepad';
import { Capture } from 'tools/capture/functions';
import { Seasons } from 'tools/seasons/functions';
import { PeerManager } from 'tools/PeerManager';
import { setupServer } from 'LocalServer';

const ignore = () => {};
if(document.location.href.endsWith('server=true')) {
    setupServer();
} else {
    UIController.Load().then(ignore).catch(ignore).finally(() => {
        if(document.location.href.endsWith('index.html')) {
        
            Data.Init().then(() => {}).catch(() => {}).finally(async () => {
                try {
                    await Promise.all([
                        AnthemSingers.Load(),
                        Peers.Load(),
                        Penalties.Load(),
                        Phases.Load(),
                        Seasons.Load(),
                        Skaters.Load(),
                        Slideshows.Load(),
                        Sponsors.Load(),
                        Teams.Load(),
                        Videos.Load()
                    ]);
                } catch(er) {
            
                }
            
                try {
                    await Promise.all([
                        Anthem.Load(),
                        PenaltyTracker.Load(),
                        Roster.Load(),
                        Scoreboard.Load(),
                        Scorekeeper.Load()
                    ]);
                } catch(er) {
            
                }
            
                //overrides from files
                const state = MainController.GetState();
                GameClock.set(state.Scoreboard.GameClock?.Hours || 0, state.Scoreboard.GameClock?.Minutes || 0, state.Scoreboard.GameClock?.Seconds || 0, state.Scoreboard.GameClock?.Tenths || 0);

                // const {remote} = require('electron').remote;
                try {
                    const {networkInterfaces} = require('os');
                    let nets:any = networkInterfaces();
                    let localIp:string = '';
                    if(nets) {
                        const items = Object.values(nets);
                        items.forEach(item => {
                            if(Array.isArray(item)) {
                                item.forEach((addr:any) => {
                                    const familyV4Value = typeof addr.family == 'string' ? 'IPv4' : 4;
                                    if(addr.family === familyV4Value && !addr.internal && !localIp) {
                                        localIp = addr.address;
                                    }
                                })
                            }
                        })
                    }
                    
                    if(localIp) {
                        MainController.SetLocalIPAddress(localIp);
                    }
                } catch(er) {
                    
                }

                Capture.UpdateRoster({
                    index:-1,
                    side:'',
                    visible:false
                });
            
                render(<App />, document.getElementById('root'));
            
                setTimeout(() => {
                    Anthem.Init().then(ignore).catch(ignore);
                    Capture.Init().then(ignore).catch(ignore);
                    ControlIPC.Init();
                    Roster.Init().then(ignore).catch(ignore);
                    PenaltyTracker.Init().then(ignore).catch(ignore);
                    Scoreboard.Init().then(ignore).catch(ignore);
                    Scorekeeper.Init().then(ignore).catch(ignore);
        
                    KeyboardController.Init();
                    GameController.Init();

                    //initialize peer manager
                    PeerManager.load();
                    
                }, 1000);
            });
        } else if(document.location.href.endsWith('index.html?capture=true')) {
            document.title = 'RDMGR - Capture Window'
            CaptureIPC.Init();
            render(<AppCapture/>, document.getElementById('root'));
        }
    });
}

