import classNames from 'classnames';
import React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> {
    active:boolean;
    filename:string;
    index:number;
    name:string;
    onSelectSlide?:{(index:number):void};
}


/**
 * Diplays a slide item the user can drag n drop
 */
class SlideItem extends React.PureComponent<Props> {

    protected Element:React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

    scrollIntoView = (args?:boolean|ScrollIntoViewOptions) => {
        if(this.Element && this.Element.current)
            this.Element.current.scrollIntoView(args);
    }

    render() {
        const {active, filename, index, name, onSelectSlide, ...rprops} = {...this.props};
        let ext = '';
        if(filename) {
            const parts = filename.toLowerCase().split('.');
            if(parts && parts.length > 0) {
                ext = parts[parts.length - 1];
            }
        }
    
        switch(ext) {
            //images
            case 'jpeg' :
            case 'png' :
            case 'gif' :
            case 'jpg' :
    
                return <div 
                    {...rprops}
                    className={classNames('thumbnail', rprops.className, {active:this.props.active})}
                    // style={{flex:'0 0 150px', border:'solid 1px #666',margin:'8px'}}
                    data-index={index}
                    onClick={() => {
                        if(onSelectSlide)
                            onSelectSlide(index)
                    }}
                    onContextMenu={ev => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        if(this.props.onContextMenu)
                            this.props.onContextMenu(ev);
                    }}
                    ref={this.Element}
                    >
                    <div className='overlay'></div>
                    <img src={filename} alt=''/>
                </div>;

            case 'mp4' : 
            case 'wmv' : 
            default :
    
                return <div 
                    {...rprops}
                    className={classNames('thumbnail', rprops.className, {active:this.props.active})}
                    data-index={index}
                    // style={{flex:'0 0 150px'}}
                    onClick={() => {
                        if(onSelectSlide)
                            onSelectSlide(index)
                    }}
                    onContextMenu={ev => {
                        ev.stopPropagation();
                        ev.preventDefault();
                        if(this.props.onContextMenu)
                            this.props.onContextMenu(ev);
                    }}
                    ref={this.Element}
                    >
                    <div className='overlay'></div>
                </div>
        }
    }
}

export {SlideItem};