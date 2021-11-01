import { UIController } from "tools/UIController";
import { OBSController } from "tools/OBSController";
import { Scene, SceneItem } from 'obs-websocket-js';

const ignore = () => {};

/**
 * 
 * @param name 
 * @returns 
 */
const GetScene = (name?:string) : Scene|undefined => GetState().OBSScenes.scenes.find(s => s.name === name);

/**
 * 
 * @returns 
 */
const GetState = () => UIController.GetState();

/**
 * Load the current scene collection.
 * @returns 
 */
const LoadScenes = () : Promise<boolean> => {
    return new Promise((res, rej) => {
        if(OBSController.Connected) {
            OBSController.send('GetSceneList').then(results => {
                // console.log(results);
                UIController.SetOBSScenes({
                    currentScene:results["current-scene"],
                    messageId:results.messageId,
                    scenes:results.scenes,
                    status:results.status
                });
                return res(true)
            }).catch(er => rej(er));
        } else {
            return res(true);
        }
    });
};

/**
 * Toggle the render/visibility of a source item. 
 * @param id If a number, it's the source id; if a string, it's the source name
 * @param scene If provided, hide on specified scene; otherwise, it attempts to use the current scene.
 * @returns 
 */
// const ToggleSceneSource = (id:string|number, scene?:string) : Promise<boolean> => {
//     return new Promise((res, rej) => {
//         let visible = false;

//     });
// };

interface SceneSwitch {
    'scene-name':string;
    sources:SceneItem[];
}

/**
 * 
 * @param result 
 */
const _onSceneSwitch = (result:SceneSwitch) => {
    // console.log(result);
    UIController.SetOBSCurrentScene(result["scene-name"]);
    UIController.SetOBSSceneItems(result['scene-name'], result.sources);
};

/**
 * 
 */
const _onAuthenticated = () => {
    OBSController.send('GetCurrentScene').then(result => {
        UIController.SetOBSCurrentScene(result.name);
        UIController.SetOBSSceneItems(result.name, result.sources);
    }).catch(() => {

    });
};

/**
 * Initialize events and listeners for OBS
 */
const Init = () : Promise<boolean> => {
    return new Promise((res) => {
        LoadScenes().then(ignore).catch(ignore);

        try {
            OBSController.off('SwitchScenes', _onSceneSwitch);
            OBSController.off('AuthenticationSuccess', _onAuthenticated);
        } catch(er) {

        }

        OBSController.on('AuthenticationSuccess', _onAuthenticated);

        //called when scenes are switched in OBS
        OBSController.on('SwitchScenes', _onSceneSwitch);

        OBSController.on('ConnectionClosed', () => {
            UIController.SetOBSConnection(false);
        });

        OBSController.on('ConnectionOpened', () => {
            UIController.SetOBSConnection(true);
        });

        return res(true);
    });
}

const OBS = {
    GetScene:GetScene,
    GetState:GetState,
    Init:Init,
    LoadScenes:LoadScenes,
    Subscribe:UIController.Subscribe
};

export {OBS};