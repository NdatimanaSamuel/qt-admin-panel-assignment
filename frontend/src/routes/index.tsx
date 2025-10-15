
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "../pages/MainPage";
import AddUser from "../pages/AddUser";
import ViewUsers from "../pages/ViewUsers";
import Dashboard from "../pages/Dashboard";
const AppRouter=()=>{
    return(
        <BrowserRouter>
            <Routes>
               
                  <Route path="/" element={<MainPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                   <Route path="/add-user" element={<AddUser />} />
                   <Route path="/view-users" element={<ViewUsers />} />
                  
                </Routes>
                </BrowserRouter>

                )
}

export default AppRouter;