import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faEdit, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { getAllDiscountCodes, updateDiscountCode } from "../../../utils/API"
import Modal from "../../shared/Modal"

class DiscountCodes extends Component {
  constructor(props) {
    super()

    this.state = {
      discounts: null,
      areYouSure: false, 

    }
  }

  async componentDidMount() {
    const { data } = await this.props.getAllDiscountCodes()
    this.setState({ discounts: data })
  }

  async deleteDiscount(discount) {
    let d = discount
    let date = new Date()
    const today = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
    
    d.deleted_at = today

    await this.props.updateDiscountCode(discount)
    const { data } = await this.props.getAllDiscountCodes()
    this.setState({ discounts: data, areYouSure: false })
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
                <div className="flex">
                  <Link className="margin-s-h" style={{ flexBasis: "20px" }} to={`/admin/discount/${discount._id}`} ><FontAwesomeIcon icon={faEdit} /></Link>
                  <a><FontAwesomeIcon className="margin-xs-h" onClick={() => this.setState({ areYouSure: discount })} icon={faTrash} /></a>
                </div>
              </div>
            </div>
          )})
        :
          <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }

        {this.state.areYouSure &&
          <Modal cancel={() => this.setState({ areYouSure: false })}>
            <h2>Are you sure you want to delete {this.state.areYouSure.discount_code}?</h2>
            <div>
              <button className="padding-s margin-s-h" onClick={() => this.deleteDiscount(this.state.areYouSure)}><h2 style={{ margin: "0px" }}>Yes</h2></button>
              <button className="padding-s margin-s-h" onClick={() => this.setState({ areYouSure: false })} ><h2 style={{ margin: "0px" }}>No</h2></button>
            </div>
          </Modal>
        }

      </div>
    )
  }
}

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { getAllDiscountCodes, updateDiscountCode }

export default connect(mapStateToProps, actions)(DiscountCodes)