import ClockController from 'controllers/ClockController';
import vars from 'tools/vars';

let start = 60;
test('Check clock controller', async done => {
  let jamclock = new ClockController({
    hour:0,
    minute:0,
    second:start,
    max:start,
    status:vars.Clock.Status.Ready,
    onDone:() => {
      done();
    },
    onTick:(hour, minute, second, tenths) => {
      expect(second).toBeLessThan(start)
      start = second;
    },
    onTenths:(hour, minute, second, tenths) => {
      //expect(tenths).toBe(9);
      //done();
    }
  });

  jamclock.run();
}, (start * 1000) + 2000);