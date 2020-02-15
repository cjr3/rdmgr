import {Folders} from './vars';
const path = require('path');

export const AddMediaPath = (src?:string|null) => {
    if(typeof(src) !== "string" || src === '')
        return '';
    if(src.indexOf('http://') === 0 || src.indexOf('https://') === 0 || src.charAt(1) == ':')
        return src;
    if(typeof(src) === "string" && src.indexOf(Folders.Media) !== 0)
        return path.join(Folders.Media, src);
    return src;
};

export const RemoveMediaPath = (src?:string|null) => {
    if(typeof(src) !== 'string' || src === '')
        return '';
    if(src.indexOf('http://') === 0 || src.indexOf('https://') === 0)
        return src;
    if(typeof(src) === "string" && src.indexOf(Folders.Media) >= 0)
        return src.replace(Folders.Media, '');
    return src;
};

/**
 * Prepares an object for sending
 * - Strips local path names from media values
 * @param {Object} record 
 */
export const PrepareObjectForSending = (record) => {
    if(typeof(record) !== 'object' || record === null)
        return record;
    
    for(let key in record) {
        switch(key) {
            case 'Thumbnail' :
            case 'Photo' :
            case 'ScoreboardThumbnail' :
            case 'Background' :
            case "Filename" :
            case "FileName" :
                record[key] = RemoveMediaPath(record[key]);
            break;

            default :
                if(typeof(record[key]) === 'object' && record[key] !== null) {
                    if(record[key] instanceof Array) {
                        record[key] = record[key].slice();
                        for(var akey in record[key]) {
                            if(typeof(record[key][akey]) === 'object' && record[key][akey] !== null) {
                                record[key][akey] = PrepareObjectForSending(Object.assign({}, record[key][akey]));
                            }
                        }
                    } else {
                        record[key] = PrepareObjectForSending(Object.assign({}, record[key]));
                    }
                }
            break;
        }
    }

    return record;
};

export const MoveElement = (arr, a, b, right = false) => {
    if(a >= arr.length) {
        let k = a - arr.length + 1;
        while(k--) {
            arr.push(undefined);
        }
    }
    if(right) {
        if(b > a) {
            arr.splice(a+1, 0, arr.splice(b, 1)[0]);
        } else {
            arr.splice(a, 0, arr.splice(b, 1)[0]);
        }
    }
    else {
        if(a > b) {
            arr.splice(a, 0, arr.splice(b, 1)[0]);
        } else {
            arr.splice(a, 0, arr.splice(b, 1)[0]);
        }
    }
};

export const GetAspectSize = (mw:number, mh:number, w:number, h:number) => {
    let r = 0;
    if(w > mw) {
        r = mw / w;
        h = h * r;
        w = w * r;
    }

    if(h > mh) {
        r = mh / h;
        w = w * r;
        h = h * r;
    }

    let x = (mw/2) - (w/2);
    let y = (mh/2) - (h/2);

    return {width:w, height:h, x:x, y:y};
};

export const SecondsToTime = (seconds:number) :string => {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600)/60);
    let s = Math.floor(seconds % 60);
    let str = m.toString().padStart(2,'0') + ":" + s.toString().padStart(2,'0');
    if(h > 0)
        str = h.toString().padStart(2,'0') + ":" + str;
    return str;
};

/**
 * Compares two objects
 * @author nicbell (https://gist.github.com/nicbell/6081098)
 * @param {Object} obj1
 * @param {Object} obj1
 * @param {Boolean} log
 */
export const Compare = (obj1:any, obj2:any) => {
    if(obj1 === null || obj2 === null || obj1 === undefined || obj2 === undefined) {
        if(obj1 === null && obj2 === null)
            return true;
        if(obj1 === undefined && obj2 === undefined)
            return true;
        return false;
    }

    //Loop through properties in object 1
    for (var p in obj1) {
        //Check property exists on both objects
        if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
            return false;
        }
    
        switch (typeof (obj1[p])) {
            //Deep compare objects
            case 'object':
                if (!Compare(obj1[p], obj2[p])) return false;
            break;
            //Compare function code
            case 'function':
                if (typeof (obj2[p]) === 'undefined' || (p !== 'compare' && obj1[p].toString() !== obj2[p].toString())) return false;
            break;
            //Compare values
            default:
                if (obj1[p] !== obj2[p]) {
                    return false;
                }
        }
    }
    
    //Check object 2 for any extra properties
    for (var p2 in obj2) {
        if (typeof (obj1[p2]) === 'undefined') return false;
    }

    return true;
};

/**
 * Asyncrhous object comparison
 * @param obj1 Object
 * @param obj2 Object
 */
export const CompareAsync = (obj1, obj2) : Promise<boolean> => {
    return new Promise((res, rej) => {
        res(Compare(obj1, obj2));
    });
};

/**
 * 
 * @source https://stackoverflow.com/a/48218209
 * @param objs 
 */
export const Merge = (...objs) => {
    let res:any = {};
    const isObject = obj => obj && typeof obj === 'object';
    objs.reduce((prev, current) => {
        Object.keys(current).forEach(key => {
            const pVal = prev[key];
            const cVal = current[key];
            if(Array.isArray(pVal) && Array.isArray(cVal)) {
                prev[key] = cVal.slice();
            }
            else if(isObject(pVal) && isObject(cVal)) {
                prev[key] = Merge(pVal, cVal);
            } else {
                prev[key] = cVal;
            }
        })
    });

    return res;
};

export const ShowOpenDialog = async (options) : Promise<Array<string>|undefined> => {

    let diag:any = window.require('electron').remote.dialog;
    let settings = Object.assign({
        title:"Select File(s)",
        defaultPath:Folders.Media,
        buttonLabel:"SELECT",
        filters:[
            {name:'Images', extensions:['jpg', 'png', 'gif', 'jpeg']},
            {name:'Movies', extensions:['mp4', 'wmv', 'mov', 'webm']}
        ],
        properties:['openFile']
    }, options);

    return new Promise((res, rej) => {
        return diag.showOpenDialog(window.RDMGR.mainWindow, settings, names => {res(names ? names : undefined)});
    });
};