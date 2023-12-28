import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn'; 
import SignUp from './pages/SignUp';
import Select from './pages/Select';
import Home from './pages/Home';
import Test from './pages/Test';
import CreateUnit from './pages/CreateUnit';
import Notification from './pages/Notification';
import UserPage from './pages/UserPage';
import React from 'react';
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className='pages'>
          <Routes>
            <Route path="/" element={<SignIn />} /> {/* Always render the SignIn component */}
            <Route path="/signup" element={<SignUp />} />
            <Route path="/select" element={<Select />} />
            <Route path="/home" element={<Home />} />
            <Route path="/t" element={<Test />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/Create" element={<CreateUnit />} />
            <Route path="/User" element={<UserPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
