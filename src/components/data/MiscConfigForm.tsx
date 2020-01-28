import React from 'react';
import Panel from 'components/Panel';
import DataController from 'controllers/DataController';
import { IconButton, IconSave, IconNo } from 'components/Elements';
import MediaPreview from 'components/tools/MediaPreview';

export default class MiscConfigForm extends React.PureComponent<{
    opened:boolean;
    onSubmit:Function;
    onCancel:Function;
}, {
    RaffleBackground:string;
    RaffleTicketBackground:string;
    NationalFlag:string;
    LeagueBackground:string;
    LeagueLogo:string;
}> {
    readonly state = {
        RaffleBackground:DataController.GetMiscRecord('RaffleBackground'),
        RaffleTicketBackground:DataController.GetMiscRecord('RaffleTicketBackground'),
        NationalFlag:DataController.GetMiscRecord('NationalFlag'),
        LeagueBackground:DataController.GetMiscRecord('LeagueBackground'),
        LeagueLogo:DataController.GetMiscRecord('LeagueLogo')
    }

    constructor(props) {
        super(props);
        this.onClickCancel = this.onClickCancel.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
        this.onSelectLeagueBackground = this.onSelectLeagueBackground.bind(this);
        this.onSelectLeagueLogo = this.onSelectLeagueLogo.bind(this);
        this.onSelectNationalFlag = this.onSelectNationalFlag.bind(this);
        this.onSelectRaffleBackground = this.onSelectRaffleBackground.bind(this);
        this.onSelectRaffleTicketBackground = this.onSelectRaffleTicketBackground.bind(this);
    }

    protected onSelectRaffleBackground(filename:string) {
        this.setState({RaffleBackground:filename});
    }

    protected onSelectRaffleTicketBackground(filename:string) {
        this.setState({RaffleTicketBackground:filename});
    }

    protected onSelectNationalFlag(filename:string) {
        this.setState({NationalFlag:filename});
    }

    protected onSelectLeagueBackground(filename:string) {
        this.setState({LeagueBackground:filename});
    }

    protected onSelectLeagueLogo(filename:string) {
        this.setState({LeagueLogo:filename});
    }

    protected async onClickSubmit() {
        if(!await DataController.SaveMiscRecord('RaffleBackground', this.state.RaffleBackground)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('RaffleTicketBackground', this.state.RaffleTicketBackground)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('NationalFlag', this.state.NationalFlag)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('LeagueBackground', this.state.LeagueBackground)) {
            return;
        }

        if(!await DataController.SaveMiscRecord('LeagueLogo', this.state.LeagueLogo)) {
            return;
        }

        if(this.props.onSubmit)
            this.props.onSubmit();
    }

    protected onClickCancel() {
        this.setState({
            RaffleBackground:DataController.GetMiscRecord('RaffleBackground'),
            RaffleTicketBackground:DataController.GetMiscRecord('RaffleTicketBackground'),
            NationalFlag:DataController.GetMiscRecord('NationalFlag'),
            LeagueBackground:DataController.GetMiscRecord('LeagueBackground'),
            LeagueLogo:DataController.GetMiscRecord('LeagueLogo')
        }, () => {
            if(this.props.onCancel)
                this.props.onCancel();
        });
    }

    render() {
        let buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                key='btn-submit'
                src={IconSave}
                onClick={this.onClickSubmit}
                >Save</IconButton>,
            <IconButton
                key='btn-cancel'
                src={IconNo}
                onClick={this.onClickCancel}
                >Cancel</IconButton>
        );


        return (
            <Panel
                opened={this.props.opened}
                buttons={buttons}
            >
                <div className="record-form">
                    <h3>Media</h3>
                    <hr/>
                    <div className="stack-panel">
                        <MediaPreview
                            src={this.state.LeagueLogo}
                            title="League Logo"
                            onChange={this.onSelectLeagueLogo}
                            />
                        <MediaPreview
                            src={this.state.LeagueBackground}
                            title="League Background"
                            onChange={this.onSelectLeagueBackground}
                            />
                        <MediaPreview
                            src={this.state.NationalFlag}
                            title="National Flag"
                            onChange={this.onSelectNationalFlag}
                            />
                        <MediaPreview
                            src={this.state.RaffleBackground}
                            title="Raffle Background"
                            onChange={this.onSelectRaffleBackground}
                            />
                        <MediaPreview
                            src={this.state.RaffleTicketBackground}
                            title="Ticket Background"
                            onChange={this.onSelectRaffleTicketBackground}
                            />
                    </div>
                </div>
            </Panel>
        )
    }
}