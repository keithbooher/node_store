import React, { Component, useState, useEffect }  from 'react'
import Multiselect from 'react-widgets/lib/Multiselect'
import 'react-widgets/dist/css/react-widgets.css'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormDropDown extends Component {
  constructor(props) {
    super()
    this.inputRef = React.createRef();
    this.state = {
      category_id: null
    }
  }
  render() {
    console.log(this.props)
    return (
      <div>
        <label>{this.props.label}</label>
        <Multiselect
          data={this.props.options}
          valueField="_id"
          textField="name"
          onChange={this.props.input.onChange}
        />
      </div>
    )
  }
}

export default FormDropDown