//import React from 'react';
//import ReactDOM from 'react-dom';
//import App from './App';

//import {it, assertTrue} from 'ts-jest';
//import Installation from 'tools/Installation';

import IO from 'tools/IO';
import ScoreboardController from 'controllers/ScoreboardController';
import ScorekeeperController from 'controllers/ScorekeeperController';
import SlideshowController from 'controllers/SlideshowController';
import RosterController from 'controllers/RosterController';
import CaptureController from 'controllers/CaptureController';

it('Checks save states', async done => {
  let io = new IO();
  io.Start().then(() => {
    setTimeout(() => {
      done();
    }, 3100);
    
    let state = Object.assign({}, CaptureController.getState());
    let index = 0;
    setInterval(() => {
      index++;
      state.className = `class-${index}`;
      CaptureController.SetState(state);
    }, 500);
  });
});

/*
it('check files and filders', async done => {
  const installer = new Installation();
  installer.CheckFiles().then(() => {
    done();
  }).catch(() => {
    done();
  });
});
*/

/*
it('checks the folders', done => {
  const installer = new Installation();
  installer.CheckFolders().then((responses) => {
    let allMade = true;
    responses.forEach((folder) => {
      if(!folder.exists)
        allMade = false;
    })
    assertTrue(allMade);
    done();
  }).catch((er) => {
    done();
  });
});

it('checks the files', done => {
  const installer = new Installation();
  installer.CheckFiles().then((responses) => {
    let allMade = true;
    responses.forEach((folder) => {
      if(!folder.exists)
        allMade = false;
    })
    assertTrue(allMade);
    done();
  }).catch((er) => {
    done();
  });
})
*/

/*
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
*/