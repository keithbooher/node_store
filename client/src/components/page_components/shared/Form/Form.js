import _ from 'lodash'
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import FormField from './FormField'
import validateEmails from '../../../../utils/validateEmails'


class Form extends Component {
  constructor(props) {
    super()
    this.renderFields = this.renderFields.bind(this)
  }
  
  renderFields() {
    return _.map(this.props.formFields, ({ label, name, value }) => {
      return <Field component={FormField} type="text" label={label} name={name} />
    })
  }

  render() {
    return (
      <div>
        <form id={!this.props.formId ? "general_form_id" : this.props.formId} onSubmit={(e) => this.props.onSubmit(e)}>
          {this.renderFields()}
          {!this.props.replaceSubmitButton ?
          <button type="submit" className="teal btn-flat right white-text">
            <i className="material-icons right">{this.props.submitButtonText}</i>
          </button> : this.props.submitButton}
        </form>
      </div>
    )
  }
}


function validate(values, props) {
  const errors = {}
  errors.recipients = validateEmails(values.recipients || '')
  
  _.each(props.formFields, ({ name, noValueError }) => {
    if(!values[name]) {
      errors[name] = noValueError
    }
  })
  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}

export default reduxForm({
  validate,
  destroyOnUnmount: false,
})(Form)