import React, { Component } from 'react'
import Form from "./Form"

class FormModal extends Component {
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
    }

    const style_inner = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "30em",
      height: "auto",
      padding: "3em",
      zIndex: 20
    }

    return (
      <div id="outer" ref={this.outerRef} style={ style_outer }>
        <div id="inner" ref={this.ref} className="theme-nav-background-color color-white" style={ style_inner }>
          {this.props.title && this.props.title}
          <Form 
            onSubmit={this.props.onSubmit}
            cancel={this.props.cancel}
            submitButtonText={this.props.submitButtonText}
            formFields={this.props.formFields}
            form={this.props.form}
            validation={this.props.validate}
            initialValues={this.props.initialValues ? this.props.initialValues : null}
          />
        </div>
      </div>

    )
  }
}

export default FormModal