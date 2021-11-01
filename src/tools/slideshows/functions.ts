import Data from "tools/data";
import { MainController } from "tools/MainController";
import { Slide, Slideshow as SlideshowRecord, SSlideshow } from "tools/vars";

namespace Slideshow {
    /**
     * Get the slideshow state.
     * @returns 
     */
    export const Get = () => MainController.GetState().Slideshow;

    /**
     * 
     * @returns 
     */
    export const GetIndex = () => {
        const state = Get();
        return (typeof(state.Index) === 'number') ? state.Index : -1;
    };

    export const GetSlides = () => Get().Records || [];

    /**
     * Get the timestamp when the slideshow was updated.
     * @returns 
     */
    export const GetUpdateTime = () => MainController.GetState().UpdateTimeSlideshow;

    /**
     * 
     * @returns 
     */
    export const Next = () => SetIndex(GetIndex()+1);

    /**
     * 
     * @returns 
     */
    export const Previous = () => SetIndex(GetIndex()-1);

    /**
     * 
     * @param index 
     * @returns 
     */
    export const SetIndex = (index:number) => {
        const slides = GetSlides();
        if(index >= slides.length)
            Update({Index:-1});
        else if(index < -1)
            Update({Index:slides.length - 1});
        else
            Update({Index:index});
    };

    /**
     * Set the slides to display.
     * @param records 
     * @returns 
     */
    export const SetSlides = (records:Slide[]) => Update({Records:records});

    /**
     * Subscribe to changes to the slideshow
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Update the manual slideshow state.
     * @param values 
     * @returns 
     */
    export const Update = (values:SSlideshow) => MainController.UpdateSlideshowState(values);
}

namespace Slideshows {
    /**
     * Get slideshow record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Slideshows[`R-${id}`];

    /**
     * Get slideshow records
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Slideshows);

    /**
     * 
     * @returns 
     */
    export const GetUpdateTime = () => MainController.GetState().UpdateTimeSlideshows;

    /**
     * Load slideshow records
     * @returns 
     */
    export const Load = () : Promise<SlideshowRecord[]> => {
        return new Promise((res, rej) => {
            Data.LoadSlideshows().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er));
        });
    }

    /**
     * Save slideshow records
     * @returns 
     */
    export const Save = () => Data.SaveSlideshows(GetRecords());

    /**
     * Set slideshow records
     * @param records 
     * @returns 
     */
    export const Set = (records:SlideshowRecord[]) => MainController.SetSlideshows(records);

    /**
     * 
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Create/update slideshow records.
     * @param records 
     * @returns 
     */
    export const Write = (records:SlideshowRecord[]) => MainController.WriteSlideshows(records);
}

export {Slideshows, Slideshow};