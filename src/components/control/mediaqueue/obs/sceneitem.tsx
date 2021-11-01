import classNames from 'classnames';
import { IconHidden, IconVisible } from 'components/common/icons';
import { SceneItem } from 'obs-websocket-js';
import React from 'react';
import { OBS } from 'tools/obs/functions';
import { OBSController } from 'tools/OBSController';

interface Props extends React.HTMLProps<HTMLDivElement> {
    sceneName:string;
    sourceName:string;
}

interface State extends SceneItem {

}

/**
 * Display controls for a Scene Item
 */
class SceneItemControl extends React.PureComponent<Props, State> {
    readonly state:State = {
        alignment:0,
        cx:0,
        cy:0,
        id:0,
        locked:false,
        muted:false,
        name:'',
        render:false,
        source_cx:0,
        source_cy:0,
        type:'',
        volume:0,
        x:0,
        y:0,
        groupChildren:[],
        parentGroupName:''
    }

    protected load = () => {
        const scene = OBS.GetScene(this.props.sceneName);
        const item = (scene?.sources || []).find(i => i.name === this.props.sourceName);
        if(item) {
            this.setState({...item});
        } else {

        }
    }

    protected onClickToggleVisibility = () => {
        if(this.props.sceneName && this.props.sourceName) {
            const flag = !this.state.render;
            OBSController.send('SetSceneItemRender', {
                "scene-name":this.props.sceneName, 
                source:this.props.sourceName, 
                render:flag
            }).then(() => {
                this.setState({render:flag});
            }).catch(() => {

            });
        }
    }

    componentDidUpdate(prevProps:Props) {
        if(prevProps.sourceName !== this.props.sourceName || prevProps.sceneName !== this.props.sceneName)
            this.load();
    }

    componentDidMount() {
        this.load();
    }
    
    render() {
        const {sceneName, sourceName, ...rprops} = {...this.props};
        return <div {...rprops} className={classNames('source-item', rprops.className)}>
            <div className='name'>
                {this.props.sourceName}
            </div>
            <div className='icons'>
                {
                    (this.state.render) &&
                    <IconVisible onClick={this.onClickToggleVisibility} active={true} title='Click to Hide'/>
                }
                {
                    (!this.state.render) &&
                    <IconHidden onClick={this.onClickToggleVisibility} active={false} title='Click to Show'/>
                }
            </div>
        </div>
    }
}

export {SceneItemControl};