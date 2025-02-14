import { useRoutes } from "react-router-dom"
import { ROUTES } from "./routes"



function App() {
  return (
    <>{useRoutes(ROUTES)}</>
  )
}

export default App
