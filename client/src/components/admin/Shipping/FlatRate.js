import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getShippingMethod, updateShippingMethod } from '../../../utils/API'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlusCircle, faTimesCircle, faCircle, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons"
import FormModal from "../../shared/Form/FormModal"
import _ from 'lodash'
import { reset } from "redux-form"
import { capitalizeFirsts } from "../../../utils/helperFunctions"
import { validatePresenceOnAll } from "../../../utils/validations"


class FlatRate extends Component {
  constructor(props) {
    super()
    this.addNewRate = this.addNewRate.bind(this)
    this.destroyRate = this.destroyRate.bind(this)
    this.showRateForm = this.showRateForm.bind(this)
    this.renderEditIndicator = this.renderEditIndicator.bind(this)
    this.setEditIndication = this.setEditIndication.bind(this)

    this.state = {
      shippingMethod: null,
      rateForm: false,
      editIndication: {
        _rate_id: null,
        property: null
      },
      editForm: null
    }
  }

  async componentDidMount() {
    const { data } = await getShippingMethod('flat_rate')
    this.setState({ shippingMethod: data })
  }

  async addNewRate() {
    const flat_rate_value = this.props.form['flat_rate_form'].values
    let shippingMethod = this.state.shippingMethod
    const new_rate = {
      effector: parseInt(flat_rate_value.effector),
      name: flat_rate_value.name,
      description: flat_rate_value.description,
      display: false
    }
    shippingMethod.shipping_rates.push(new_rate)
    const { data } = await updateShippingMethod(shippingMethod)
    this.props.dispatch(reset('flat_rate_form'))
    this.setState({ rateForm: !this.state.rateForm, shippingMethod: data  })
  }

  showRateForm() {
    this.setState({ rateForm: !this.state.rateForm })
  }

  cancelForm(form_name) {
    this.props.dispatch(reset(form_name))
    this.setState({ rateForm: !this.state.rateForm })
  }

  async destroyRate(rate_to_remove) {
    let shippingMethod = this.state.shippingMethod
    shippingMethod.shipping_rates = shippingMethod.shipping_rates.filter((rate) => rate._id !== rate_to_remove._id)
    const { data } = await updateShippingMethod(shippingMethod)
    this.setState({ shippingMethod: data })
  }

  setEditIndication(e, _rate_id, property) {
    if (e.target.dataset.edit ) {
      return
    }
    if (_rate_id === this.state.editIndication._rate_id) {
      this.setState({ editIndication: { _rate_id: null, property: null } })
    } else {
      this.setState({ editIndication: { _rate_id, property } })
    }
  }

  async updateRateProperty(rate, property) {
    const form_value = this.props.form['edit_rate_property_form'].values
    let shippingMethod = this.state.shippingMethod
    
    shippingMethod.shipping_rates.forEach(shipping_rate => {
      if (shipping_rate._id === rate._id) {
        let value = form_value[property]
        if (property === "effector") {
          value = parseInt(form_value[property])
        }
        shipping_rate[property] = value
      }
    });

    const { data } = await updateShippingMethod(shippingMethod)
    this.props.dispatch(reset("edit_rate_property_form"))
    this.setState({ editForm: null, shippingMethod: data })
  }

  showEditForm(rate, property) {
    const form_object = {
      rate,
      onSubmit: () => this.updateRateProperty(rate, property),
      cancel: () => {
        this.props.dispatch(reset("edit_rate_property_form"))
        this.setState({ editForm: null })
      },
      submitButtonText: "Update Rate Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_rate_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: rate[property]
        }
    }
    this.setState({ editForm: form_object })
  }

  renderEditIndicator(rate, property) {
    if (this.state.editIndication._rate_id === rate._id 
      && this.state.editIndication.property === property) {
      return <FontAwesomeIcon 
                icon={faEdit} 
                className="absolute" 
                style={{ 
                  top: "-10px", 
                  right: "-5px", 
                  zIndex: "20" 
                }}
                onClick={() => this.showEditForm(rate, property)}
                data-edit="edit"
              />
    } else {
      return
    }
  }

  render() {

    const rateProperties = ["name", "description", "effector", "display"]

    return (
    <div>
      {this.state.shippingMethod && 
        <>
          <div className="flex" onClick={this.showRateForm} >
            <FontAwesomeIcon icon={this.state.rateForm ? faTimesCircle : faPlusCircle} />
            {this.state.rateForm ? <div className="margin-s-h">cancel</div> : <div className="margin-s-h">add a new flat rate</div>}
          </div>

          {this.state.rateForm && 
            <div>
              <FormModal
                onSubmit={this.addNewRate}
                cancel={() => this.cancelForm("flat_rate_form")}
                submitButtonText={"New Rate"}
                formFields={[
                  { label: "Name", name: "name", noValueError: `You must provide a value` },
                  { label: "Flat Rate", name: "effector", noValueError: `You must provide a value` },
                  { label: "Description", name: "description", noValueError: `You must provide a value` }
                ]}
                form='flat_rate_form'
                validation={validate}
              />
            </div>}

          <div>
            <h3>Rates</h3>
            {this.state.shippingMethod.shipping_rates.map((rate) => {
              return (
                <div className="flex">
                  <FontAwesomeIcon icon={faCircle} style={{ marginTop: "10px" }} />
                  {rateProperties.map((prop) => {
                    return (
                      <RateProperty 
                        setEditIndication={this.setEditIndication}
                        renderEditIndicator={this.renderEditIndicator}
                        rate={rate}
                        property={prop}
                      />
                    )
                  })}
                  <FontAwesomeIcon onClick={() => this.destroyRate(rate)} icon={faTrash} style={{ marginTop: "10px" }} />
                </div>
              )
            })}
          </div>
        </>
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
              title={capitalizeFirsts(this.state.editForm.rate.name)}
              initialValues={this.state.editForm.initialValues}
            />
          </div>
      }

    </div>
    )
  }
}


const RateProperty = ({ setEditIndication, renderEditIndicator, rate, property }) => {
  return (
    <div className="margin-s-h border padding-s relative" onClick={(e) => setEditIndication(e, rate._id, property)}>
      <div>{capitalizeFirsts(property === "effector" ? "rate" : property)}: {rate[property]}</div>
      {renderEditIndicator(rate, property)}
    </div>
  )
}


const validate = (values, props) => {
  if (!props.validation) {
    return
  }
  const errors = {}

  _.each(props.formFields, ({ name, noValueError }) => {
    if (name === "effector") {
      return
    }
    
    if(!values[name]) {
      errors[name] = noValueError
    }
  })

  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}


function mapStateToProps({ form }) {
  return { form }
}

export default connect(mapStateToProps, null)(FlatRate)