import React, { Component } from 'react'


class ReviewPanel extends Component  {
  constructor(props) {
    super()
    this.state = {

    }
  }

  
  render() {
    // This panel is for show the user that they have successfully placed 
    // their order and to show them their order number
    return (
      <div id="">
        {this.props.chosen_tab === "review" ? 
          
          "Congrats on your order! You figure it out from here :]"

        : ""}
      </div>
    )
  }
}

export default ReviewPanel