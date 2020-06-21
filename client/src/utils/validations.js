import _ from 'lodash'

export const  validatePresenceOnAll = (values, props) => {
  if (!props.validation) {
    return
  }
  const errors = {}

  _.each(props.formFields, ({ name, noValueError }) => {
    if(!values[name]) {
      errors[name] = noValueError
    }
  })
  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}



////////////////////////////////////////////////////////////////
//////////////// Legacy Email List Validation //////////////////
////////////////////////////////////////////////////////////////
// check comma separated emails
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const listOfEmailsValidation = (email) => {
  re.test(email)

  if(re.test(email) === false) {
    return `Email is invalid`
  }

  return null
}