import React, { Component }  from 'react'
import DropdownList from 'react-widgets/lib/DropdownList'
import { connect } from 'react-redux'
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
    if (default_option) {
      this.props.change(default_option.redux_field, default_option)
    }
    this.setState({ chosen: default_option })
  }

  // componentUpdateMount() {
  //   let default_option = this.props.options.find(option => option.default === true)

  //   this.setState({ chosen: default_option })
  // }

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
      <div className={`${this.props.mobile ? "" : "w-70"}`}>
        <label style={this.props.mobile ? {} : { fontSize: "20px" }}>{this.props.label}</label>
        <div style={this.props.mobile ? {} : { fontSize: "20px" }}>
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
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(FormDropdown)