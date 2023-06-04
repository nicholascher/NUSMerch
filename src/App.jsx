import Login from "./components/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./components/Signup"
import LandingPage from "./components/LandingPage"
import ForgotPassword from "./components/ForgotPassword"
import ForgotPassConfirm from "./components/ForgotPassConfirm"
import Halls from "./components/Halls"
import RC from "./components/RC"
import Clubs from "./components/Clubs"

function App() {
  return (
  <BrowserRouter>
    <Routes> 
      <Route>
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/landingpage' element={<LandingPage />}></Route>
        <Route path='/forgotpassword' element={<ForgotPassword />}></Route>
        <Route path='/forgotpassconfirm' element={<ForgotPassConfirm />}></Route>
        <Route path='/halls' element={<Halls />}></Route>
        <Route path='/rc' element={<RC />}></Route>
        <Route path='/clubs' element={<Clubs />}></Route>

      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App;