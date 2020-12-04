import React, { Component } from 'react'
import { connect } from 'react-redux'
import SelectUSState from 'react-select-us-states';
class FormModal extends Component {
  constructor(props) {
    super()
    this.setNewValue = this.setNewValue.bind(this)
    this.state = {

    }
  }

  setNewValue(newValue) {
    if (!this.props.options) {
      this.props.change("state", newValue)
    }else if (this.props.options.bill_or_ship === "shipping") {
      this.props.change("state_shipping", newValue)
    } else if (this.props.options.bill_or_ship === "billing") {
      this.props.change("state_billing", newValue)
    }
  }

  render() {
    return (
      <div className="inline">
        <label>{this.props.label}</label>
        <SelectUSState 
          style={this.props.mobile ? {} : { marginRight: "20px" }} 
          className={`${this.props.mobile ? "" : "inline"} padding-s font-size-20 w-90`} 
          onChange={this.setNewValue}
        />
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


export default connect(mapStateToProps, null)(FormModal)