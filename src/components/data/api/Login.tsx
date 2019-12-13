import React from 'react';
import DataController from 'controllers/DataController';
import Panel from 'components/Panel';
import cnames from 'classnames';
import { IconButton, IconCheck, IconNo } from 'components/Elements';


export default class Login extends React.PureComponent<{
    onError?:Function;
    onSuccess:Function;
    onClose:Function;
    opened:boolean;
}, {
    username:string;
    password:string;
    processing:boolean;
    error?:string;
    loggedIn:boolean;
}> {

    readonly state = {
        username:DataController.GetMiscRecord('APIUsername'),
        password:'',
        processing:false,
        error:'',
        loggedIn:false
    }

    protected PasswordItem:React.RefObject<HTMLInputElement> = React.createRef();
    protected UsernameItem:React.RefObject<HTMLInputElement> = React.createRef();

    constructor(props) {
        super(props);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onClickSubmit = this.onClickSubmit.bind(this);
    }

    protected onChangePassword(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({password:value});
    }

    protected onChangeUsername(ev:React.ChangeEvent<HTMLInputElement>) {
        let value:string = ev.currentTarget.value;
        this.setState({username:value});
    }

    protected onClickSubmit() {

        if(!this.state.username) {
            if(this.UsernameItem && this.UsernameItem.current) {
                this.UsernameItem.current.focus();
            }
            return;
        }
        
        if(!this.state.password) {
            if(this.PasswordItem && this.PasswordItem.current) {
                this.PasswordItem.current.focus();
            }
            return;
        }


        if(this.state.processing)
            return;

        this.setState({processing:true, error:'', loggedIn:false}, () => {
            DataController.loadAPIToken(this.state.username, this.state.password).then(() => {
                DataController.SaveMiscRecord('APIUsername', this.state.username);
                this.setState({processing:false,loggedIn:true,error:'',password:''});
                if(this.props.onSuccess)
                    this.props.onSuccess();
            }).catch((error) => {
                this.setState({processing:false,loggedIn:false,error:error});
                if(this.props.onError)
                    this.props.onError(error);
            });
        });
    }

    render() {
        let title:string = "Login";
        if(this.state.processing)
            title = "Logging in...";
        else if(this.state.loggedIn)
            title = "Logged In";
        const buttons:Array<React.ReactElement> = new Array<React.ReactElement>(
            <IconButton
                src={IconCheck}
                key="btn-login"
                onClick={this.onClickSubmit}
                >Submit</IconButton>,
            <IconButton
                src={IconNo}
                key="btn-cancel"
                onClick={this.props.onClose}
                >Cancel</IconButton>
        );

        return (
            <Panel
                buttons={buttons}
                opened={this.props.opened}
                className="login-panel"
                contentName="login-form"
                onClose={this.props.onClose}
                title={title}
                popup={true}
                >
                <div className={cnames('error-message', { shown:(this.state.error) })} >{this.state.error}</div>
                <table cellPadding={6}>
                    <tbody>
                        <tr>
                            <td>Username</td>
                            <td>
                                <input 
                                    type="text"
                                    size={20}
                                    maxLength={50}
                                    value={this.state.username}
                                    onChange={this.onChangeUsername}
                                    ref={this.UsernameItem}
                                    />
                            </td>
                        </tr>
                        <tr>
                            <td>Password</td>
                            <td>
                                <input 
                                    type="password"
                                    size={20}
                                    maxLength={50}
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                    ref={this.PasswordItem}
                                    />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Panel>
        );
    }
}