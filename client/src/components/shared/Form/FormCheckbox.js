import React, { Component, useState, useEffect }  from 'react'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormCheckbox extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }
  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        {this.props.input.value === true ? 
        <input type="checkbox" className={this.props.field_class} checked {...this.props.input} style={{ marginBottom: '5px' }} />
        : <input type="checkbox" className={this.props.field_class} {...this.props.input} style={{ marginBottom: '5px' }} />}
      </div>
    )
  }
}

export default FormCheckbox