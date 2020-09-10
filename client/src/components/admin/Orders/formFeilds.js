


const shippingStatuses = [

  {
    name: "pending",
    redux_field: "shipping_status",
    value: "pending",
    default: false
  },
  {
    name: "processing",
    redux_field: "shipping_status",
    value: "processing",
    default: false
  },
  {
    name: "completed",
    redux_field: "shipping_status",
    value: "completed",
    default: false
  },
  {
    name: "canceled",
    redux_field: "shipping_status",
    value: "canceled",
    default: false
  },
  {
    name: "returned",
    redux_field: "shipping_status",
    value: "returned",
    default: false
  }

]


export const shippingStatusDropDown = [
  { 
    label: 'Shipping Status', 
    name: 'shipping_status', 
    typeOfComponent: 'dropdown', 
    options: shippingStatuses, 
    noValueError: 'You must provide an address', 
    value: null 
  }
]
