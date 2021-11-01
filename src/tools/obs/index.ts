import { SceneItem } from "obs-websocket-js";
import { OBSSceneCollection, SUIController } from "tools/vars";

/**
 * Set flag that determines if OBS is connected or not.
 * @param state 
 * @param flag 
 * @returns 
 */
export const SetConnected = (state:SUIController, flag:boolean) : SUIController => {
    return {
        ...state,
        OBSSettings:{
            ...state.OBSSettings,
            Connected:flag
        },
        UpdateTimeOBS:Date.now()
    };
};

/**
 * Set current scene.
 * @param state 
 * @param name 
 * @param id 
 * @returns 
 */
export const SetCurrentScene = (state:SUIController, name:string, id:number) : SUIController => {
    return {
        ...state,
        OBSSettings:{
            ...state.OBSSettings,
            CurrentSceneName:name,
            CurrentSceneId:id
        },
        UpdateTimeOBS:Date.now()
    }
};

/**
 * Set current source
 * @param state 
 * @param name 
 * @param id 
 * @returns 
 */
export const SetCurrentSource = (state:SUIController, name:string, id:number, sceneName?:string, sceneId?:number) : SUIController => {
    return {
        ...state,
        OBSSettings:{
            ...state.OBSSettings,
            CurrentSourceId:id,
            CurrentSourceName:name,
            CurrentSceneName:sceneName || state.OBSSettings.CurrentSceneName,
            CurrentSceneId:(typeof(sceneId) === 'number') ? sceneId : state.OBSSettings.CurrentSceneId
        },
        UpdateTimeOBS:Date.now()
    }
};

/**
 * Set the current scene collection.
 * @param state 
 * @param value 
 * @returns 
 */
export const SetSceneCollection = (state:SUIController, value:OBSSceneCollection) : SUIController => {
    // console.log(value);
    return {
        ...state,
        OBSScenes:value,
        UpdateTimeOBS:Date.now()
    }
};

/**
 * Set the scene items for a given scene
 * @param state Current state
 * @param key Key/name of scene
 * @param items Collection of items
 * @returns 
 */
export const SetSceneItems = (state:SUIController, key:string, items:SceneItem[]) : SUIController => {
    return {
        ...state,
        OBSSceneItems:{
            ...state.OBSSceneItems,
            [key]:items
        },
        UpdateTimeOBSScenes:Date.now()
    }
}