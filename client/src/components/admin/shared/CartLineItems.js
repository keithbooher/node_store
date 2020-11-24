import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from "../../shared/Form"
import { reset } from "redux-form"
import { getProductbyName, checkInventory } from "../../../utils/API"
import { dispatchObj } from "../../../actions"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faSearch, faTrash, faCaretUp, faCaretDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { validatePresenceOnAll } from "../../../utils/validations"
import { capitalizeFirsts, formatMoney } from "../../../utils/helpFunctions"
import FormModal from "../../shared/Form/FormModal"
import Modal from "../../shared/Modal"
import VarietalDropdown from "../../shared/Varietal/VarietalDropdown"

class CartLineItems extends Component {
  constructor(props) {
    super()
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this)
    this.removeLineItem = this.removeLineItem.bind(this)

    this.state = {
      cart: props.cart,
      quantity: 1,
      addProduct: false,
      result: null,
      propertyToEdit: false,
      editForm: false,
      chosenVarietal: null
    }
  }
  async handleSearchSubmit() {
    const search_for_product = this.props.form['product_order_search_form'].values
    const { data } = await this.props.getProductbyName(search_for_product.name)
    let varietal = null
    if (data.varietals && data.varietals.length > 0) {
      varietal = data.varietals[0]
    }
    this.setState({ result: data, chosenVarietal: varietal })
  }

  addToLineItems(product) {
    // MAKE A CHECK TO SEE IF THE LINE ITEM IS ALREADY I THE ARRAY, IF SO, JUST ADD QUANTITY
    let line_items = [...this.props.cart.line_items]

    if (!product.backorderable && this.state.quantity > product.inventory_count || !product.backorderable && product.inventory_count < 1) {
      this.setState({ insufficientStock: true })
      return
    }

    let already_in_array = false
    line_items.forEach(item => {
      if(item.varietal && this.state.chosenVarietal && item.varietal._id === this.state.chosenVarietal._id) {
        item.quantity += this.state.quantity
        already_in_array = true
      } else if(!item.varietal && item._product_id === product._id) { 
        item.quantity += this.state.quantity
        already_in_array = true
      }
    })

    // If the product is not in the array, we construct
    //  the object and push it to the lien items array
    if (!already_in_array) {
      let line_item = {
        product_name: product.name,
        image: product.images.i1,
        _product_id: product._id,
        quantity: this.state.quantity,
        product_price: product.price,
        product_path: `/shop/${product.categories.length > 0 ? product.categories[0].path_name : "general"}/${product.path_name}`,
        varietal: this.state.chosenVarietal,
        use_master_images: product.use_master_images
      }
      line_items.push(line_item)
    } 

    let cart = this.props.cart

    cart.line_items = line_items

    this.props.dispatchObj(reset("product_order_search_form"))

    this.props.addToLineItems(cart)

    this.setState({ cart, addProduct: false, result: null, quantity: 1, chosenVarietal: null })

  }

  removeLineItem(item) {
    let line_items
    if (item.varietal) {
      line_items = this.props.cart.line_items.filter((line_item) => line_item.varietal._id !== item.varietal._id)
    } else {
      line_items = this.props.cart.line_items.filter((line_item) => line_item._product_id !== item._product_id)
    }
    let cart = this.props.cart
    cart.line_items = line_items
    this.props.removeLineItem(cart)
    this.setState({ cart })
  }

  async adjustLineItemQuantity(item, up_or_down) {
    let line_items = this.props.cart.line_items
    
    let line_items_adjusted = await Promise.all(line_items.map(async (line_item) => {
      if (item.varietal && line_item.varietal && line_item.varietal._id === item.varietal._id) {
        line_item = await adjust(up_or_down, line_item, this.props.checkInventory)
      } else if (!item.varietal && line_item._product_id === item._product_id) {
        line_item = await adjust(up_or_down, line_item, this.props.checkInventory)
      }
      return line_item
    }))

    line_items = line_items_adjusted.filter((line_item) => line_item.quantity !== 0)

    let cart = this.props.cart
    cart.line_items = line_items

    this.props.adjustLineItemQuantity(cart)
    this.setState({ cart })
  }

  setQuantity(direction, product) {
    let quantity
    if(direction === "up") {
      quantity = this.state.quantity + 1
    } else {
      quantity = this.state.quantity - 1
    }
    
    if (product.varietals.length > 0 && direction == "up" && !product.backorderable) {
      let varietal = product.varietals.find(v => v._id === this.state.chosenVarietal._id)
      if (quantity > varietal.inventory_count) {
        return
      }
    } else if (direction == "up" && !product.backorderable && quantity > product.inventory_count) {
      return
    }
    this.setState({ quantity })
  }

  checkInventoryCount(e, product) {
    let value = e.target.value
    if (product.varietals.length > 0) {
      let varietal = product.varietals.find(v => v._id === this.state.chosenVarietal._id)
      if (value > varietal.inventory_count) {
        value = varietal.inventory_count
        this.setState({ quantity: value })
      }
    } else if (value > product.inventory_count) {
      value = product.inventory_count
      this.setState({ quantity: value })
    }

    if (value === "") {
      value = 1
      this.setState({ quantity: value })
    }
  }

  onChangeInput(e) {
    let value = parseInt(e.target.value)

    if (e.target.value === "") {
      value = ""
    }
    this.setState({ quantity: value })
  }

  preventAlpha(e) {
    if (!this.isNumber(e)) {
      e.preventDefault();
    }
  }

  isNumber(e) {
    var charCode = e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
  }


  async updateCartProperty(property, _id) {
    const form_value = this.props.form['edit_item_form'].values[property]
    let cart = this.props.cart

    cart.line_items.map((item) => {
      if (item.varietal && item.varietal._id === _id) {
        item[property] = form_value
      } else if (!item.varietal && item._id === _id) {
        item[property] = form_value
      }
      return item
    })

    this.setState({ editForm: null, propertyToEdit: null })
    this.props.dispatchObj(reset("edit_item_form"))

    this.props.adjustCost(cart.line_items)
  }

  showEditModal(property, _id) {
    let cart = this.props.cart
    let this_item
    cart.line_items.forEach((item) => {
      if (item.varietal && item.varietal._id === _id) {
        this_item = item
      } else if (!item.varietal && item._id === _id) {
        this_item = item
      }
    })
    const form_object = {
      cart,
      onSubmit: () => this.updateCartProperty(property, _id),
      cancel: () => {
        this.props.dispatchObj(reset("edit_item_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update Price",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_item_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: this_item[property]
        }
    }
    this.setState({ editForm: form_object })
  }

  showEditIndicator(property, _id) {
    let propertyToEdit = {
      property,
      _id
    }
    this.setState({ propertyToEdit })
  }
  
  render(){
    let show_button = false
    if (!this.state.addProduct || !this.props.cart.line_items || this.props.cart.line_items.length < 1) {
      show_button = false
    }
    if (this.props.cart.line_items && this.props.cart.line_items.length > 0) {
      show_button = true
    }
    if (this.state.addProduct === true) {
      show_button = false
    }
    let searchButton = document.getElementsByClassName("search_button")
    if (searchButton[0] && !this.props.mobile) {
      searchButton[0].style.marginTop = "34px"
    }
    return (
      <div>
        <h2>Line Items</h2>
        <div  className="flex flex-wrap">
          {this.props.cart.line_items.map((item, index) => {
            let container_style = {
              flexBasis: "100%", 
              margin: "10px"
            }
            let trashStyle = {
              fontSize: "1em",
              right: "0px",
              top: "0px"
            }
            if (!this.props.mobile) {
              trashStyle.fontSize = "20px"
              trashStyle.right = "5px"
              trashStyle.top = "5px"
              container_style.flexBasis = "22%"
            }
            return (
                <div key={index} className={`relative ${this.props.mobile ? "padding-m" : "padding-l"} background-color-grey-2`} style={ container_style } >
                  <FontAwesomeIcon onClick={() => this.removeLineItem(item)} className="absolute hover hover-color-12" style={ trashStyle } icon={faTrash} />
                  {this.props.mobile ?
                    <div>
                      <img style={{ height: "auto", width: "98%" }} src={item.varietal ? item.varietal.images.i1 : item.image}/>
                    </div>
                  : 
                    <div className="background-color-black margin-auto-v flex justify-center align-items-center" style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }}>
                      <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={item.varietal ? item.varietal.images.i1 : item.image}/>
                    </div>
                  }
                  <div>{item.product_name}</div>
                  <div>
                    Price: <a className="inline" onClick={() => this.showEditIndicator("product_price", item.varietal ? item.varietal._id : item._id)} >${item.product_price}</a>
                    {this.state.propertyToEdit && this.state.propertyToEdit._id === (item.varietal ? item.varietal._id : item._id) && this.state.propertyToEdit.property === "product_price" &&
                      <FontAwesomeIcon 
                        icon={faEdit}
                        className="hover hover-color-12" 
                        onClick={() => this.showEditModal("product_price", (item.varietal ? item.varietal._id : item._id))} 
                      />
                    }
                  </div>
                  <div>
                    Quantity: {item.quantity}
                    <FontAwesomeIcon 
                      className="hover hover-color-12"
                      onClick={() => this.adjustLineItemQuantity(item, "up")} 
                      icon={faCaretUp} 
                    />
                    <FontAwesomeIcon 
                      className="hover hover-color-12"
                      onClick={() => this.adjustLineItemQuantity(item, "down")} 
                      icon={faCaretDown} 
                    />
                  </div>
                  {item.gift_note &&
                    <div>
                        Gift Note: <a className="inline" onClick={() => this.showEditIndicator("gift_note", item._id)} >{item.gift_note}</a>
                        {this.state.propertyToEdit && this.state.propertyToEdit.property === "gift_note" &&
                          <FontAwesomeIcon 
                            icon={faEdit}
                            className="hover hover-color-12" 
                            onClick={() => this.showEditModal("gift_note", item._id)} 
                          />
                        }
                      </div>}
                </div>
              )
            })
          }
        </div>

        {show_button ? 
          <button onClick={() => this.setState({ addProduct: true })}>Add Product</button>
        :
          <div style={{ paddingTop: "20px" }} className="relative">
            <Form 
              onSubmit={this.handleSearchSubmit}
              submitButtonText={<FontAwesomeIcon icon={faSearch} />}
              searchButton={true}
              formFields={[
                { label: 'Search For Product By Name', name: 'name', noValueError: 'You must provide an name' },
              ]}
              form='product_order_search_form'
            />

            {this.state.result &&
              <>
                <h3>Product Found</h3>
                {console.log(this.state.result)}
                <h3>{this.state.result.name}</h3>
                {this.props.mobile ?
                  <div>
                    <img src={this.state.result.varietals.length > 0 && !this.state.result.use_master_images ? this.state.result.varietals.find(v => v._id === this.state.chosenVarietal._id).images.i1 : this.state.result.images.i1} style={{ height: "auto", width: "auto", maxWidth: "150px", maxHeight: "150px" }} />
                  </div>
                : 
                  <div className="background-color-black margin-auto-v flex justify-center align-items-center" style={{ height: "300px", width: "300px", maxHeight: "300px", maxWidth: "300px" }}>
                    <img style={{ height: "auto", width: "auto", maxHeight: "300px", maxWidth: "300px" }} src={this.state.result.varietals.length > 0 && !this.state.result.use_master_images ? this.state.result.varietals.find(v => v._id === this.state.chosenVarietal._id).images.i1 : this.state.result.images.i1}/>
                  </div>
                }

                <div className="margin-s-v">${formatMoney(this.state.result.price)}</div>
                {!this.state.result.backorderable ? <div className="margin-s-v">On hand: {this.state.result.varietals.length > 0 ? this.state.result.varietals.find(v => v._id === this.state.chosenVarietal._id).inventory_count : this.state.result.inventory_count}</div> : <div className="margin-s-v">backorderable</div>}
                {this.state.result.varietals.length > 0 && 
                  <VarietalDropdown 
                    varietals={this.state.result.varietals} 
                    setVarietal={(v) => this.setState({ chosenVarietal: v })} 
                    chosenVarietal={this.state.chosenVarietal} 
                  />
                }
                <div className="flex">
                  <input onKeyDown={(e) => this.preventAlpha(e)} onChange={(e) => this.onChangeInput(e)} onBlur={e => this.checkInventoryCount(e, this.state.result)} style={{ width: "60px" }} className="inline quantity_input" value={this.state.quantity} defaultValue={1}/>
                  <div className="flex flex_column margin-s-h" style={{ marginTop: '-11px' }}>
                    <FontAwesomeIcon className="hover hover-color-12" onClick={() => this.setQuantity("up", this.state.result)} icon={faCaretUp} />
                    <FontAwesomeIcon className="hover hover-color-12" onClick={() => this.setQuantity("down", this.state.result)} icon={faCaretDown} />
                  </div>
                  <button style={this.props.mobile ? {} : { height: "40px" }} onClick={() => this.addToLineItems(this.state.result)}>Add to cart</button>
                </div>
              </>
            }

            {this.state.result === "" && <h3>No product found, check for typos</h3>}

            {this.state.cart.line_items.length > 0 && <FontAwesomeIcon className="absolute" style={{ top: "10px", right: "5px" }} onClick={() => this.setState({ addProduct: false })} icon={faTimesCircle} />}
          </div>
        }


        {
          this.state.editForm && 
            <div>
              <FormModal
                onSubmit={this.state.editForm.onSubmit}
                cancel={this.state.editForm.cancel}
                submitButtonText={this.state.editForm.submitButtonText}
                formFields={this.state.editForm.formFields}
                form={this.state.editForm.form}
                validation={this.state.editForm.validation}
                title={"Updating Product"}
                initialValues={this.state.editForm.initialValues}
              />
            </div>
        }

        {this.state.insufficientStock && 
          <Modal cancel={() => this.setState({ insufficientStock: false })}>
            <h1>Insufficient Stock</h1>
          </Modal>
        }
      </div>
    )
  }
}

const adjust = async (up_or_down, line_item, checkInventory) => {
  if (up_or_down === "down") {
    line_item.quantity = line_item.quantity - 1
  } else {
    line_item.quantity = line_item.quantity + 1
    let { data } = await checkInventory([line_item])
    let out_of_stock = data.filter((oos_item) => oos_item !== null)
    if (out_of_stock.length > 0) {
      line_item.quantity = line_item.quantity - 1
    }
  }
  return line_item
}

function mapStateToProps({ form }) {
  return { form }
}

const actions = { getProductbyName, checkInventory, dispatchObj }

export default connect(mapStateToProps, actions)(CartLineItems)
