import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faChevronDown, faChevronUp, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"
import { LazyLoadImage } from 'react-lazy-load-image-component'
import Modal from "../../../shared/Modal"
import Form from "../../../shared/Form"

class LineItems extends Component {
  constructor(props) {
    super()
    this.state = {

    }
  }

  componentDidMount() {

  }

  
  setQuantity(direction) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (!this.props.product.backorderable && quantity > this.props.product.inventory_count || quantity < 1) {
      return
    }
    // update cart
  }

  preventAlpha(e) {
    if (!this.isNumber(e)) {
      e.preventDefault();
    }
  }

  fuck(e) {
    console.log(e)
  }


  render() {
    console.log(this.props)
    return (
      <div >
        {this.props.cart && this.props.cart.line_items.map((line_item, index) => {
          return (
            <div key={index} className="flex">
              <LazyLoadImage
                style={{ height: "auto", width: "auto", maxHeight: "100px", maxWidth: "100px" }}
                src={line_item.image}
              />
              <div>
                <div>{line_item.product_name}</div>
                <div>
                  <FontAwesomeIcon onClick={() => this.setQuantity("down")} icon={faPlus} />
                  <input 
                    onChange={(e) => this.fuck(e)} 
                    onFocus={() => this.setState({ showModal: line_item })} 
                    value={line_item.quantity} 
                  />
                  <FontAwesomeIcon onClick={() => this.setQuantity("up")} icon={faMinus} />
                </div>
              </div>
            </div>
          )
        })}
        {this.state.showModal &&
          <Modal cancel={() => this.setState({ showModal: false })}>
            <LazyLoadImage
              style={{ height: "auto", width: "auto", maxHeight: "150px", maxWidth: "150px" }}
              src={this.state.showModal.image}
            />
            <Form
              submitButton={<div>Done</div>}
              cancel={() => this.setState({ showModal: false })}
              onChange={this.changeCartTab}
              formFields={[{ label: `Update ${this.state.showModal.product_name} quantity`, name: 'quantity', noValueError: 'You must provide an quantity' }]}
              form='change_line_item_quantity_form'
              initialValues={{ quantity: this.state.showModal.quantity }}
            />
          </Modal>
        }
      </div>
    )
  }
}


function mapStateToProps({ cart }) {
  return { cart }
}

// const actions = { sidebarBoolean }

export default connect(mapStateToProps, null)(LineItems)