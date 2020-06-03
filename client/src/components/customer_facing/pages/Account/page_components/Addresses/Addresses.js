import React, { Component } from 'react'
import AddressCard from '../../../../components/AddressCard'
import NewAddress from './NewAddress';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons"

class Addresses extends Component {
  constructor(props) {
    super()
    this.showForm = this.showForm.bind(this)
    this.state = {
      showForm: null
    }
  }

  showForm(bill_or_ship) {
    this.setState({ showForm: bill_or_ship })
  }

  render() {
    return (
    <div>
      {this.state.showForm &&
        <FontAwesomeIcon 
          className="hover"
          onClick={() => this.showForm(null)} 
          icon={faTimesCircle}
          style={{ marginBottom: "-40px" }}
        />
      }
      {this.state.showForm === null ?
        <div>
          <AddressCard showForm={this.showForm} bill_or_ship="billing_address" />    
          <AddressCard showForm={this.showForm} bill_or_ship="shipping_address" />    
        </div>
      : ""}
      
      {this.state.showForm === "billing_address" && 
        <NewAddress showForm={this.showForm} bill_or_ship={"billing"} />
      }
      {this.state.showForm === "shipping_address" && 
        <NewAddress showForm={this.showForm} bill_or_ship={"shipping"} />
      }
    </div>
    )
  }
}

export default Addresses