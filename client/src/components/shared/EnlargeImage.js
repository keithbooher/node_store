import React, { Component } from 'react'
import Modal from "./Modal"
import { Link } from "react-router-dom"

class EnlargeImage extends Component {
  constructor(props) {
    super()

    this.state = {

    }
  }

  async componentDidMount() {

  }


  render() {

    const image_style = {
      height: "auto",
      width: "auto",
      maxHeight: "500px",
      maxWidth: "100%",
      margin: "0px auto"
    }

    return (
      <Modal cancel={this.props.cancel} >
        <img style={image_style} src={this.props.image} />
        <div className="flex">

          <button onClick={this.props.cancel} className="margin-s"><Link to={this.props.path}>Go to Product</Link></button>
          <button onClick={this.props.cancel} className="margin-s">Done</button>
        </div>
      </Modal>

    )
  }
}

export default EnlargeImage