import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

class DiscountCodes extends Component {
  constructor(props) {
    super()

    this.state = {

    }
  }

  render() {

    return (
      <div >
        <Link className="absolute" style={{ top: "5px", right: "5px" }} to={"/admin/discount-codes/create"} >Create Discount Code <FontAwesomeIcon icon={faPlusCircle} /></Link>
        <div style={{ height: "100px" }}></div>
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

export default connect(mapStateToProps, null)(DiscountCodes)