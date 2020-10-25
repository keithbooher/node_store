import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faPlusCircle, faTimesCircle, faSearch } from '@fortawesome/free-solid-svg-icons'
import { getAllVarietalOptions, createVarietalOption } from "../../../utils/API"
import Form from "../../shared/Form"
import ColorPicker from "../../shared/ColorPicker/ColorPicker"

class VarietalOptions extends Component {
  constructor(props) {
    super()

    this.state = {
      varietalOptions: null,
      colors: null,
      sizes: null,
      showCreateForm: false,
      createType: null
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
      return <ColorPicker onChange={this.setColor} />
    } else if (varietal_type === "size") {
      // create size based varietalOption
      return <Form 
                onSubmit={this.makeSizeVarietal}
                submitButtonText={"Create"}
                formFields={[
                  { label: 'Varietal Size', name: 'size', noValueError: 'You must provide an email' },
                ]}
                form='varietal_size_form'
              />
    } else {
      return
    }
  }

  async makeColorVarietal(value) {
    // api request for varietalOption creation
    // get all varietalOptions
    // set state
  }  

  async makeSizeVarietal(value) {
    // api request for varietalOption creation
    // get all varietalOptions
    // set state
  }  


  render() {

    return (
      <div>

        {/* Toggle show form  */}
        <a onClick={() => this.setState({ showCreateForm: !this.state.showCreateForm })}>{this.state.showCreateForm ? <div>Cancel <FontAwesomeIcon icon={faTimesCircle} /></div> : <div>Add <FontAwesomeIcon icon={faPlusCircle} /></div>}</a>
        {this.state.showCreateForm &&
          <Form 
            submitButton={<div />}
            onChange={(e) => { 
              this.setState({ createType: e.varietal_type.value })
              console.log(e.varietal_type.value)
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
          this.showVarietalValueForm()
        }

        {this.state.colors ? 
          <div>

            <div>
              <h2>Colors</h2>
            </div>

          </div>
        :
          <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
        }

        {this.state.sizes ? 
          <div>

            <div>
              <h2>Sizes</h2>
            </div>

          </div>
        :
          <FontAwesomeIcon className="loadingGif loadingGifCenterScreen" icon={faSpinner} spin />
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

function mapStateToProps({ mobile }) {
  return { mobile }
}

const actions = { getAllVarietalOptions, createVarietalOption }

export default connect(mapStateToProps, actions)(VarietalOptions)