import React, { Component, useState, useEffect }  from 'react'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormDropdown extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }
  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <DropdownList
          data={this.props.options}
          valueField="cost"
          textField="name"
          onChange={this.props.input.onChange}
        />
      </div>
    )
  }
}

export default FormDropdown