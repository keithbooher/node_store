
export const capitalizeFirsts = (string) => {
  var splitStr = string.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }
  // Directly return the joined string
  return splitStr.join(' '); 
}
export const calculateSubtotal = (cart) => {
  let sub_total = 0
  cart.line_items.forEach((line_item) => {
    sub_total = sub_total + (line_item.product_price * line_item.quantity)
  })
  return formatMoney(sub_total)
}

export const updatedFormFields = (fields, objectToPullDataFrom) => {
  let details_initial_values = {}
  fields.forEach((field) => {
    details_initial_values[field.name] = objectToPullDataFrom[field.name]
  })
  return details_initial_values
}

export const updatedAddressFormFields = (fields, address) => {
  let details_initial_values = {}
  if (address.bill_or_ship === "shipping") {
    fields.forEach((field) => {
      if (field.name) {
        details_initial_values[field.name] = address[field.name.split("_shipping")[0]]
      }
    })
  } else {
    fields.forEach((field) => {
      if (field.name) {
        details_initial_values[field.name] = address[field.name.split("_billing")[0]]
      }
    })
  }

  return details_initial_values
}

export const productNameToPathName = (string) => {
  return string.toLowerCase().replace(/ /g,"_");
}

export const productPathNameToName = (string) => {
  return string.toLowerCase().replace(/_/g," ");
}

export const formatMoney = (money) => {
  const number = Number(parseFloat(money))
  return number.toFixed(2)
}