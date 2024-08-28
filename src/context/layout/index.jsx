import { createContext } from "react";

export const LayoutContext = createContext(null);

const LayoutProvider = ({ children }) => {
    return (
        <LayoutContext.Provider
            value={{

            }}
        >
            {children}
        </LayoutContext.Provider>
    )
}

export default LayoutProvider;