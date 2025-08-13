import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './Layout';
import DashBoard from './pages/DashBoard';
import EditForm from './pages/EditForm';
import FillForm from './pages/FillForm';
import VerifyEmail from './pages/auth/VerifyEmail';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';


const App = () => {
    
    return (
        <div>
            <BrowserRouter>
                <Routes>

                    <Route path="/auth">

                        <Route path="login" element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                        <Route path="verify-email" element={<VerifyEmail />} />
                    </Route>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<DashBoard />} />

                        <Route path="form">
                            <Route path="edit/:formId" element={<EditForm />} />
                            <Route path="fill/:formId" element={<FillForm />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App