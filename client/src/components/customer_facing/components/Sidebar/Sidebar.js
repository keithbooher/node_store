import React, { Component } from 'react'
import { connect } from 'react-redux'
import { sidebarBoolean, showHeaderAction } from "../../../../actions"
import { getSidebarCategories, getGallerySetting } from "../../../../utils/API"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons"
import "./sidebar.scss"


class Sidebar extends Component  {
  constructor(props) {
    super()
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.state = {
      categories: [],
      gallery: false,
      showSub: null
    }
  }

  async componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    // find all categories that have been selected to be shown to the customers
    let categories = await this.props.getSidebarCategories()
    let { data, status } = await this.props.getGallerySetting()
    if (status !== 200 ) {
      data = {
        value: {
          boolean: false
        }
      }
    }
    this.setState({ categories: categories.data, gallery: data.value.boolean })
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if (this.props.sidebar === true && !this.node.contains(e.target) && e.target.id !== "sidebar_bars" && !e.target.classList.contains("header_container") && e.target.tagName !== "svg" && e.target.tagName !== "path") {
      this.props.sidebarBoolean(!this.props.sidebar)
      this.props.showHeaderAction("scrolling_up_nav_desktop_from_header")
    }
  }

  renderCategories() {
    let categories = this.state.categories
    categories = categories.sort((a,b) => {
      return a.display_order - b.display_order
    })
    return categories.filter((cat) => !cat.deleted_at).map((category, index) => {
      return (
        <div key={index} className="padding-m-v border-bottom-grey">
          <div className="flex">
            <FontAwesomeIcon onClick={() => this.setState({ showSub: [category._id] })} className="inline hover color-white" style={{ fontSize: "17px", marginRight: "5px", marginTop: "6px", visibility: category.sub_categories.length > 0 ? "visible" : "hidden" }} icon={faChevronDown} />
            <Link onClick={() => {
                this.setState({ showSub: [] })
                this.props.sidebarBoolean(!this.props.sidebar)
              }} className="inline hover-color-5" to={`/shop/${category.path_name}`}>{category.name}</Link>
          </div>
          <div>{category.sub_categories.length > 0 && this.subMenu(category, true)}</div>
        </div>
      )
    })
  }

  subMenu(cat, from_top) {
    if (from_top) {
      return cat.sub_categories.map((category, index) => {
        if (this.state.showSub && this.state.showSub.indexOf(cat._id) >= 0) {
          return (
            <div key={index} className="margin-s-v" style={{ wordWrap: "break-word", marginLeft: "15px", maxWidth: "8em" }}>
              <div className="flex">
                <FontAwesomeIcon onClick={() => this.setState({ showSub: this.state.showSub.concat(category._id)})} className="inline hover color-white" style={{ fontSize: "17px", marginRight: "5px", marginTop: "6px", visibility: category.sub_categories.length > 0 ? "visible" : "hidden" }} icon={faChevronDown} />
                <Link onClick={() => {
                    this.setState({ showSub: [] })
                    this.props.sidebarBoolean(!this.props.sidebar)
                  }} className="inline hover-color-5" to={`/shop/${category.path_name}`}>{category.name}</Link>
              </div>
              <div>{category.sub_categories.length > 0 && this.subMenu(category, false)}</div>
            </div>
          )
        } else {
          return null
        }
      })
    } else {      
      return cat.sub_categories.map((category, index) => {
        if (this.state.showSub && this.state.showSub.indexOf(cat._id) >= 0) {
          return (
            <div key={index} className="margin-s-v" style={{ wordWrap: "break-word", marginLeft: "15px", maxWidth: "8em" }}>
              <div className="flex">
                <FontAwesomeIcon onClick={() => this.setState({ showSub: this.state.showSub.concat(category._id)})} className="inline hover color-white" style={{ fontSize: "17px", marginRight: "5px", marginTop: "6px", visibility: category.sub_categories.length > 0 ? "visible" : "hidden" }} icon={faChevronDown} />
                <Link onClick={() => {
                    this.setState({ showSub: [] })
                    this.props.sidebarBoolean(!this.props.sidebar) 
                  }} className="inline hover-color-5" to={`/shop/${category.path_name}`}>{category.name}</Link>
              </div>
              <div>{category.sub_categories.length > 0 && this.subMenu(category, false)}</div>
            </div>
          )
        } else {
          return null
        }
      })
    }
  }
  
  render() {
    console.log(this.state)

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
        <div ref={node => this.node = node} className={"flex flex_column space-between theme-background-2 color-white sidebar " + sidebar_class}>
          <div className="padding-m font-size-20 h-100 overflow-auto">
            {this.state.gallery && <Link onClick={() => this.props.sidebarBoolean(!this.props.sidebar)} to="/gallery"><h3 className="margin-top-none underline">Gallery</h3></Link>}
            <h3 className="margin-top-none">Shop</h3>
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

const actions = { sidebarBoolean, showHeaderAction, getSidebarCategories, getGallerySetting }

export default connect(mapStateToProps, actions)(Sidebar)