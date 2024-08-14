import React, { useState, useContext, createContext } from "react";

// create the context
const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  //   function to start the loader
  const startLoading = () => setLoading(true);
  //   stop the loading
  const stopLoading = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ startLoading, stopLoading, loading }}>
      {children}
    </LoaderContext.Provider>
  );
};

// custom hook to use the loader context
export const useLoader = () => useContext(LoaderContext);
