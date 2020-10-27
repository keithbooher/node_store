import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getAllVarietalOptions, createVarietal, updateProduct } from "../../../utils/API"
import varietalSort from "./varietalSort"
import Form from "../../shared/Form"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash'
import colorDropDownItem from "./colorDropDownItem"


class CreateVarietal extends Component {
  constructor(props) {
    super()
    this.createVarietal = this.createVarietal.bind(this)
    this.state = {
      varietalOptions: null,
      colors: null,
      sizes: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getAllVarietalOptions(this.props.product._id)

    const organize_varietals = varietalSort(data)
    let colors = organize_varietals.colors
    let sizes = organize_varietals.sizes

    this.setState({ colors, sizes, varietalOptions: data })
  }

  async createVarietal() {
    if (!this.props.form.varietal_color_form.values && !this.props.form.varietal_size_form.values) {
      return true
    }
    let color, size, image
    let other_atts = this.props.form.varietal_general_form.values
    let inventory_count = other_atts.inventory_count


    if (this.props.form.varietal_color_form && this.props.form.varietal_color_form.values) {
      color = this.props.form.varietal_color_form.values.varietal_color.value
    }
    if (this.props.form.varietal_size_form && this.props.form.varietal_size_form.values) {
      size = this.props.form.varietal_size_form.values.varietal_size.value
    }
    if (other_atts.images) {
      image = other_atts.images
    }

    let images = {
      i1: image,
      i2: null,
      i3: null,
      i4: null,
      i5: null,
    }

    let v = {
      size,
      color,
      inventory_count,
      images,
      _product_id: this.props.product._id
    }

    let product = this.props.product

    // let varietal = await this.props.createVarietal(v)
    if (!product.varietals) {
      product.varietals = []
    }
    let varietal = await this.props.createVarietal(v)
    
    product.varietals = product.varietals.concat(varietal.data)

    await this.props.updateProduct(product)

    this.props.cancel()
  }

  checkIfSubmitAvailable() {
    if (this.props.form.varietal_color_form || this.props.form.varietal_size_form) {
      if (this.props.form.varietal_color_form.values || this.props.form.varietal_size_form.values) {
        return true
      }
    }
    return false
  }

  render() {

    return (
      <div style={{ overflow: "scroll" }}>
        <div style={{ maxHeight: "500px" }}>
          <a onClick={this.props.cancel}>Cancel <FontAwesomeIcon icon={faTimes} /></a>
          <h1>Create a varietal</h1>

          {this.state.varietalOptions ?
            <>
              {this.state.colors &&              
                <Form 
                  submitButton={<div />}
                  dropDownCustomItemComponent={colorDropDownItem}
                  formFields={
                    [
                      { label: 'Choose Varietal Color', name: 'type', typeOfComponent: "dropdown", noValueError: 'You must provide an address',
                        options: this.state.colors.map((colorOption, index) => {
                          return {
                            default: index === 0 ? true : false,
                            value: colorOption,
                            name: colorOption.name,
                            redux_field: "varietal_color"
                          }
                        })
                      },
                    ]
                  }
                  form='varietal_color_form'
                />
              }
              {this.state.sizes &&              
                <Form 
                  submitButton={<div />}
                  formFields={
                    [
                      { label: 'Choose Varietal Size', name: 'type', typeOfComponent: "dropdown", noValueError: 'You must provide an address',
                        options: this.state.sizes.map((sizeOption, index) => {
                          return {
                            default: index === 0 ? true : false,
                            value: sizeOption,
                            name: sizeOption.name,
                            redux_field: "varietal_size"
                          }
                        })
                      },
                    ]
                  }
                  form='varietal_size_form'
                />
              }

              <div style={{ zIndex: 50 }}>
                <Form 
                  onSubmit={this.createVarietal}
                  submitButton={<button>Create</button> }
                  // submitButtonText={"Create"}
                  formFields={[
                    { label: 'Image', name: 'images', typeOfComponent: 'photo-upload', noValueError: 'You must provide an inventory count' },
                    { label: 'Inventory Count', name: 'inventory_count', typeOfComponent: "number", noValueError: 'You must provide an image' },
                  ]}
                  form='varietal_general_form'
                  validation={validate}
                /> 
              </div>

            </>
          :
            <FontAwesomeIcon className="loadingGif" icon={faSpinner} spin />
          }
        </div>
      </div>
    )
  }
}



const validate = (values, props) => {
  if (!props.validation) {
    return
  }
  const errors = {}

  _.each(props.formFields, ({ name, noValueError }) => {
    if (name === "images") {
      return
    }
    
    if(!values[name]) {
      errors[name] = noValueError
    }
  })

  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}




function mapStateToProps({ mobile, form }) {
  return { mobile, form }
}

const actions = { getAllVarietalOptions, createVarietal, updateProduct }


export default connect(mapStateToProps, actions)(CreateVarietal)

