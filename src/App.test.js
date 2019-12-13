import DataController, {Actions} from 'controllers/DataController';


test('Get Matches', async done => {

  DataController.getStore().dispatch({
    type:Actions.SET_MISC_RECORDS,
    values:{
      APIEndpoint:"http://azddseason15.com/wp-json/rdmgr/v1"
    }
  });

  DataController.loadAPIMatches().then((records) => {
    console.log(records);
    done();
  }).catch(response => {
    console.log(response);
    done();
  })

  //console.log(DataController.GetMiscRecord('APIEndpoint'));

  //done();
});