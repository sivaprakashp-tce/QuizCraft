import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Dashboard = () => {
  return (
    <React.Fragment>
      <Navbar />
      <div className="w-screen min-h-[92vh]">
        <DashboardHeader name={'User'}/>
      </div>
      <Footer />
    </React.Fragment>
  )
}

const DashboardHeader = ({name}) => {
  return (
    <React.Fragment>
      <div className="dashboard-header-cont h-64 flex flex-col justify-center items-center gap-4">
        <h1 className="text-5xl text-yellow-500 font-black">Hello, {name}!</h1>
        <h3 className="text-3xl text-slate-300">Tagline</h3>
      </div>
    </React.Fragment>
  )
}

export default Dashboard
