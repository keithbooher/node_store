import React, { Component } from 'react';
import { connect } from 'react-redux'
// note that you can also export the source data via CountryRegionData. It's in a deliberately concise format to 
// keep file size down
import { CountryDropdown } from 'react-country-region-selector';


class FormSelectStates extends Component {
  constructor (props) {
    super(props);
    this.selectCountry = this.selectCountry.bind(this)
    this.state = { country: '' };
  }


  selectCountry (val) {
    if (!this.props.options) {
      this.props.change("country", val)
    }else if (this.props.options.bill_or_ship === "shipping") {
      this.props.change("country_shipping", val)
    } else if (this.props.options.bill_or_ship === "billing") {
      this.props.change("country_billing", val)
    }
    this.setState({ country: val });
  }

  render () {
    const { country } = this.state;
    return (
      <>
        <div className="inline">
            
          <label style={{ marginTop: "10px" }} >{this.props.label}</label>
          <CountryDropdown
            value={country}
            onChange={(val) => this.selectCountry(val)} 
            className={`${this.props.mobile ? "w-100" : "inline w-40"} padding-s`} 
          />
        </div>
        <br />
      </>
    );
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(FormSelectStates)