import React, { Component, useState, useEffect }  from 'react'
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormMultiSelect extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }
  render() {
    let default_categories = []
    this.props.options.forEach((option) => {
      if (option.default === true) {
        default_categories.push(option._id)
      }
    })
    return (
      <div>
        <label>{this.props.label}</label>
        <Multiselect
          data={this.props.options}
          valueField="_id"
          defaultValue={default_categories}
          textField="name"
          onChange={this.props.input.onChange}
        />
      </div>
    )
  }
}

export default FormMultiSelect