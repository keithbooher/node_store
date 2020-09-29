import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

class Sidebar extends Component {
  constructor(props) {
    super()
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {}
  }

  async componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.props.sidebar === true && !this.node.contains(e.target) && e.target.id !== "sidebar_bars" && e.target.tagName !== "svg" && e.target.tagName !== "path") {
      this.props.setSidebar()
    }
  }

  render() {
    return (
      <div ref={node => this.node = node} className="flex flex_column">
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin">Dashboard</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/orders">Orders</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/products">Products</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/categories">Categories</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/users">Users</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/reviews">Reviews</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/shipping/methods">Shipping</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/carts">Carts</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/store-settings">Store Settings</NavLink>
        <NavLink onClick={this.props.setSidebar} activeClassName="color-white" className="margin-s-v bold hover-color-7" style={{ fontSize: "19px" }} exact to="/admin/discount-codes">Discount Codes</NavLink>
      </div>
    )
  }
}

export default Sidebar