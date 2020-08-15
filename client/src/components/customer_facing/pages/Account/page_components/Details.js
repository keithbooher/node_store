import React, { Component } from 'react'
import { connect } from 'react-redux'
import Form from '../../../../shared/Form/Form'
import { capitalizeFirsts } from "../../../../../utils/helperFunctions"
import loadingGif from '../../../../../images/pizzaLoading.gif'
import notAvailable from '../../../../../images/no-image-available.jpg'
import { updateUser, dispatchObj } from "../../../../../actions"
import ReactFilestack from "filestack-react"
import { validatePresenceOnAll } from "../../../../../utils/validations"
import FormModal from "../../../../shared/Form/FormModal"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit } from "@fortawesome/free-solid-svg-icons"
import { reset } from "redux-form"

class Details extends Component {
  constructor(props) {
    super()
    this.finishUploading = this.finishUploading.bind(this)
    this.state = {
      editForm: null,
      propertyToEdit: null
    }
  }

  async handleSubmit(key) {
    // takes in the user attribute that was tied to the form field that submitted this request
    // and dynamically pulls the value from that redux-form field value
    let user = this.props.auth
    user[key] = this.props.form["update_user_form"].values[key]
    this.props.updateUser(user)
    this.setState({ editForm: null, propertyToEdit: null })
  }


  async finishUploading(data) {
    let user = this.props.auth
    const src = data.filesUploaded[0].url
    user.photo = src
    await this.props.updateUser(user)
  }


  showEditIndicator(propertyToEdit) {
    this.setState({ propertyToEdit })
  }


  showEditModal(property) {
    let user = this.props.auth
    const form_object = {
      user,
      onSubmit: () => this.handleSubmit(property),
      cancel: () => {
        this.props.dispatchObj(reset("update_user_form"))
        this.setState({ editForm: null, propertyToEdit: null })
      },
      submitButtonText: "Update User Property",
      formFields: [
        { label: capitalizeFirsts(property), name: property, noValueError: `You must provide a value` },
      ],
      form: "update_user_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: user[property]
        }
    }
    this.setState({ editForm: form_object })
  }


  render() {
    return (
      <div>
        { this.props.auth ?
          <>
            <h4>Email: {this.props.auth.email}</h4>
            <div>
              <img style={{ height: "200px", width: "auto" }} src={this.props.auth.photo === null ? notAvailable : this.props.auth.photo} />
              <ReactFilestack
                apikey={process.env.REACT_APP_FILESTACK_API}
                customRender={({ onPick }) => (
                  <div>
                    <button onClick={onPick}>Upload image</button>
                  </div>
                )}
                onSuccess={this.finishUploading}
              />
            </div>
            <div className="relative">
              First Name: <a className="inline" onClick={() => this.showEditIndicator("first_name")}>{this.props.auth.first_name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "first_name" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("first_name")} 
                  />
                }
            </div>
            <div className="relative">
              Last Name: <a className="inline" onClick={() => this.showEditIndicator("last_name")}>{this.props.auth.last_name}</a>
              {this.state.propertyToEdit && this.state.propertyToEdit === "last_name" && 
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    onClick={() => this.showEditModal("last_name")} 
                  />
                }
            </div>
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
                    title={"Updating Shipping Property"}
                    initialValues={this.state.editForm.initialValues}
                  />
                </div>
            }
          </>
          : <img className="loadingGif loadingGifCenterScreen" src={loadingGif} />
        }
      </div>
    )
  }
}

function mapStateToProps({ auth, form }) {
  return { auth, form }
}

const actions = { updateUser, dispatchObj }

export default connect(mapStateToProps, actions)(Details)