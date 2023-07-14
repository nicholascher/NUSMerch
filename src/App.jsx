import Login from "./components/Login"
import { 
  createRoutesFromElements, 
  createBrowserRouter, 
  BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./components/Signup"
import LandingPage from "./components/LandingPage"
import ForgotPassword from "./components/ForgotPassword"
import ForgotPassConfirm from "./components/ForgotPassConfirm"
import SellersListings from "./components/SellersListings"
import AddListings from "./components/AddListings"
import NotSeller from "./components/NotSeller"
import DeleteListings from "./components/DeleteListings"
import ProductDisplay from "./components/ProductDisplay"
import Profile from "./components/Profile"
import FilteredSellers from "./components/FilteredSellers"
import SpecificListings from "./components/SpecificListings"
import Purchasing from "./components/Purchasing"
import Orders from "./components/Orders"
import ChatWindow from "./components/ChatWindow"

function App() {
  return (
  <BrowserRouter>
    <Routes> 
        <Route path='/' element={<Login />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/landingpage' element={<LandingPage />}></Route>
        <Route path='/forgotpassword' element={<ForgotPassword />}></Route>
        <Route path='/forgotpassconfirm' element={<ForgotPassConfirm />}></Route>
        <Route path='/sellerslistings' element={<SellersListings />}></Route>
        <Route path='/addlistings' element={<AddListings />}></Route>
        <Route path='/notseller' element={<NotSeller />}></Route>
        <Route path='/deletelistings/:id' element={<DeleteListings />}></Route>
        <Route path='/productdisplay/:id' element={<ProductDisplay />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/filteredsellers/:type' element={<FilteredSellers />}></Route>
        <Route path='/specificlistings/:type' element={<SpecificListings />}></Route>
        <Route path='/purchasing/:id' element={<Purchasing />}></Route>
        <Route path='/orders/:id' element={<Orders />}></Route>
        <Route path='/chatwindow' element={<ChatWindow />}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App;