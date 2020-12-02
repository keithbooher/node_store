import _ from 'lodash'

export const shippingAddressFormFields = [
  { label: 'Address', name: 'street_address_1_shipping', noValueError: 'You must provide an address' },
  { label: 'Address Cont', name: 'street_address_2_shipping', noValueError: 'You must provide a subject' },
  { label: 'Phone Number', name: 'phone_number_shipping', typeOfComponent: "number", noValueError: 'You must provide a phone number' },
  { label: 'City', name: 'city_shipping', noValueError: 'You must provide a city' },
  { label: 'Zip Code', name: 'zip_code_shipping', noValueError: 'You must provide a city' },
  { label: 'Company', name: 'company_shipping', noValueError: 'You must provide a company' },
  { label: 'First Name', name: 'first_name_shipping', noValueError: 'You must provide a first name' },
  { label: 'Last Name', name: 'last_name_shipping', noValueError: 'You must provide a first name' },
  { label: 'State', name: 'state_shipping', typeOfComponent: "states", options: { bill_or_ship: "shipping" }, noValueError: 'You must provide a last name' },
  { label: 'Country', name: 'country_shipping', typeOfComponent: "countries", options: { bill_or_ship: "shipping" }, noValueError: 'You must provide a country' }
]

export const billingAddressFormFields = [
  { label: 'Address', name: 'street_address_1_billing', noValueError: 'You must provide an address' },
  { label: 'Address Cont', name: 'street_address_2_billing', noValueError: 'You must provide a subject' },
  { label: 'Phone Number', name: 'phone_number_billing', typeOfComponent: "number", noValueError: 'You must provide a phone number' },
  { label: 'City', name: 'city_billing', noValueError: 'You must provide a city' },
  { label: 'Zip Code', name: 'zip_code_billing', noValueError: 'You must provide a city' },
  { label: 'Company', name: 'company_billing', noValueError: 'You must provide a company' },
  { label: 'First Name', name: 'first_name_billing', noValueError: 'You must provide a first name' },
  { label: 'Last Name', name: 'last_name_billing', noValueError: 'You must provide a first name' },
  { label: 'State', name: 'state_billing', typeOfComponent: "states", options: { bill_or_ship: "billing" }, noValueError: 'You must provide a last name' },
  { label: 'Country', name: 'country_billing', typeOfComponent: "countries", options: { bill_or_ship: "billing" }, noValueError: 'You must provide a country' }
]

export const validate = (values, props) => {
  if (!props.validation) {
    return
  }
  const errors = {}

  _.each(props.formFields, ({ name, noValueError }) => {
    if (name === "street_address_2_billing" || name === "street_address_2_shipping") {
      return
    }
    if (name === "company_billing" || name === "company_shipping") {
      return
    }
    if(!values[name]) {
      errors[name] = noValueError
    }
  })
  
  // if no errors i.e. an empty object, then we know all the values are valid.
  return errors;
}
