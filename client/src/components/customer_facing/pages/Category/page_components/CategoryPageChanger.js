import React, { Component } from 'react'

class CategoryPageChanger extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
  }
  
  async changePage(direction) {
    let direction_reference_product_id
    let page_increment
    if (direction === "next") {
      page_increment = 1
      direction_reference_product_id = this.props.list_items[this.props.list_items.length - 1]
    } else {
      page_increment = -1
      direction_reference_product_id = this.props.list_items[0]
    }
    
    await this.props.requestMore(direction_reference_product_id.category_display_order[this.props.category._id], direction, page_increment)
  }

  render() {
    let previous_disable = this.props.page_number === 1 ? true : false
    let next_disable = 
      this.props.list_items.length < 10 ? true :
      this.props.lastPossibleItem === true ? true :
      false
    return (
      <div className="flex">
        <button onClick={previous_disable === true ? "" : () => this.changePage('previous')} style={ previous_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "#6CB2EB" }} className="bare_button">Previous</button>
        <div className="font-size-1-3">{this.props.page_number}</div>
        <button onClick={next_disable === true ? "" : () => this.changePage('next')} style={ next_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "#6CB2EB" }} className="bare_button">Next</button>
      </div>
    )
  }
}

export default CategoryPageChanger
