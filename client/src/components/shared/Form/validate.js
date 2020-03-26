import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import validateEmails from '../../../../utils/validateEmails'


const validate = ({values, formFields}) => {
  const errors = {}

  errors.recipients = validateEmails(values.recipients || '')

  _.each(formFields, ({ name, noValueError }) => {
    if(!values[name]) {
      errors[name] = noValueError
    }
  })
  
  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors
}

function mapStateToProps({ formFields }) {
  return { formFields }
}

export default connect(mapStateToProps, null)(validate)