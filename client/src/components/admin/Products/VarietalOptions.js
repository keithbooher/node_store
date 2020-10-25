import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faPlusCircle, faTimesCircle, faSearch, faCircle } from '@fortawesome/free-solid-svg-icons'
import { getAllVarietalOptions, createVarietalOption } from "../../../utils/API"
import { dispatchObj } from "../../../actions"
import Form from "../../shared/Form"
import ColorPicker from "../../shared/ColorPicker/ColorPicker"
import { reset } from "redux-form"

class VarietalOptions extends Component {
  constructor(props) {
    super()
    this.makeSizeVarietal = this.makeSizeVarietal.bind(this)
    this.makeColorVarietal = this.makeColorVarietal.bind(this)
    this.createFormToggle = this.createFormToggle.bind(this)

    this.state = {
      varietalOptions: null,
      colors: null,
      sizes: null,
      showCreateForm: false,
      createType: null,
      chosenColor: null
    }
  }

  async componentDidMount() {
    const { data } = await this.props.getAllVarietalOptions()

    const organize_varietals = varietalSort(data)
    let colors = organize_varietals.colors
    let sizes = organize_varietals.sizes

    this.setState({ colors, sizes })
  }

  showVarietalValueForm() {
    const varietal_type = this.state.createType
    if (varietal_type === "color") {
      // create color based varietalOption 
      if (this.state.chosenColor) {
        return (
                <div className="flex align-items-center">
                  <div className="border-radius-s" style={{ width: "50px", height: "50px", backgroundColor: this.state.chosenColor, marginRight: "20px" }} />
                  <Form 
                    onSubmit={this.makeSizeVarietal}
                    submitButton={<div/>}
                    formFields={[
                      { label: 'Name your color', name: 'name', noValueError: 'You must provide an email' },
                    ]}
                    form='varietal_color_name_form'
                  /> 
                </div>
                )
      } else {
        return <ColorPicker onChange={(color) => this.setState({ chosenColor: color.hex })} />
      }
    } else if (varietal_type === "size") {
      // create size based varietalOption
      return <Form 
                onSubmit={this.makeSizeVarietal}
                submitButton={<div/>}
                formFields={[
                  { label: 'Varietal Size', name: 'size', noValueError: 'You must provide an email' },
                ]}
                form='varietal_size_form'
              />
    } else {
      return
    }
  }

  async makeColorVarietal() {
    let option = {
      type: "color",
      value: this.state.chosenColor,
      name: this.props.form.varietal_color_name_form.values.name
    }
    let { data } = await this.props.createVarietalOption(option)
    this.setState({ 
      colors: this.state.colors.concat(data), 
      chosenColor: null,
      showCreateForm: false,
      createType: null
    })
  }  

  async makeSizeVarietal() {
    let option = {
      type: "size",
      value: this.props.form.varietal_size_form.values.size,
      name: this.props.form.varietal_size_form.values.size
    }
    let { data } = await this.props.createVarietalOption(option)
    this.props.dispatchObj(reset("varietal_size_form"))
    this.setState({ 
      sizes: this.state.sizes.concat(data), 
      chosenColor: null,
      showCreateForm: false,
      createType: null
    })
  }  

  createFormToggle() {
    this.props.dispatchObj(reset("varietal_size_form"))
    this.props.dispatchObj(reset("varietal_color_name_form"))
    this.setState({ showCreateForm: !this.state.showCreateForm, chosenColor: null, createType: null })
  }


  render() {

    return (
      <div>

        {/* Toggle show form  */}
        <a className="hover-color-11" onClick={this.createFormToggle}>{this.state.showCreateForm ? <div>Cancel <FontAwesomeIcon icon={faTimesCircle} /></div> : <div>Add <FontAwesomeIcon icon={faPlusCircle} /></div>}</a>
        {this.state.showCreateForm &&
          <Form 
            submitButton={<div />}
            onChange={(e) => { 
              this.setState({ createType: e.varietal_type.value })
            }}
            formFields={
              [
                { label: 'Choose Varietal Type', name: 'type', typeOfComponent: "dropdown", noValueError: 'You must provide an address',
                  options: [
                    {
                      default: false,
                      value: "color",
                      name: "Color",
                      redux_field: "varietal_type"
                    },
                    {
                      default: false,
                      value: "size",
                      name: "Size",
                      redux_field: "varietal_type"
                    }
                  ] 
                },
              ]
            }
            form='varietal_type_form'
          />
        }
        {/* Dependent on the type, show form for either color picker or input field for size */}
        {this.state.createType &&
          <div>
            {this.showVarietalValueForm()}
            <button onClick={this.state.createType === "color" ? this.makeColorVarietal : this.makeSizeVarietal }>Create</button>
          </div>
        }

        {this.state.colors ? 
          <div>
            <h2>Colors</h2>
            <div className="flex flex_column">
              {this.state.colors.map((color, index) => {
                return (
                  <div key={index} className="flex align-items-center" style={{ margin: "3px 0px" }}>
                    <div className="border-radius-s" style={{ width: "35px", height: "35px", backgroundColor: color.value, marginRight: "20px" }} />
                    <div>{color.name}</div>
                  </div>
                )
              })} 
            </div>
          </div>
        :
          <FontAwesomeIcon className="loadingGif" icon={faSpinner} spin />
        }

        {this.state.sizes ? 
          <div>

            <div>
              <h2>Sizes</h2>
              <div className="flex flex_column">
                {this.state.sizes.map((size, index) => {
                  return (
                    <div key={index} className="flex align-items-center">
                      <FontAwesomeIcon icon={faCircle} className="margin-s-h" style={{ fontSize: "10px" }} /> <h3 className="margin-xs-v">{size.name}</h3>
                    </div>
                  )
                })} 
              </div>
            </div>

          </div>
        :
          <FontAwesomeIcon className="loadingGif" icon={faSpinner} spin />
        }
      </div>
    )
  }
}

const varietalSort = (data) => {
  let sorted = {
    colors: [],
    sizes: []
  }

  if (data.length === 0) {
    return sorted
  }

  data.forEach(varietal => {
    if (varietal.type === "color") {
      sorted.colors.push(varietal)
    } else {
      sorted.sizes.push(varietal)
    }
  });

  return sorted
}

function mapStateToProps({ mobile, form }) {
  return { mobile, form }
}

const actions = { getAllVarietalOptions, createVarietalOption, dispatchObj }

export default connect(mapStateToProps, actions)(VarietalOptions)