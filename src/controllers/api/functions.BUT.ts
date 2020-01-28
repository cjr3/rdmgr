/**
 * Bout Functions for API
 */

import {GetEndpoint, GetInit} from './functions';
import { BoutRecord } from './vars';

/**
 * Loads bout records from the API endpoint
 */
export const LoadBouts = async() : Promise<any> => {
    return new Promise((res, rej) => {
        if(!GetEndpoint()) {
            rej("Can't get data: API Endpoint is not set.");
        } else {
            fetch(GetEndpoint() + "/bouts").then((response) => {
                return response.json();
            }).then((data) => {
                if(data && data.records) {
                    res(data.records);
                } else {
                    res([]);
                }
            }).catch(() => {
                rej("Failed to load Scores.");
            });
        }
    });
};

export const SaveBout = async (record:BoutRecord) : Promise<any> => {
    return new Promise((res, rej) => {
        if(!GetEndpoint())
            rej('Failed to save bout: API Endpoint is not set.');
        else {
            fetch(GetEndpoint() + "/bout/" + record.RecordID, {
                method:(record.RecordID <= 0) ? 'POST' : 'PUT',
                mode:"cors",
                cache:"no-cache"

            })
        }
    });
};