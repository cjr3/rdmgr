import React, { CSSProperties } from 'react';
import ScorekeeperController, {Sides} from 'controllers/ScorekeeperController';
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
                <div className="jammers">
                    <Jammer side='A'/>
                    <Jammer side='B'/>
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

        let style:CSSProperties = {
            backgroundImage:`linear-gradient(0deg, rgba(0,0,0,0), ${this.state.Color})`
        };
        
        return (
            <div className={className}>
                <img src={src} alt=""/>
                <label style={style}>{num}</label>
            </div>
        )
    }
}