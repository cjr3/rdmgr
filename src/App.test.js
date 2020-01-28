//import {SetEndpoint, SetAuthEndpoint} from './controllers/api/functions';
//import {RecordSavers} from './controllers/functions.io';
import ScoreboardController from './controllers/ScoreboardController';
import TeamsController from './controllers/TeamsController';
import {StateSavers} from './controllers/functions.io';

test('Increase team score by one', async (done) => {
  StateSavers.SB.Start();
  TeamsController.Load();
  let change = ScoreboardController.Subscribe(() => {
    change();
    let teamB = TeamsController.GetRecord(4);
    let teamA = TeamsController.GetRecord(3);
    ScoreboardController.SetTeams(teamA, teamB, true, false);
    setTimeout(done, 3000);
  });
  setTimeout(() => {
    ScoreboardController.Load();
  }, 1000);
});

//SetEndpoint('http://azddseason15.com/wp-json/rdmgr/v1');
//SetAuthEndpoint('http://azddseason15.com/wp-json/jwt-auth/v1/token');

/*
test('Get schedule', async (done) => {
  RecordSavers[StandingsCaptureController.Key].Start();
  let controller = StandingsCaptureController;
  controller.Subscribe(() => {
    //console.log(controller.Get());
    setTimeout(done, 3000);
    //done();
  });
  controller.Load();
});
*/