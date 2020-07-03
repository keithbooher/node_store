import React, { Component } from 'react'
import { getUser, updateUser } from "../../../utils/API"
import { capitalizeFirsts } from "../../../utils/helperFunctions"
import { validatePresenceOnAll } from "../../../utils/validations"
import { reset } from "redux-form"
import FormModal from "../../shared/Form/FormModal"
import { connect } from 'react-redux'

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
    const form_value = this.props.form['edit_user_property_form'].values
    let user = this.state.user
    user[property] = form_value[property]
    const { data } = await updateUser(user)
    this.props.dispatch(reset("edit_user_property_form"))
    this.setState({ user: data, editForm: null })
  }

  showEdit(property) {
    const form_object = {
      onSubmit: () => this.updateUserProperty(property),
      cancel: () => {
        this.props.dispatch(reset("edit_user_property_form"))
        this.setState({ editForm: null })
      },
      submitButtonText: "Update User Property",
      formFields: [
        { label: capitalizeFirsts(property.replace("_", " ")), name: property, noValueError: `You must provide a value` },
      ],
      form: "edit_user_property_form",
      validation: validatePresenceOnAll,
      initialValues: {
          [property]: this.state.user[property]
        }
    }
    this.setState({ editForm: form_object })
  }


  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.user &&
          <div>
            <div onClick={() => this.showEdit("first_name")}>First Name: {this.state.user.first_name}</div>
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

export default connect(mapStateToProps, null)(Users)
