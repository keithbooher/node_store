import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Sidebar from '../../admin/Sidebar'
import AdminDashboard from '../../admin/AdminDashboard'
import Categories from '../../admin/Categories'
import Shipping from "../../admin/Shipping"
import Orders from '../../admin/Orders'
import OrderPage from '../../admin/Orders/OrderPage'
import OrderCreate from '../../admin/Orders/OrderCreate'
import Products from '../../admin/Products'
import Reviews from '../../admin/Reviews'
import Users from '../../admin/Users'
import UserPage from '../../admin/Users/UserPage'
import "./admin.scss"

class Admin extends Component {
  constructor(props) {
    super()
    this.state = {
    }
  }
  

  render() {
    return (
      <div id="admin_container">
        <div id="admin_sidebar_container" className="relative border padding-s" style={{ backgroundColor: '#22292F' }}>
          <Sidebar />
        </div>
        <div id="admin_content_container" className="relative padding-s color-black" style={{ backgroundColor: "#F1F5F8" }}>
          <Route exact path="/admin" component={AdminDashboard} />
          <Route exact path="/admin/orders" component={Orders} />
          <Route exact path="/admin/orders/:id" component={OrderPage} />
          <Route exact path="/admin/order/create" component={OrderCreate} />
          <Route path="/admin/products" component={Products} />
          <Route exact path="/admin/categories" component={Categories} />
          {/* <Route exact path="/admin/categories/edit/:id" component={EditCategory} /> Not needed right now, not enough attributes to warrant its own page */} 
          <Route exact path="/admin/users" component={Users} />
          <Route exact path="/admin/users/:id" component={UserPage} />
          <Route path="/admin/reviews" component={Reviews} />
          <Route path="/admin/shipping" component={Shipping} />
        </div>
      </div>
    )
  }
}

export default Admin