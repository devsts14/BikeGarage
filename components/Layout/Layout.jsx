import React from 'react'
import Navbar from '../Navbar/Navigation/Navbar'
import LocationBar from '../Navbar/LocationBar/LocationBar'

const Layout = ({children,user,token}) => {
    console.log(user,token)
    return (
        <>
        <Navbar user={user} token={token}/>
        <LocationBar/>
        <div>
            {children}
        </div>

            
        </>
    )
}

export default Layout
