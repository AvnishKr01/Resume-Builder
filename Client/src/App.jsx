import React from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import EditResume from './component/EditResume'
import { Toaster } from 'react-hot-toast'

const App = () => {

  return (
    <>
     <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resume/:resumeId' element={<EditResume/>}/>
        {/* <Route path={`/resume/:${resumeId}`} element={<EditResume/>}/> */}
      </Routes>
      
      <Toaster toastOptions={{
        className:"",
        style:{
          fontSize: "13px"
        }
      }}>
        
      </Toaster>
    </>
  )
}

export default App