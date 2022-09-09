import { SClock } from "tools/vars";

/**
 * Update the state for the clocks store.
 * @param state 
 * @param values 
 * @returns 
 */
export const UpdateClocks = (state:SClock, values:SClock) : SClock => {
    return {
        ...state,
        ...values
    };
};