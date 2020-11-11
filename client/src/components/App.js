import React, { useState, useEffect } from 'react'
import { BrowserRouter, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser, setDevice, taxSettingCheck } from '../actions'
import '../stylesheets/all.css.scss'

import Admin from './containers/Admin'
import Customer from './containers/CustomerFacing'
import Error from "./shared/Error"

import PrivateRoute from './PrivateRoute'

import mobile from "is-mobile"

let isMobile = mobile()


const checkAdmin = (user) => {
  let admin 
  switch (user) {
    case undefined:
      admin = null      
      break;
    case null:
      admin = false      
      break;
    case '':
      admin = false      
      break;
    default:
      if (user.role === "admin") {
        admin = true
      } else {
        admin = false
      }
      break;
  }
  return admin
}



const App = ({ fetchUser, auth, setDevice, taxSettingCheck }) => {
  const [admin, setAdmin] = useState(null)
  useEffect(() => {
    async function mount() {
      // Check to see if user is logged in
      let user = await fetchUser()
      let checkedAdmin = checkAdmin(user)
      taxSettingCheck()
      setAdmin(checkedAdmin)
      setDevice(isMobile)
    }
    mount()
    return () => {}
  }, [])

  return (
    <BrowserRouter>
      {auth && 
        <>
          <CustomerFacing auth={auth} />
          <PrivateRoute admin={admin} path="/admin">
            <Admin />
          </PrivateRoute>
        </>
      }
      <Error />
    </BrowserRouter>
  )

}

const CustomerFacingSwitch = (props) => {
  const { location, auth } = props;
  if (location.pathname.match('/admin')){
    return null;
  }
  return (
    <Customer auth={auth} />
  )
}

const CustomerFacing = withRouter(CustomerFacingSwitch);


function mapStateToProps({ auth }) {
  return { auth}
}

const actions = { fetchUser, taxSettingCheck, setDevice }

export default connect(mapStateToProps, actions)(App)