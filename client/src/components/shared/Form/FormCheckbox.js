import React, { Component, useState, useEffect }  from 'react'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormCheckbox extends Component {
  constructor(props) {
    super()
    this.inputRef = React.createRef();
    this.state = {
      category_id: null
    }
  }
  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <input type="checkbox" className={this.props.field_class} onChange={() => this.setState({ boolean: !this.state.boolean })} value={this.state.boolean} {...this.props.input} style={{ marginBottom: '5px' }} />
      </div>
    )
  }
}

export default FormCheckbox