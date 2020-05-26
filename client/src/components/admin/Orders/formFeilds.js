


const shippingStatuses = [

  {
    name: "pending",
    value: "pending",
    default: false
  },
  {
    name: "processing",
    value: "processing",
    default: false
  },
  {
    name: "completed",
    value: "completed",
    default: false
  },
  {
    name: "canceled",
    value: "canceled",
    default: false
  },
  {
    name: "returned",
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
