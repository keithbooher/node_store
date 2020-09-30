import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from "./Modal"
import { Link } from "react-router-dom"
import { dispatchEnlargeImage } from "../../actions"

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
      margin: "0px auto",
      paddingTop: "10px"
    }

    return (
      <Modal width_auto={true} cancel={() => this.props.dispatchEnlargeImage(null)} >
        <img onClick={() => this.props.dispatchEnlargeImage(null)} style={image_style} src={this.props.image} />
        <div className="flex margin-s-v">
          <button onClick={() => this.props.dispatchEnlargeImage(null)} className="margin-s" style={{ paddingTop: "5px", paddingBottom: "5px" }}><Link to={this.props.path}>Go to Product</Link></button>
          <button onClick={() => this.props.dispatchEnlargeImage(null)} className="margin-s" style={{ paddingTop: "5px", paddingBottom: "5px" }}>Done</button>
        </div>
      </Modal>

    )
  }
}


function mapStateToProps({ enlarge }) {
  return { enlarge }
}

const actions = { dispatchEnlargeImage }

export default connect(mapStateToProps, actions)(EnlargeImage)