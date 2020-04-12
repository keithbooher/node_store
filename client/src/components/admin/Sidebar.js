import React, { Component } from 'react'

class Sidebar extends Component {
  constructor(props) {
    super()
    this.chooseTab = props.chooseTab
    this.state = {}
  }
  


  render() {
    return (
      <div className="flex flex_column">
        <a onClick={() => this.chooseTab("Dashboard")}>Dashboard</a>
        <a onClick={() => this.chooseTab("Orders")}>Orders</a>
        <a onClick={() => this.chooseTab("Products")}>Products</a>
        <a onClick={() => this.chooseTab("Categories")}>Categories</a>
        <a onClick={() => this.chooseTab("Users")}>Users</a>
        <a onClick={() => this.chooseTab("Reviews")}>Reviews</a>
      </div>
    )
  }
}

export default Sidebar