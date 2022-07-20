import keycodes from "tools/keycodes";
import { Scoreboard } from "tools/scoreboard/functions";
import { ScoreboardStatus, ScoreboardTeamStatus } from "tools/vars";

class Controller
{
    Init = () => {
        try {
            if(window && window.addEventListener) {
                window.addEventListener('keyup', this.onKeyUp);
            }
        } catch(er) {

        }
    }

    protected onKeyUp = async (ev:KeyboardEvent) => {
        // console.log(ev);
        switch(ev.keyCode) {
            //toggle jam clock
            case keycodes.SPACEBAR :
            case keycodes.ENTER :
                Scoreboard.ToggleJamClock();
            break;

            //toggle break clock
            //call official timeout
            case keycodes.UP :
                if(ev.ctrlKey) {
                    Scoreboard.Stop();
                    Scoreboard.SetStatus(ScoreboardStatus.TIMEOUT);
                } else {
                    Scoreboard.ToggleGameClock();
                }
            break;

            //toggle break clock
            //call injury timeout
            case keycodes.DOWN :
                if(ev.ctrlKey) {
                    Scoreboard.Stop();
                    Scoreboard.SetStatus(ScoreboardStatus.INJURY);
                } else {
                    Scoreboard.ToggleBreakClock();
                }
            break;

            //increase / decrease left-side score
            case keycodes.LEFT :
                if(ev.shiftKey) {
                    if(!Scoreboard.DecreaseTeamJamPoints('A', 1)) {
                        Scoreboard.DecreaseTeamScore('A', 1);
                    }
                } else {
                    if(!Scoreboard.IncreaseTeamJamPoints('A', 1))
                        Scoreboard.IncreaseTeamScore('A', 1);
                }
            break;

            //toggle left-side jammer status
            case keycodes.Q :
                if(ev.shiftKey)
                    Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.POWERJAM);
                else {
                    Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.LEADJAM);
                }
                Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.NORMAL);
            break;

            //toggle left-side timeout / challenge status
            case keycodes.OPENBRACKET :
                if(ev.shiftKey)
                    Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.CHALLENGE)
                else
                    Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.TIMEOUT)
                Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.NORMAL);
            break;

            //increase / decrease right-side score
            case keycodes.RIGHT :
                if(ev.shiftKey) {
                    if(!Scoreboard.DecreaseTeamJamPoints('B', 1))
                        Scoreboard.DecreaseTeamScore('B', 1);
                } else {
                    if(!Scoreboard.IncreaseTeamJamPoints('B', 1))
                        Scoreboard.IncreaseTeamScore('B', 1);
                }
            break;

            //toggle right-side jammer status
            case keycodes.W :
                if(ev.shiftKey)
                    Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.POWERJAM)
                else
                    Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.LEADJAM)
                Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.NORMAL);
            break;

            //toggle right-side timeout / challenge status
            case keycodes.CLOSEBRACKET :
                if(ev.shiftKey)
                    Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.CHALLENGE)
                else
                    Scoreboard.SetTeamStatus('B', ScoreboardTeamStatus.TIMEOUT);
                
                Scoreboard.SetTeamStatus('A', ScoreboardTeamStatus.NORMAL);
            break;

            case keycodes.A :
                Scoreboard.ToggleConfirmStatus();
            break;

            case keycodes.ADD :
            case keycodes.EQUAL :
                Scoreboard.IncreaseJamCounter();
            break;

            case keycodes.SUBTRACT :
            case keycodes.DASH :
                Scoreboard.DecreaseJamCounter();
            break;

            case keycodes.P :
                if(ev.shiftKey)
                    Scoreboard.PreviousPhase();
                else
                    Scoreboard.NextPhase();
            break;

            default :

            break;
        }
    }
}

const KeyboardController = new Controller();
export {KeyboardController};