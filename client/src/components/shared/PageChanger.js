import React, { Component } from 'react'

class PageChanger extends Component {
  constructor(props) {
    super()
    this.changePage = this.changePage.bind(this)
    this.state = {
      page_number: 1
    }
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
    
    const request = await this.props.requestMore(direction_reference_product_id._id, direction)
    // TO DO 
    // Check if the request was succesful. Display error if not.
    this.setState({ page_number: this.state.page_number + page_increment })
  }

  render() {
    let previous_disable = this.state.page_number === 1 ? true : false
    let next_disable = this.props.list_items.length < 10 ? true : false
    return (
      <div className="flex">
        <button onClick={previous_disable === true ? "" : () => this.changePage('previous')} style={ previous_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "black" }} className="bare_button">Previous</button>
        <div className="font-size-1-3">{this.state.page_number}</div>
        <button onClick={next_disable === true ? "" : () => this.changePage('next')} style={ next_disable === true ? { color: "lightgrey", cursor: "default" } : { color: "black" }} className="bare_button">Next</button>
      </div>
    )
  }
}

export default PageChanger
