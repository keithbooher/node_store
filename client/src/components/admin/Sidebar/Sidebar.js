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
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin">Dashboard</NavLink>
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin/orders">Orders</NavLink>
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin/products">Products</NavLink>
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin/categories">Categories</NavLink>
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin/users">Users</NavLink>
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin/reviews">Reviews</NavLink>
        <NavLink onClick={this.props.sidebar} activeClassName="color-white" exact to="/admin/shipping/methods">Shipping</NavLink>
      </div>
    )
  }
}

export default Sidebar