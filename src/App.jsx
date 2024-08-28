import { ThemeProvider } from "@emotion/react"
import { createTheme, CssBaseline } from "@mui/material"
import RoutesProvider from "./context/routes"
import LayoutProvider from "./context/layout"
import Router from "./routes"

function App() {

  const defaultTheme = createTheme()

  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <CssBaseline />
        <RoutesProvider>
          <LayoutProvider>
            <Router />
          </LayoutProvider>
        </RoutesProvider>
      </ThemeProvider>
    </>
  )
}

export default App
