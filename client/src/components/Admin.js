import React, { Component } from 'react'
import Sidebar from './admin/Sidebar'
import AdminDashboard from './admin/AdminDashboard'
import Categories from './admin/Categories'
import Orders from './admin/Orders'
import Products from './admin/Products'
import Reviews from './admin/Reviews'
import Users from './admin/Users'

class Admin extends Component {
  constructor(props) {
    super()
    this.chooseTab = this.chooseTab.bind(this)
    this.state = {
      chosen_tab: "Dashboard"
    }
  }
  
  chooseTab(tab) {
    this.setState({ chosen_tab: tab })
  }

  render() {
    let chosen_tab = this.state.chosen_tab
    return (
      <div id="admin_container">
        <div id="admin_sidebar_container" className="relative border padding-s" style={{ backgroundColor: '#22292F' }}>
          <Sidebar chooseTab={this.chooseTab} />
        </div>
        <div id="admin_content_container" className="relative padding-s color-black" style={{ backgroundColor: "#F1F5F8" }}>
          {chosen_tab === "Dashboard" ? <AdminDashboard /> : ""}
          {chosen_tab === "Orders" ? <Orders /> : ""}
          {chosen_tab === "Products" ? <Products /> : ""}
          {chosen_tab === "Categories" ? <Categories /> : ""}
          {chosen_tab === "Users" ? <Users /> : ""}
          {chosen_tab === "Reviews" ? <Reviews /> : ""}
        </div>
      </div>
    )
  }
}

export default Admin