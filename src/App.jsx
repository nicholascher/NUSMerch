import Login from "./components/Login"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./components/Signup"
import LandingPage from "./components/LandingPage"
import ForgotPassword from "./components/ForgotPassword"
import ForgotPassConfirm from "./components/ForgotPassConfirm"
import Halls from "./components/Halls"
import RC from "./components/RC"
import Clubs from "./components/Clubs"
import SellersListings from "./components/SellersListings"
import AddListings from "./components/AddListings"
import NotSeller from "./components/NotSeller"
import DeleteListings from "./components/DeleteListings"
import HallsLanding from "./components/HallsLanding"
import RCLanding from "./components/RCLanding"
import ProductDisplay from "./components/ProductDisplay"
import ClubsLanding from "./components/ClubsLanding"
import Profile from "./components/Profile"

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
        <Route path='/halls/:hall' element={<Halls />}></Route>
        <Route path='/rc/:rctype' element={<RC />}></Route>
        <Route path='/clubs/:club' element={<Clubs />}></Route>
        <Route path='/sellerslistings' element={<SellersListings />}></Route>
        <Route path='/addlistings' element={<AddListings />}></Route>
        <Route path='/notseller' element={<NotSeller />}></Route>
        <Route path='/hallslanding' element={<HallsLanding />}></Route>
        <Route path='/RClanding' element={<RCLanding />}></Route>
        <Route path='/clubslanding' element={<ClubsLanding />}></Route>
        <Route path='/deletelistings/:id/' element={<DeleteListings />}></Route>
        <Route path='/productdisplay/:id' element={<ProductDisplay />}></Route>
        <Route path='/profile' element={<Profile />}></Route>


      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App;