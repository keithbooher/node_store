import { capitalizeFirsts } from "../../../utils/helpFunctions"

export const roleField = (role) => {
  return (
    [
      { 
        label: "Role", 
        name: "role", 
        typeOfComponent: 'dropdown', 
        options: [
          {
            name: "Admin",
            value: "admin",
            default: role === "admin" ? true : false
          },
          {
            name: "Customer",
            value: "customer",
            default: role === "customer" ? true : false
          },
        ], 
        noValueError: 'You must provide an address', 
        value: null 
      }      
    ]
  )
}

export const generalUserField = (property) => {
  return (
    [
      { label: capitalizeFirsts(property.replace("_", " ")), name: property, noValueError: `You must provide a value` },
    ]
  )
}