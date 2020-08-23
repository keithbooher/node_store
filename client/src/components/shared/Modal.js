import React, { Component } from 'react'
import mobile from "is-mobile"

let isMobile = mobile()

class Product extends Component  {
  constructor(props) {
    super()
    this.ref = React.createRef()
    this.outerRef = React.createRef()
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.state = {

    }
  }
  
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleClickOutside(e) {
    if(e.target === this.ref.current || this.ref.current.contains(e.target)) {
      return
    } else {
      this.props.cancel()
    }
  }

  render() {

    const style_outer = {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#4242428a",
      zIndex: 25
    }

    const style_inner = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: isMobile ? "90%" : "30em",
      height: "auto",
      padding: "3em",
      zIndex: 30
    }

    return (
      <div id="outer" ref={this.outerRef} style={ style_outer }>
        <div id="inner" ref={this.ref} className="theme-modal-background-color border-radius-s color-white" style={ style_inner }>
          {this.props.children}
        </div>
      </div>
    )
  }
}


export default Product