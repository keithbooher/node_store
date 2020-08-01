import React, { Component }  from 'react'
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormDropdown extends Component {
  constructor(props) {
    super()
    console.log(this.default_option)
    this.state = {
      chosen: null
    }
  }

  componentDidMount() {
    let default_option = this.props.options.find(option => option.default === true)

    this.setState({ chosen: default_option })
  }

  componentUpdteMount() {
    let default_option = this.props.options.find(option => option.default === true)

    this.setState({ chosen: default_option })
  }

  onChange(option) {
    this.setState({ chosen: option.value })
    this.props.change(option.redux_field, option)
  }

  onSubmit(option) {
    this.setState({ chosen: option.value })
    this.props.onSubmit(option.redux_field, option)
  }

  render() {
    let default_option = this.props.options.find(option => option.default === true)

    return (
      <div>
        <label>{this.props.label}</label>
        <DropdownList
          data={this.props.options}
          valueField="value"
          textField="name"
          onChange={e => this.onChange(e)}
          onSubmit={e => this.onSubmit(e)}
          defaultValue={default_option}
          value={this.state.chosen}
        />
      </div>
    )
  }
}

export default FormDropdown