import { createContext } from "react";
import { CoreLayout } from "../../components/core-layout";
import { Navigate } from "react-router-dom";
import { Home } from "../../pages/home";

export const RoutesContext = createContext(null);

const RoutesProvider = ({ children }) => {

    const routes = [
        {
            path: "/",
            name: 'Home',
            element: <CoreLayout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/home" />,
                },
                { path: "home", name: "Home", element: <Home /> },
            ]
        }
    ]

    return (
        <RoutesContext.Provider value={{ routes }}>
            {children}
        </RoutesContext.Provider>
    )
}

export default RoutesProvider