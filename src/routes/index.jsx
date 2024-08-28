import { useContext } from "react"
import { useRoutes } from "react-router-dom"
import { RoutesContext } from "../context/routes"

const Router = () => {
    const { routes } = useContext(RoutesContext)
    return useRoutes(routes)
}

export default Router