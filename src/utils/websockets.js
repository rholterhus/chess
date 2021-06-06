import React, { useContext, createContext, useState} from 'react';

const wsContext = createContext();

export const SocketProvider = ( { children } ) => {
    const [value, setValue] = useState(null);

    const saveWebsocket = (value) => {
        setValue(value)
      };


    return <wsContext.Provider value={{ websocket: value, saveWebsocket }}>{children}</wsContext.Provider>;
}
  
export default () => {
   const context = useContext(wsContext);
   return context;
};