import Login from "./components/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup"

function App() {
  return (
  <BrowserRouter>
    <Routes> 
      <Route>
        <Route path='/' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App;