import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTimes } from "@fortawesome/free-solid-svg-icons"

class FormFieldDisabled extends Component {
  constructor(props) {
    super()
    this.changeDisbaled = this.changeDisbaled.bind(this)
    this.state = {
      disabled: true
    }
  }

  changeDisbaled(){
    this.setState({ disabled: !this.state.disabled })
  }

  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <input disabled = {this.state.disabled === true ? "disabled" : ""} className={this.props.field_class} onChange={this.props.onChange} value={this.props.input.value} {...this.props.input} style={{ marginBottom: '5px' }} />
        {this.state.disabled === false ?
        <div onClick={this.changeDisbaled}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
        : <div onClick={this.changeDisbaled}>
          <FontAwesomeIcon icon={faEdit} />
        </div> }
      </div>
    )
  }
}

export default FormFieldDisabled