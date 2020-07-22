import React, { Component } from 'react'
import Form from "./Form"
import Modal from "../Modal"
class FormModal extends Component {
  constructor(props) {
    super()

    this.state = {

    }
  }


  render() {
    return (
      <Modal cancel={this.props.cancel}>
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
      </Modal>

    )
  }
}

export default FormModal