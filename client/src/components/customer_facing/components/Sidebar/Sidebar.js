import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sidebarBoolean } from "../../../../actions"
import { getSidebarCategories } from "../../../../utils/API"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from "@fortawesome/free-solid-svg-icons"

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
    let categories = await this.props.getSidebarCategories()
    this.setState({ categories: categories.data })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.props.sidebar === true && !this.node.contains(e.target) && e.target.id !== "sidebar_bars" && !e.target.classList.contains("header_container") && e.target.tagName !== "svg" && e.target.tagName !== "path") {
      this.props.sidebarBoolean(!this.props.sidebar)
    }
  }

  renderCategories(parent_cat) {
    let categories = parent_cat === null ? this.state.categories : parent_cat.sub_categories
    categories = categories.sort((a,b) => {
      return a.display_order - b.display_order
    })
    return categories.map((category, index) => {
      return (
        <div key={index} style={ parent_cat === null ? null : { wordWrap: "break-word", marginLeft: "10px", maxWidth: "8em" } }>
          <div>
            <FontAwesomeIcon className="inline color-white" style={{ marginRight: "5px" }} icon={faCaretRight} />
            <Link onClick={() => this.props.sidebarBoolean(!this.props.sidebar)} className="inline" to={`/shop/${category.path_name}`}>{category.name}</Link>
          </div>
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
        <div ref={node => this.node = node} className={"flex flex_column space-between theme-background-2 sidebar " + sidebar_class}>
          <div className="padding-m font-size-20">
            <h3 className="margin-top-none">Categories</h3>
            {this.renderCategories(null)}
          </div>
          <div className="padding-m">
            <Link onClick={() => this.props.sidebarBoolean(!this.props.sidebar)} to="/faq">FAQ</Link>
          </div>
        </div>
      </>
    )
  }
}



function mapStateToProps({ sidebar }) {
  return { sidebar }
}

const actions = { sidebarBoolean, getSidebarCategories }

export default connect(mapStateToProps, actions)(Sidebar)