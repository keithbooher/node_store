import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {
  constructor(props) {
    super()
    this.state = {}
  }

  render() {
    return (
      <div className="flex flex_column">
        <NavLink activeClassName="color-white" exact to="/admin">Dashboard</NavLink>
        <NavLink activeClassName="color-white" exact to="/admin/orders">Orders</NavLink>
        <NavLink activeClassName="color-white" exact to="/admin/products">Products</NavLink>
        <NavLink activeClassName="color-white" exact to="/admin/categories">Categories</NavLink>
        <NavLink activeClassName="color-white" exact to="/admin/users">Users</NavLink>
        <NavLink activeClassName="color-white" exact to="/admin/reviews">Reviews</NavLink>
      </div>
    )
  }
}

export default Sidebar