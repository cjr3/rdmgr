import { Scene } from 'obs-websocket-js';
import React from 'react';
import { Unsubscribe } from 'redux';
import { compareStrings } from 'tools/functions';
import { MainController } from 'tools/MainController';
import { OBS } from 'tools/obs/functions';
import { Seasons } from 'tools/seasons/functions';
import { Slideshows } from 'tools/slideshows/functions';
import { Teams } from 'tools/teams/functions';
import { Season, Slideshow, Team } from 'tools/vars';

interface Props<T> extends React.HTMLProps<HTMLSelectElement> {
    onSelectValue:{(record?:T):void}
}

interface State {
    updateTime:number;
}

/**
 * 
 */
class TeamSelector extends React.PureComponent<Props<Team>, State> {
    readonly state:State = {
        updateTime:0
    }

    protected remote?:Unsubscribe;

    protected update = () => {
        this.setState({
            updateTime:MainController.GetState().UpdateTimeTeams
        })
    }

    protected onSelect = (ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(ev.currentTarget.value);
        this.props.onSelectValue(Teams.GetRecords().find(r => r.RecordID === value));
    }

    protected onKey = (ev:React.KeyboardEvent<HTMLSelectElement>) => {
        ev.stopPropagation();
    }

    componentDidMount() {
        this.remote = MainController.Subscribe(this.update);
    }

    componentWillUnmount() {
        if(this.remote)
            this.remote();
    }

    render() {
        const records = Teams.GetRecords();
        records.sort((a, b) => compareStrings(a.Name, b.Name))
        const {onSelectValue, ...rprops} = {...this.props}
        return <select 
            onKeyUp={this.onKey}
            onKeyDown={this.onKey}
            onKeyPress={this.onKey}
            {...rprops} 
            onChange={this.onSelect}>
            {
                records.map(record => {
                    return <option value={record.RecordID} key={`record-${record.RecordID}`}>
                        {record.Name}
                    </option>
                })
            }
        </select>
    }
}


/**
 * Select item for seasons
 * @param props 
 * @returns 
 */
const SeasonSelector:React.FunctionComponent<Props<Season>> = props => {
    const {onSelectValue, ...rprops} = {...props};
    const [records, setRecords] = React.useState<Season[]>(Seasons.GetRecords());
    const [updateTime, setUpdateTime] = React.useState(0);
    
    const onKey = React.useCallback((ev:React.KeyboardEvent<HTMLSelectElement>) => {
        ev.stopPropagation();
    }, []);

    const onSelect = React.useCallback((ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(ev.currentTarget.value);
        onSelectValue(Seasons.Get(value));
    }, []);

    React.useEffect(() => Seasons.Subscribe(() => {
        setUpdateTime(Seasons.GetUpdateTime());
    }), []);

    React.useEffect(() => {
        const seasons = Seasons.GetRecords();
        seasons.sort((a, b) => compareStrings(a.Name, b.Name));
        setRecords(seasons);
    }, [updateTime]);

    return <select 
        onKeyUp={onKey}
        onKeyDown={onKey}
        onKeyPress={onKey}
        {...rprops} 
        onChange={onSelect}>
            <option value={0}>(none)</option>
        {
            records.map(record => {
                return <option value={record.RecordID} key={`record-${record.RecordID}`}>
                    {record.Name}
                </option>
            })
        }
    </select>
}

/**
 * Slideshow dropdown
 * @param props 
 * @returns 
 */
const SlideshowSelector:React.FunctionComponent<Props<Slideshow>> = props => {
    const {onSelectValue, ...rprops} = {...props}
    const [records, setRecords] = React.useState<Slideshow[]>([]);
    const [updateTime, setUpdateTime] = React.useState(0);

    const onKey = React.useCallback((ev:React.KeyboardEvent<HTMLSelectElement>) => {
        ev.stopPropagation();
    }, []);

    const onSelect = React.useCallback((ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(ev.currentTarget.value);
        onSelectValue(Slideshows.Get(value));
    }, []);

    React.useEffect(() => Slideshows.Subscribe(() => {
        setUpdateTime(Slideshows.GetUpdateTime());
    }), []);

    React.useEffect(() => {
        const results = Slideshows.GetRecords();
        results.sort((a, b) => compareStrings(a.Name, b.Name));
        setRecords(results);
    }, [updateTime]);
    return <select 
        onKeyUp={onKey}
        onKeyDown={onKey}
        onKeyPress={onKey}
        {...rprops} 
        onChange={onSelect}>
            <option value={0}>(none)</option>
        {
            records.map(record => {
                return <option value={record.RecordID} key={`record-${record.RecordID}`}>
                    {record.Name}
                </option>
            })
        }
    </select>
};

/**
 * OBS Scene Dropwdown
 * @param props 
 * @returns 
 */
const OBSSceneSelector:React.FunctionComponent<Props<Scene>> = props => {
    const {onSelectValue, ...rprops} = {...props};
    const [records, setRecords] = React.useState<Scene[]>([]);
    const [updateTime, setUpdateTime] = React.useState(0);
    
    const onKey = React.useCallback((ev:React.KeyboardEvent<HTMLSelectElement>) => {
        ev.stopPropagation();
    }, []);

    const onSelect = React.useCallback((ev:React.ChangeEvent<HTMLSelectElement>) => {
        const value = ev.currentTarget.value;
        onSelectValue(OBS.GetScene(value));
    }, []);

    React.useEffect(() => Seasons.Subscribe(() => {
        setUpdateTime(Seasons.GetUpdateTime());
    }), []);

    React.useEffect(() => {
        const results = OBS.GetState().OBSScenes.scenes;
        results.sort((a, b) => compareStrings(a.name, b.name));
        setRecords(results);
    }, [updateTime]);

    return <select
        size={1}
        onKeyUp={onKey}
        onKeyDown={onKey}
        onKeyPress={onKey}
        {...rprops}
        onChange={onSelect}
    >
        {
            records.map((record, index) => {
                return <option value={record.name} key={`record-${record.name}-${index}`}>
                    {record.name}
                </option>
            })
        }
    </select>
}

export {
    OBSSceneSelector,
    TeamSelector,
    SeasonSelector,
    SlideshowSelector
}