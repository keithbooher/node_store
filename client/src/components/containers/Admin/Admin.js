import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
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
import UpdateRelatedProducts from '../../admin/Products/UpdateRelatedProducts';
import Four04Page from "../../shared/Four04Page"
import MetaTags from 'react-meta-tags'
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
        if (this.props.mobile) {
          content_class = "admin_sidebar_open_content"
          sidebar_class = "admin_sidebar_open"
        } else {
          content_class = "admin_sidebar_open_content_desktop"
          sidebar_class = "admin_sidebar_open_desktop"
        }
        container_class = "admin_sidebar_open_container"
        break;
      case false:
        if (this.props.mobile) {
          content_class = "admin_sidebar_closed_content"
          sidebar_class = "admin_sidebar_closed" 
        } else {
          content_class = "admin_sidebar_closed_content_desktop"
          sidebar_class = "admin_sidebar_closed_desktop" 
        }
        container_class = "admin_sidebar_closed_container"
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

    let bars_style = {
      position: "fixed", 
      top: "5px", 
      left: "5px",
      fontSize: "1em"
    }
    if (!this.props.mobile) {
      bars_style.fontSize = "25px"
    }


    return (
      <div id="admin_container" className={`${container_class} ${!this.props.mobile && "w-90 margin-auto-h"}`} style={{ maxWidth: "1200px" }}>
        <MetaTags>
          <title>Node Store Admin</title>
          <meta name="description" content="Take control of your store" />
          <meta name="keywords" content="" />
        </MetaTags>
        <div className={`relative border ${this.props.mobile ? "admin_sidebar padding-s" : "admin_sidebar_desktop"} ${sidebar_class}`} style={{ backgroundColor: '#22292F' }}>
          <Sidebar setSidebar={this.sidebar} sidebar={this.state.sidebar} />
        </div>

        <div ref={this.myRef} className={`relative color-black h-100 ${this.props.mobile && "overflow-scroll"}`}>
          <div className="padding-s h-100">
            <FontAwesomeIcon id="sidebar_bars" className={`${content_class} hover hover-color-2`} onClick={this.sidebar} style={ bars_style } icon={faBars} />
            <Switch>
              <Route exact path="/admin" component={AdminDashboard} />
              <Route exact path="/admin/orders" component={Orders} />
              <Route exact path="/admin/orders/:id" component={OrderPage} />
              <Route exact path="/admin/order/create" component={() => <OrderCreate refProp={this.myRef} />} />
              <Route exact path="/admin/product/related_products/:product_id" component={UpdateRelatedProducts} />
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
              <Route component={Four04Page} />
            </Switch>
          </div>

        </div>
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(Admin)