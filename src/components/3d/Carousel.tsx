import React, { CSSProperties } from 'react';
import cnames from 'classnames';
import './css/Carousel.scss'

export type CarouselRecord = {
    src:string;
    key:string;
};

/**
 * 3D Carousel Component to display images
 * 
 * Source: https://3dtransforms.desandro.com/carousel
 */
export default class Carousel extends React.PureComponent<{
    images:Array<CarouselRecord>;
    index:number;
    width:number;
    height:number;
    style?:CSSProperties;
    transform?:string;
    className?:string;
}, {
    
}> {

    render() {
        const cells:Array<React.ReactElement> = new Array<React.ReactElement>();
        let size:number = this.props.images.length;

        size++;
        if(size <= 0)
            size = 1;
        let tz:number = Math.round( (this.props.width / 2) / Math.tan( Math.PI / size ) );
        let deg:number = Math.round( 360 / size );
        let ry:number = deg;
        let cdeg:number = 0;
        this.props.images.forEach((cell, index) => {
            let ttz = tz;
            if(this.props.index == index) {
                ttz += 20;
            }
            let transform:string = "rotateY(" + ry + "deg) translateZ(" + ttz + "px)";
            if(this.props.index == index) {
                if(this.props.transform)
                    transform += " " + this.props.transform;
            }
            let style:CSSProperties = {
                //backgroundImage:"url('" + cell.src + "')",
                transform:transform,
                width:this.props.width,
                height:this.props.height
            };

            if(this.props.style)
                style = Object.assign(style, this.props.style);

            let className = cnames('carousel-cell', {
                current:(this.props.index == index),
                past:(index < this.props.index),
                future:(index > this.props.index),
            });

            if(this.props.index == index)
                cdeg = ry * -1;

            cells.push(
                <div
                    key={`${cell.key}`}
                    className={className}
                    style={style}
                    >
                    <img src={cell.src} alt=""/>
                </div>
            );
            ry += deg;
        });

        let cstyle:CSSProperties = {
            transform:"translateZ(-" + tz + "px) rotateY(" + cdeg + "deg)"
        };

        cells.push(<div 
            className="carousel-cell last"
            style={{
                transform:"rotateY(" + ry + "deg) translateZ(" + tz + "px)",
                width:this.props.width,
                height:this.props.height,
                opacity:0
            }}
            key="cell-last"></div>
        );
        
        return (
            <div className={cnames('carousel-scene', this.props.className)}>
                <div className="carousel" style={cstyle}>
                    {cells}
                </div>
            </div>
        )
    }
}