import { ipcRenderer } from "electron";
import { __BaseRecord } from "./vars";
const exitMethods:{():void}[] = [];

export const AddExitMethod = (f:{():void}) => {
    exitMethods.push(f);
};

/**
 * Exit the application, closing all windows.
 */
export const ExitApplication = () => {
    exitMethods.forEach(f => f());
    ipcRenderer.send('exit-app');
}

/**
 * 
 * @param a 
 * @param b 
 * @param direction 
 * @returns 
 */
export const compareStrings = (a?:string|null, b?:string|null, direction:string = 'ASC') : number => {
    if(a && b) {
        return (direction) ? a.localeCompare(b) : b.localeCompare(a);
    } else if(a) {
        return (direction) ? 1 : -1;
    } else {
        return (direction) ? -1 : 1;
    }
}

/**
 * Convert the given number into a timestamp.
 * @param seconds 
 * @returns 
 */
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
 * 
 * @param records 
 * @param column 
 * @param direction 
 */
export const SortRecords = (records:__BaseRecord[], column:string, direction:string) => {
    switch(column) {
        case 'Name' :
            records.sort((a, b) => compareStrings(a.Name, b.Name, direction));
        break;
        case 'Number' :
            records.sort((a, b) => compareStrings(a.Number, b.Number, direction));
        break;
    }
};