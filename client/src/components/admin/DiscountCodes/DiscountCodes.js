import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getAllDiscountCodes } from "../../../utils/API"

class DiscountCodes extends Component {
  constructor(props) {
    super()

    this.state = {
      discounts: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getAllDiscountCodes()
    this.setState({ discounts: data })
  }

  render() {

    return (
      <div >
        <h1 className="text-align-center">Discount Codes</h1>
        <Link className="absolute" style={{ top: "5px", right: "5px" }} to={"/admin/discount-codes/create"} >Create Discount Code <FontAwesomeIcon icon={faPlusCircle} /></Link>
        {this.state.discounts ? this.state.discounts.map((discount) => {
          return (
            <div key={discount._id}>
              <div className="padding-s margin-xs-v color-white flex space-between" style={{ backgroundColor: 'rgb(45, 45, 45)' }} data-product-tab={discount._id}>
                <div style={{ flexBasis: "60%" }}>{discount.discount_code}</div>
                <div style={{ flexBasis: "auto" }}>{discount.created_at.split("T")[0]}</div>
                <Link style={{ flexBasis: "20px" }} to={`/admin/discount/${discount._id}`} ><FontAwesomeIcon icon={faEdit} /></Link>
              </div>
            </div>
          )})
        :
          <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }
      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { getAllDiscountCodes }

export default connect(mapStateToProps, actions)(DiscountCodes)