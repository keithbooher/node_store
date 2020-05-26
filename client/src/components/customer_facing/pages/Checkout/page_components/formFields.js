export const addressFormFields = [
  { label: 'Address', name: 'street_address_1', noValueError: 'You must provide an address', value: "DERP" },
  { label: 'Address Cont', name: 'street_address_2', noValueError: 'You must provide a subject', value: null },
  { label: 'Phone Number', name: 'phone_number', noValueError: 'You must provide a phone number', value: null },
  { label: 'City', name: 'city', noValueError: 'You must provide a city', value: null },
  { label: 'Zip Code', name: 'zip_code', noValueError: 'You must provide a city', value: null },
  { label: 'Company', name: 'company', noValueError: 'You must provide a company', value: null },
  { label: 'First Name', name: 'first_name', noValueError: 'You must provide a first name', value: null },
  { label: 'Last Name', name: 'last_name', noValueError: 'You must provide a first name', value: null },
  { label: 'State', name: 'state', noValueError: 'You must provide a last name', value: null },
  { label: 'Country', name: 'country', noValueError: 'You must provide a country', value: null }
]

const shippingOptions = [
  {
    name: "$10 flatRate",
    value: 10
  },
  {
    name: "$20 otherFlatRate",
    value: 20
  }
]

export const shippingMethods = [
  { 
    label: 'Shipping method', 
    name: 'shipping_rates', 
    typeOfComponent: 'dropdown', 
    options: shippingOptions, 
    noValueError: 'You must provide an address', 
    value: null 
  }
]
