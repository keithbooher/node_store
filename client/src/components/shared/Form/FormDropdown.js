import React, { Component }  from 'react'
import DropdownList from 'react-widgets/lib/DropdownList'
import { connect } from 'react-redux'
import 'react-widgets/dist/css/react-widgets.css'

// export default ({ input, label, field_class, options, onChange, meta: { error, touched } }) => {
class FormDropdown extends Component {
  constructor(props) {
    super()
    this.state = {
      chosen: null
    }
  }

  componentDidMount() {
    let default_option = this.props.options.find(option => option.default === true)
    if (default_option) {
      this.props.change(default_option.redux_field, default_option)
    }
    if (!default_option) {
      default_option = null
    }
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

    let dropdown = document.getElementsByClassName("rw-dropdown-list")[0]
    if (!this.props.mobile && dropdown) {
      dropdown.style.width = "400px"
    }

    console.log(this.props)

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
            itemComponent={this.props.dropDownCustomItemComponent}
            valueComponent={this.props.dropDownCustomValueComponent}
          />
        </div>
        {/* <input value={this.state.chosen} {...this.props.input} style={{ display: "none" }} /> */}
        <div className="color-red-5" style={{marginBottom: '5px'}}>
          {this.props.meta.touched && this.props.meta.error}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(FormDropdown)