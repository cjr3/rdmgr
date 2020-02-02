import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import './css/PopupBanner.scss';

/**
 * Popup banner element
 * - Title (optional)
 * - Child Props
 * - 
 */
export default class PopupBanner extends React.PureComponent<{
    shown:boolean;
    className?:string;
    style?:CSSProperties;
}, {

}> {

    render() {
        let className:string = cnames('popup-banner', this.props.className, {
            shown:this.props.shown,
        });

        return (
            <div className={className} style={this.props.style}>
                <div className="content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}