import React, { CSSProperties } from 'react';
import ScorekeeperController, {Sides, SScorekeeperTeamDeck, Positions} from 'controllers/ScorekeeperController';
import ScoreboardController from 'controllers/ScoreboardController';
import cnames from 'classnames';
import './css/CaptureScorekeeper.scss';
import ScorekeeperCaptureController from 'controllers/capture/Scorekeeper';
import { Unsubscribe } from 'redux';
import { AddMediaPath } from 'controllers/functions';
import { SkaterRecord } from 'tools/vars';

/**
 * Component for displaying Scorekeeper elements on the capture window.
 */
export default class CaptureScorekeeper extends React.Component<any, {
    Shown:boolean;
    className:string;
}> {
    /**
     * State
     */
    readonly state = {
        Shown:ScorekeeperCaptureController.GetState().Shown,
        className:ScorekeeperCaptureController.GetState().className
    }
    
    protected remoteCapture?:Unsubscribe;

    /**
     * 
     * @param props
     */
    constructor(props) {
        super(props);
        this.updateCapture = this.updateCapture.bind(this);
    }

    protected updateCapture() {
        this.setState({
            Shown:ScorekeeperCaptureController.GetState().Shown,
            className:ScorekeeperCaptureController.GetState().className,
        });
    }

    /**
     * Start listeners
     */
    componentDidMount() {
        this.remoteCapture = ScorekeeperCaptureController.Subscribe(this.updateCapture);
    }

    /**
     * Close listeners
     */
    componentWillUnmount() {
        if(this.remoteCapture)
            this.remoteCapture();
    }

    /**
     * Renders the component
     */
    render() {
        let className:string = cnames('capture-scorekeeper', this.state.className, {
            shown:(this.state.Shown)
        });

        return (
            <div className={className}>
                <CaptureScorekeeperScreen/>
                <div className="popup">
                    <div className="jammers">
                        <Jammer side='A'/>
                        <Jammer side='B'/>
                    </div>
                </div>
            </div>
        );
    }
}

class Jammer extends React.PureComponent<{
    side:Sides
}, {
    Skater:SkaterRecord|null;
    Logo:string;
    Color:string;
    Shown:boolean;
}> {
    readonly state = {
        Skater:ScorekeeperController.GetState().TeamA.Track.Jammer,
        Logo:'',
        Color:'#000000',
        Shown:false
    }

    protected remoteScorekeeper?:Unsubscribe;
    protected remoteScoreboard?:Unsubscribe;

    protected Timer:any = 0;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        if(this.props.side == 'A') {
            this.state.Skater = ScorekeeperController.GetState().TeamA.Track.Jammer;
            this.state.Logo = ScoreboardController.GetState().TeamA.Thumbnail;
            this.state.Color = ScoreboardController.GetState().TeamA.Color;
        } else {
            this.state.Skater = ScorekeeperController.GetState().TeamB.Track.Jammer;
            this.state.Logo = ScoreboardController.GetState().TeamB.Thumbnail;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    /**
     * When the jammer position is already set, and the incoming jammer position
     * is empty (null), then we need to delay updating the image
     */
    protected async updateScorekeeper() {
        let skater:SkaterRecord;
        if(this.props.side === 'A') {
            skater = ScorekeeperController.GetState().TeamA.Track.Jammer;
        } else {
            skater = ScorekeeperController.GetState().TeamB.Track.Jammer;
        }

        try {clearTimeout(this.Timer);} catch(er) {}
        if(skater == null) {
            this.setState({
                Shown:false
            }, () => {
                this.Timer = setTimeout(() => {this.setState({Skater:null});}, 2000);
            });
        } else {
            this.setState({
                Skater:skater,
                Shown:true
            });
        }
    }

    protected updateScoreboard() {
        if(this.props.side == 'A') {
            this.setState({
                Logo:ScoreboardController.GetState().TeamA.Thumbnail,
                Color:ScoreboardController.GetState().TeamA.Color
            });
        } else {
            this.setState({
                Logo:ScoreboardController.GetState().TeamB.Thumbnail,
                Color:ScoreboardController.GetState().TeamB.Color
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
    }

    render() {
        let className:string = cnames('skater', {shown:(this.state.Shown)});
        let src:string = '';
        let num:string = '';
        if(this.state.Skater) {
            src = AddMediaPath(this.state.Skater.Thumbnail);
            if(!src)
                src = AddMediaPath(this.state.Logo);
            num = this.state.Skater.Number;
        } else if(this.state.Shown) {
            src = AddMediaPath(this.state.Logo);
        }
        
        return (
            <div className={className}>
                <img src={src} alt=""/>
                <label>{num}</label>
            </div>
        )
    }
}

class CaptureScorekeeperScreen extends React.PureComponent<any, {
    TrackA:SScorekeeperTeamDeck;
    TrackB:SScorekeeperTeamDeck;
    ColorA:string;
    ColorB:string;
}> {
    readonly state = {
        TrackA:ScorekeeperController.GetState().TeamA.Track,
        TrackB:ScorekeeperController.GetState().TeamB.Track,
        ColorA:ScoreboardController.GetState().TeamA.Color,
        ColorB:ScoreboardController.GetState().TeamB.Color
    }

    protected remoteScoreboard?:Unsubscribe;
    protected remoteScorekeeper?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        this.updateScoreboard = this.updateScoreboard.bind(this);
    }

    protected updateScorekeeper() {
        this.setState({
            TrackA:ScorekeeperController.GetState().TeamA.Track,
            TrackB:ScorekeeperController.GetState().TeamB.Track
        });
    }

    protected updateScoreboard() {
        this.setState({
            ColorA:ScoreboardController.GetState().TeamA.Color,
            ColorB:ScoreboardController.GetState().TeamB.Color
        });
    }

    componentDidMount() {
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
    }

    componentWillUnmount() {
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();

        if(this.remoteScoreboard)
            this.remoteScoreboard();
    }

    render() {
        return (
            <div className="screen">
                <div className="team team-a">
                    <SkaterScreen side='A' position='Jammer'/>
                    <SkaterScreen side='A' position='Pivot'/>
                    <SkaterScreen side='A' position='Blocker1'/>
                    <SkaterScreen side='A' position='Blocker2'/>
                    <SkaterScreen side='A' position='Blocker3'/>
                </div>
                <div className="team team-b">
                    <SkaterScreen side='B' position='Jammer'/>
                    <SkaterScreen side='B' position='Pivot'/>
                    <SkaterScreen side='B' position='Blocker1'/>
                    <SkaterScreen side='B' position='Blocker2'/>
                    <SkaterScreen side='B' position='Blocker3'/>
                </div>
            </div>
        );
    }
}

class SkaterScreen extends React.PureComponent<{
    side:Sides;
    position:Positions;
}, {
    Skater:any;
    Logo:string;
    Color:string;
    Shown:boolean;
}> {
    readonly state = {
        Skater:null,
        Logo:ScoreboardController.GetState().TeamA.Thumbnail,
        Color:ScoreboardController.GetState().TeamA.Color,
        Shown:false
    }

    protected Timer:any = 0;
    
    protected remoteScoreboard?:Unsubscribe;
    protected remoteScorekeeper?:Unsubscribe;

    constructor(props) {
        super(props);
        this.updateScoreboard = this.updateScoreboard.bind(this);
        this.updateScorekeeper = this.updateScorekeeper.bind(this);
        if(this.props.side == 'B') {
            this.state.Logo = ScoreboardController.GetState().TeamB.Thumbnail;
            this.state.Color = ScoreboardController.GetState().TeamB.Color;
        }
    }

    protected updateScorekeeper() {
        try {clearTimeout(this.Timer);} catch(er) {}
        let skater:any = ScorekeeperController.GetState().TeamA.Track[this.props.position];
        if(this.props.side == 'B') {
            skater = ScorekeeperController.GetState().TeamB.Track[this.props.position];
        }

        if(!skater && this.state.Skater) {
            this.setState({
                Shown:false
            }, () => {
                this.Timer = setTimeout(() => {
                    let skater:any = ScorekeeperController.GetState().TeamA.Track[this.props.position];
                    if(this.props.side == 'B') {
                        skater = ScorekeeperController.GetState().TeamB.Track[this.props.position];
                    }
                    this.setState({Skater:skater})
                }, 1000);
            });
        } else {
            this.setState({Skater:skater, Shown:(skater)});
        }
    }

    protected updateScoreboard() {
        if(this.props.side === 'A') {
            this.setState({
                Logo:ScoreboardController.GetState().TeamA.Thumbnail,
                Color:ScoreboardController.GetState().TeamA.Color
            });
        } else if(this.props.side == 'B') {
            this.setState({
                Logo:ScoreboardController.GetState().TeamB.Thumbnail,
                Color:ScoreboardController.GetState().TeamB.Color
            });
        }
    }

    componentDidMount() {
        this.remoteScoreboard = ScoreboardController.Subscribe(this.updateScoreboard);
        this.remoteScorekeeper = ScorekeeperController.Subscribe(this.updateScorekeeper);
        this.updateScorekeeper();
    }

    componentWillUnmount() {
        if(this.remoteScoreboard)
            this.remoteScoreboard();
        if(this.remoteScorekeeper)
            this.remoteScorekeeper();
    }

    render() {
        let className:string = cnames('skater', {
            shown:(this.state.Shown)
        });

        let style:CSSProperties = {};
        if(this.state.Color) {
            style.backgroundImage = `linear-gradient(#000, ${this.state.Color})`;
        }

        let num:string = '';
        let src:string = '';
        let skater:any = this.state.Skater;

        if(skater && skater.Number)
            num = skater.Number;

        if(skater && skater.Thumbnail)
            src = AddMediaPath(skater.Thumbnail);
        else if(this.state.Logo)
            src = AddMediaPath(this.state.Logo);

        return (
            <div className={className} style={style}>
                <div className="thumbnail">
                    <img src={src} alt=""/>
                </div>
                <div className="num">{num}</div>
            </div>
        )
    }
}

function _SkaterScreen(props:{record:any, color:string}) {

    let style:CSSProperties = {
        backgroundImage:'none'
    };

    if(props.color) {
        style.backgroundImage = `linear-gradient(#000, ${props.color})`;
    }

    if(!props.record) {
        return (
            <div className="skater no-skater" style={style}>
                <div className="thumbnail"></div>
                <div className="num"></div>
            </div>
        );
    }

    let skater:SkaterRecord = props.record;

    let src:string = '';
    if(skater.Thumbnail) {
        src = AddMediaPath(skater.Thumbnail);
    }
    
    return (
        <div className="skater" style={style}>
            <div className="thumbnail">
                <img src={src} alt=""/>
            </div>
            <div className="num">
                {skater.Number}
            </div>
        </div>
    );
}