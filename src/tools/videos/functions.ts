import Data from "tools/data";
import { CaptureIPC } from "tools/ipc";
import { MainController } from "tools/MainController";
import { UIController } from "tools/UIController";
import { CameraConfig, Video, VideoConfig } from "tools/vars";

namespace Videos {
    /**
     * Get video record
     * @returns 
     */
    export const Get = (id?:number|null) => MainController.GetState().Videos[`R-${id}`];

    /**
     * Main camera.
     * @returns 
     */
    export const GetMainCamera = () => UIController.GetState().MainCamera;

    /**
     * Get main video config
     * @returns 
     */
    export const GetMainVideo = () => UIController.GetState().MainVideo;

    /**
     * Get video records
     * @returns 
     */
    export const GetRecords = () => Object.values(MainController.GetState().Videos);

    /**
     * 
     * @returns 
     */
    export const GetUpdateTime = () => MainController.GetState().UpdateTimeVideos;

    /**
     * Load video records
     * @returns 
     */
    export const Load = () : Promise<Video[]> => {
        return new Promise((res, rej) => {
            Data.LoadVideos().then(records => {
                Set(records);
                return res(records);
            }).catch(er => rej(er))
        });
    };

    /**
     * Save video records
     * @returns 
     */
    export const Save = () => Data.SaveVideos(GetRecords());

    /**
     * Set video records
     * @param records 
     * @returns 
     */
    export const Set = (records:Video[]) => MainController.SetVideos(records);

    /**
     * Send changes to the main video
     * @param values 
     */
    export const SendMainVideo = (values:VideoConfig) => {
        CaptureIPC.Send({action:'video-config', values:values});
    };

    /**
     * 
     * @param f 
     * @returns 
     */
    export const Subscribe = (f:{():void}) => MainController.Subscribe(f);

    /**
     * Subscribe to UI changes. This is needed to update values from the capture window.
     * @param f 
     * @returns 
     */
    export const SubscribeUI = (f:{():void}) => UIController.Subscribe(f);

    /**
     * Toggle main camera visibility while keeping it running.
     */
    export const ToggleMainCamera = () => {
        const state = GetMainCamera();
        UpdateMainCamera({
            visible:typeof(state.visible) === 'boolean' ? !state.visible : true
        });
    };

    /**
     * Update main camera values.
     * @param values 
     */
    export const UpdateMainCamera = (values:CameraConfig) => {
        UIController.UpdateMainCamera(values);
    };

    /**
     * Update main video values
     * @param values 
     * @returns 
     */
    export const UpdateMainVideo = (values:VideoConfig, send:boolean = false) => {
        UIController.UpdateMainVideo(values);
        if(send) {
            SendMainVideo(values);
        }
    };

    /**
     * Create/update video records
     * @param records 
     * @returns 
     */
    export const Write = (records:Video[]) => MainController.WriteVideos(records);
}

export {Videos};