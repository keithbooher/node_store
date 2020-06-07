import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sidebarBoolean } from "../../../../actions"
import { getSidebarCategories } from "../../../../utils/API"
import { Link } from 'react-router-dom'

import "./sidebar.scss"

class Sidebar extends Component  {
  constructor(props) {
    super()
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      categories: []
    }
  }

  async componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    // find all categories that have been selected to be shown to the customers
    let categories = await getSidebarCategories()
    this.setState({ categories: categories.data })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.props.sidebar === true && !this.node.contains(e.target)) {
      this.props.sidebarBoolean(!this.props.sidebar)
    }
  }

  renderCategories(parent_cat) {
    let categories = parent_cat === null ? this.state.categories : parent_cat.sub_categories
    categories = categories.sort((a,b) => {
      return a.display_order - b.display_order
    })
    return categories.map((category) => {
      return (
        <div style={ parent_cat === null ? null : { marginLeft: "10px" } }>
          <Link to={`/shop/${category.path_name}`}>{category.name}</Link>
          <div>{this.renderCategories(category)}</div>
        </div>
      )
    })
  }
  
  render() {
    let sidebar_class
    switch (this.props.sidebar) {
      case true:
        sidebar_class = "sidebar_open"
        break;
    
      case false:
        sidebar_class = "sidebar_closed"        
        break;
    
      default:
        sidebar_class = ""
        break;
    }

    return (
      <>
        <div ref={node => this.node = node} className={"sidebar " + sidebar_class}>
          <div style={{ color: "black" }}>
            {this.renderCategories(null)}
          </div>
        </div>
      </>
    )
  }
}



function mapStateToProps({ sidebar }) {
  return { sidebar }
}

const actions = { sidebarBoolean }

export default connect(mapStateToProps, actions)(Sidebar)