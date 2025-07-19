import React from 'react';
import { doctors } from '../assets/assets_frontend/assets';
import { createContext } from 'react';
export const Appcontext = createContext();
const AppContextProvider=(props)=>{
    const currencysymbol="$";
    const value={
        doctors,currencysymbol

    }
    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    );
}
export default AppContextProvider;