import React, { Component }  from 'react'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormDropdown extends Component {
  constructor(props) {
    super()
    this.default_option = props.options.find(option => option.default === true)

    this.state = {
      chosen: this.default_option
    }
  }

  componentDidMount() {
    this.props.change(this.default_option.redux_field, this.default_option)
  }

  onChange(option) {
    this.setState({ chosen: option.value })
    this.props.change(option.redux_field, option)
  }

  render() {
    return (
      <div>
        <label>{this.props.label}</label>
        <DropdownList
          data={this.props.options}
          valueField="value"
          textField="name"
          onChange={e => this.onChange(e)}
          defaultValue={this.default_option}
          value={this.state.chosen}
        />
      </div>
    )
  }
}

export default FormDropdown