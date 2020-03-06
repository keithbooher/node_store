import _ from 'lodash'
import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import FormField from './FormField'
import validateEmails from '../../../../utils/validateEmails'


class Form extends Component {
  constructor(props) {
    super()
    this.renderFields = this.renderFields.bind(this)
    this.state = {

    }
  }
  
  renderFields() {
    return _.map(this.props.formFields, ({ label, name }) => {
      return <Field component={FormField} type="text" label={label} name={name} />
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onSurveySubmit)}>
          {this.renderFields()}
          <button type="submit" className="teal btn-flat right white-text">
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    )
  }
}


function validate(values, props) {
  console.log(values)
  console.log(props)
  const errors = {}

  errors.recipients = validateEmails(values.recipients || '')

  _.each(props.formFields, ({ name, noValueError }) => {
    if(!values[name]) {
      errors[name] = noValueError
    }
  })
  
  // // if no errors i.e. an empty object, then we know all the values are valid.
  return errors
}

export default reduxForm({
  validate,
  form: 'checkoutForm',
  destroyOnUnmount: false,
})(Form)