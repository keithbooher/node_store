import React, { Component } from 'react'
import { getUser, updateUser } from "../../../utils/API"
import { dispatchObj } from "../../../actions"
import { validatePresenceOnAll } from "../../../utils/validations"
import { reset } from "redux-form"
import FormModal from "../../shared/Form/FormModal"
import { connect } from 'react-redux'
import { roleField, generalUserField } from "./formFields"

class Users extends Component {
  constructor(props) {
    super()
    this.routeParamUserId = props.match.params.id
    this.state = {
      user: null,
      editForm: null
    }
  }

  async componentDidMount() {
    const { data } = await getUser(this.routeParamUserId)
    this.setState({ user: data })
  }

  async updateUserProperty(property) {
    let form_value = this.props.form['edit_user_property_form'].values
    let user = this.state.user

    if (property === "role") {
      user[property] = form_value[property].value
    } else {
      user[property] = form_value[property]
    }

    const { data } = await updateUser(user)
    this.props.dispatchObj(reset("edit_user_property_form"))
    this.setState({ user: data, editForm: null })
  }

  showEdit(property) {
    let field
    if (property === "role") {
      field = roleField(this.state.user.role)
    } else {
      field = generalUserField(property)
    }
    const form_object = {
      onSubmit: () => this.updateUserProperty(property),
      cancel: () => {
        this.props.dispatchObj(reset("edit_user_property_form"))
        this.setState({ editForm: null })
      },
      submitButtonText: "Update User Property",
      formFields: field,
      form: "edit_user_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: this.state.user[property]
        }
    }
    this.setState({ editForm: form_object })
  }


  render() {
    return (
      <div style={{ marginTop: "30px" }}>
        {this.state.user &&
          <div>
            <div>Email: {this.state.user.email}</div>
            <div onClick={() => this.showEdit("first_name")}>First Name: <a className="inline">{this.state.user.first_name}</a></div>
            <div onClick={() => this.showEdit("last_name")}>Last Name: <a className="inline">{this.state.user.last_name}</a></div>
            <div  onClick={() => this.showEdit("role")}>Role: <a className="inline">{this.state.user.role}</a></div>
            <div>Joined On: {this.state.user.joined_on}</div>
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
                initialValues={this.state.editForm.initialValues}
              />
            </div>
        }
      </div>
    )
  }
}


function mapStateToProps({ form }) {
  return { form }
}

const actions = { dispatchObj }

export default connect(mapStateToProps, actions)(Users)
