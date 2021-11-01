import React from 'react';
import classNames from "classnames"
const path = require('path');
const basepath = path.join(process.env.NODE_ENV === 'development' ? '' : process.resourcesPath, 'images');

interface Props extends React.HTMLProps<HTMLButtonElement> {
    active?:boolean;
    asButton?:boolean;
}

const Main:React.FunctionComponent<Props> = props => {
    const {type, children, active, asButton, ...rprops} = {...props}
    return <button
        onContextMenu={ev => {
            ev.stopPropagation();
            ev.preventDefault();
        }}
        {...rprops}
        className={classNames('icon', rprops.className, {
            active:active,
            asButton:asButton
        })}>
        {children}
    </button>
};

export const Icon2x:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, '2x.png')} alt=''/>{props.children}</Main>;
export const IconAlphaSort:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'alpha-sort.png')} alt=''/>{props.children}</Main>;
export const IconApps:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'apps.png')} alt=''/>{props.children}</Main>;
export const IconAttachment:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'attachment.png')} alt=''/>{props.children}</Main>;
export const IconAV:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'av.png')} alt=''/>{props.children}</Main>;
export const IconBolt:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'bolt.png')} alt=''/>{props.children}</Main>;
export const IconCamera:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'camera.png')} alt=''/>{props.children}</Main>;
export const IconChat:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'chat.png')} alt=''/>{props.children}</Main>;
export const IconCheck:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'check.png')} alt=''/>{props.children}</Main>;
export const IconClipboard:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'clipboard.png')} alt=''/>{props.children}</Main>;
export const IconClock:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'clock.png')} alt=''/>{props.children}</Main>;
export const IconDiagStripe:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'diagstripe.png')} alt=''/>{props.children}</Main>;
export const IconDown:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'down.png')} alt=''/>{props.children}</Main>;
export const IconFastForward:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'fastforward.png')} alt=''/>{props.children}</Main>;
export const IconFlag:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'flag.png')} alt=''/>{props.children}</Main>;
export const IconFolder:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'folder.png')} alt=''/>{props.children}</Main>;
export const IconGamepad:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'gamepad.png')} alt=''/>{props.children}</Main>;
export const IconHalf:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'half.png')} alt=''/>{props.children}</Main>;
export const IconHidden:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'eye-closed.png')} alt=''/>{props.children}</Main>;
export const IconInjury:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'injury.png')} alt=''/>{props.children}</Main>;
export const IconLeague:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'leagueicon.png')} alt=''/>{props.children}</Main>;
export const IconLeft:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'left.png')} alt=''/>{props.children}</Main>;
export const IconLocked:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'locked.png')} alt=''/>{props.children}</Main>;
export const IconLoop:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'loop.png')} alt=''/>{props.children}</Main>;
export const IconLoopAuto:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'loop-auto.png')} alt=''/>{props.children}</Main>;
export const IconLoopOnce:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'loop-once.png')} alt=''/>{props.children}</Main>;
export const IconMessage:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'message.png')} alt=''/>{props.children}</Main>;
export const IconMicrophone:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'microphone.png')} alt=''/>{props.children}</Main>;
export const IconMinus:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'minus.png')} alt=''/>{props.children}</Main>;
export const IconMonitor:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'monitor.png')} alt=''/>{props.children}</Main>;
export const IconMonitorClose:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'monitor-close.png')} alt=''/>{props.children}</Main>;
export const IconMovie:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'movie.png')} alt=''/>{props.children}</Main>;
export const IconNo:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'no.png')} alt=''/>{props.children}</Main>;
export const IconOBS:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'obs.png')} alt=''/>{props.children}</Main>;
export const IconOffline:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'offline.png')} alt=''/>{props.children}</Main>;
export const IconOne:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'one.png')} alt=''/>{props.children}</Main>;
export const IconOneEight:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'one-eight.png')} alt=''/>{props.children}</Main>;
export const IconOneFivex:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'one-fivex.png')} alt=''/>{props.children}</Main>;
export const IconOneFourth:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'one-fourth.png')} alt=''/>{props.children}</Main>;
export const IconOneHalf:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'one-half.png')} alt=''/>{props.children}</Main>;
export const IconOnline:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'online.png')} alt=''/>{props.children}</Main>;
export const IconOTO:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'oto.png')} alt=''/>{props.children}</Main>;
export const IconPaintBlue:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'paint-blue.png')} alt=''/>{props.children}</Main>;
export const IconPaintRed:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'paint-red.png')} alt=''/>{props.children}</Main>;
export const IconPaintYellow:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'paint-yellow.png')} alt=''/>{props.children}</Main>;
export const IconPalette:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'palette.png')} alt=''/>{props.children}</Main>;
export const IconParagraph:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'paragraph.png')} alt=''/>{props.children}</Main>;
export const IconPause:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'pause.png')} alt=''/>{props.children}</Main>;
export const IconPin:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'pin.png')} alt=''/>{props.children}</Main>;
export const IconPlay:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'play.png')} alt=''/>{props.children}</Main>;
export const IconPlus:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'plus.png')} alt=''/>{props.children}</Main>;
export const IconQueue:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'queue.png')} alt=''/>{props.children}</Main>;
export const IconRecord:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'record.png')} alt=''/>{props.children}</Main>;
export const IconRecording:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'recording.png')} alt=''/>{props.children}</Main>;
export const IconReset:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'reset.png')} alt=''/>{props.children}</Main>;
export const IconRewind:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'rewind.png')} alt=''/>{props.children}</Main>;
export const IconRight:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'right.png')} alt=''/>{props.children}</Main>;
export const IconSave:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'save.png')} alt=''/>{props.children}</Main>;
export const IconScoreboard:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'scoreboard.png')} alt=''/>{props.children}</Main>;
export const IconSearch:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'search.png')} alt=''/>{props.children}</Main>;
export const IconSettings:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'settings.png')} alt=''/>{props.children}</Main>;
export const IconSkate:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'skate.png')} alt=''/>{props.children}</Main>;
export const IconSkater:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'skater.png')} alt=''/>{props.children}</Main>;
export const IconSlideshow:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'slideshow.png')} alt=''/>{props.children}</Main>;
export const IconStar:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'star.png')} alt=''/>{props.children}</Main>;
export const IconStop:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'stop.png')} alt=''/>{props.children}</Main>;
export const IconStopwatch:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'stopwatch.png')} alt=''/>{props.children}</Main>;
export const IconStream:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'stream.png')} alt=''/>{props.children}</Main>;
export const IconStreamLive:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'stream-live.png')} alt=''/>{props.children}</Main>;
export const IconStreamSend:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'stream-send.png')} alt=''/>{props.children}</Main>;
export const IconSwap:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'swap.png')} alt=''/>{props.children}</Main>;
export const IconSync:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'sync.png')} alt=''/>{props.children}</Main>;
export const IconSyncLive:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'sync-live.png')} alt=''/>{props.children}</Main>;
export const IconTeam:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'team.png')} alt=''/>{props.children}</Main>;
export const IconTicket:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'ticket.png')} alt=''/>{props.children}</Main>;
export const IconTrash:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'trash.png')} alt=''/>{props.children}</Main>;
export const IconUnlocked:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'unlocked.png')} alt=''/>{props.children}</Main>;
export const IconUp:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'up.png')} alt=''/>{props.children}</Main>;
export const IconVolumeMute:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'volume-mute.png')} alt=''/>{props.children}</Main>;
export const IconVolumeNoMute:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'volume-nomute.png')} alt=''/>{props.children}</Main>;
export const IconVisible:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'eye-open.png')} alt=''/>{props.children}</Main>;
export const IconVS:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'vs.png')} alt=''/>{props.children}</Main>;
export const IconWhistle:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'whistle.png')} alt=''/>{props.children}</Main>;
export const IconX:React.FunctionComponent<Props> = props => <Main {...props}><img src={path.join(basepath, 'x.png')} alt=''/>{props.children}</Main>;