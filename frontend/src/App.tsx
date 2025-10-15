import AppRouter from './routes/index';
import { ToastContainer } from "react-toastify";

const App = () =>{

   return (
    <>
    <ToastContainer position="top-right" autoClose={2500} theme="colored" />

     <AppRouter/>
    </>
   )
  
}

export default App;