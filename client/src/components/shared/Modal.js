import React, { Component } from 'react'
import { connect } from 'react-redux'
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
      width: this.props.width_auto ? "auto" : (isMobile ? "90%" : "30em"),
      height: "auto",
      zIndex: 30
    }

    if (!this.props.mobile) {
      style_inner.fontSize = "25px"
    }

    console.log(this.props)

    return (
      <div id="outer" ref={this.outerRef} style={ style_outer }>
        <div id="inner" ref={this.ref} className="theme-background-3 border-radius-s color-white padding-m" style={ style_inner }>
          {this.props.children}
        </div>
      </div>
    )
  }
}


function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(Product)