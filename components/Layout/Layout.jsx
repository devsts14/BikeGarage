import React from 'react'
import Navbar from '../Navbar/Navigation/Navbar'
import LocationBar from '../Navbar/LocationBar/LocationBar'

const Layout = ({children}) => {
    return (
        <>
        <Navbar/>
        <LocationBar/>
        <div>
            {children}
        </div>

            
        </>
    )
}

export default Layout
