import React, { useContext } from 'react';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext'; // ✅ fix the context import
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import DeshBoard from './pages/Admin/DeshBoard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/addDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointment from './pages/Doctor/DoctorAppointment';




const App = () => {
  const { aToken } = useContext(AdminContext); // ✅ make sure this matches the correct context

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
    
      <ToastContainer />
      <Navbar/>
      
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<DeshBoard/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />

          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appointment' element={<DoctorAppointment />} />
          


        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
