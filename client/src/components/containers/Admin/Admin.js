import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Sidebar from '../../admin/Sidebar/Sidebar'
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
import Carts from "../../admin/Carts"
import Cart from "../../admin/Carts/Cart"
import StoreSettings from "../../admin/StoreSettings "
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/free-solid-svg-icons"
import "./admin.scss"
class Admin extends Component {
  constructor(props) {
    super()
    this.myRef = React.createRef();

    this.sidebar = this.sidebar.bind(this)
    this.state = {
      sidebar: null
    }
  }

  sidebar() {
    this.setState({ sidebar: !this.state.sidebar })
  }
  

  render() {
    let sidebar_class
    let content_class
    let container_class
    switch (this.state.sidebar) {
      case true:
        container_class = "admin_sidebar_open_container"
        content_class = "admin_sidebar_open_content"
        sidebar_class = "admin_sidebar_open"
        break;
      case false:
        container_class = "admin_sidebar_closed_container"
        content_class = "admin_sidebar_closed_content"
        sidebar_class = "admin_sidebar_closed"        
        break;
      case null:
        container_class = ""
        content_class = ""
        sidebar_class = ""                
        break;
      default:
        container_class = ""
        content_class = ""
        sidebar_class = ""      
        break;
    }


    return (
      <div id="admin_container" className={`${container_class}`}>
        <div className={`relative border padding-s admin_sidebar ${sidebar_class}`} style={{ backgroundColor: '#22292F' }}>
          <Sidebar setSidebar={this.sidebar} sidebar={this.state.sidebar} />
        </div>

        <div ref={this.myRef} className={`relative color-black h-100 overflow-scroll`} style={{ backgroundColor: "#F1F5F8"  }}>
          <div className="padding-s h-100">
            <FontAwesomeIcon id="sidebar_bars" className={`${content_class}`} onClick={this.sidebar} style={{ position: "fixed", top: "5px", left: "5px" }} icon={faBars} />
            <Route exact path="/admin" component={AdminDashboard} />
            <Route exact path="/admin/orders" component={Orders} />
            <Route exact path="/admin/orders/:id" component={OrderPage} />
            <Route exact path="/admin/order/create" component={() => <OrderCreate refProp={this.myRef} />} />
            <Route path="/admin/products" component={Products} />
            <Route exact path="/admin/categories" component={Categories} />
            {/* <Route exact path="/admin/categories/edit/:id" component={EditCategory} /> Not needed right now, not enough attributes to warrant its own page */} 
            <Route exact path="/admin/users" component={Users} />
            <Route exact path="/admin/users/:id" component={UserPage} />
            <Route path="/admin/reviews" component={Reviews} />
            <Route path="/admin/shipping" component={Shipping} />
            <Route path="/admin/carts" component={Carts} />
            <Route path="/admin/cart/:id" component={Cart} />
            <Route path="/admin/store-settings" component={StoreSettings} />
          </div>

        </div>
      </div>
    )
  }
}

export default Admin