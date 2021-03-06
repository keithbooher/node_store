
export const capitalizeFirsts = (string) => {
  var splitStr = string.split(' ');
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
  if (cart.discount_codes && cart.discount_codes.length > 0 && !cart.discount_codes.affect_order_total) {
    if (cart.discount_codes[0].apply_to_all_products) {
      sub_total = applyToAll(cart.discount_codes[0], cart)
    } else {
      sub_total = applyToHighest(cart.discount_codes[0], cart)
    }
  } else {
    cart.line_items.forEach((line_item) => {
      sub_total = sub_total + (line_item.product_price * line_item.quantity)
    })
  }
  return formatMoney(sub_total)
}

const applyToAll = (discount_code, cart) => {
  let update_cart = cart
  let sub_total = 0
  let code_products

  // IF PRODUCTS HAVE BEEN POPULATED
  if (typeof discount_code.products[0] === "string") {
    code_products = discount_code.products
  } else {
    code_products = discount_code.products.map(prod => prod._id)
  }
  
  update_cart.line_items.forEach(item => {
    if (code_products.indexOf(item._product_id) !== -1) {
      let price

      if (discount_code.flat_price !== null) {
        price = new Number((item.product_price - item.discount) * item.quantity)
      } else {
        price = (item.product_price * (item.discount/100)) * item.quantity
      }
      if (price < 0) {
        price = 0
      }

      sub_total = sub_total + price
    } else {
      sub_total = sub_total + (item.product_price * item.quantity)
    }
  })

  return sub_total
}

const applyToHighest = (discount_code, cart) => {
  let line_items = new Array(cart.line_items)[0]
  let update_cart = new Object(cart)
  let affected_items = []
  let code = discount_code
  let sub_total = 0

  code.products.forEach(product => {
    // find out what products qualify for discount
    line_items.forEach(item => {
      if (item._product_id === product._id) {
        affected_items.push(item)
      }
    })
  })
  
  // Of those items, find the highest price item
  let highest_price_item = affected_items.sort((a, b) => (a.product_price > b.product_price) ? 1 : -1)

  update_cart.line_items.forEach(item => {
    if (highest_price_item.length > 0 && item._product_id === highest_price_item[highest_price_item.length - 1]._product_id) {
      let price     
      // apply discount
      if (discount_code.flat_price !== null) {
        price = new Number((item.product_price - item.discount) * item.quantity)
      } else {
        price = (item.product_price * (item.discount/100)) * item.quantity
      }

      if (price < 0) {
        price = 0
      }

      sub_total = sub_total + price
    } else {
      sub_total = sub_total + (item.product_price * item.quantity)
    }
  })

  return sub_total
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
  if (!money) {
    money = 0
  }
  const number = Number(parseFloat(money))
  return number.toFixed(2)
}

export const discountCodeAssignments = (discount_code, cart) => {

  if (discount_code.apply_to_all_products) {
    cart.line_items = assignToAll(discount_code, cart)
  } else {
    cart.line_items = assignToHighest(discount_code, cart)
  }
  return cart
}

const assignToAll = (discount_code, cart) => {
  let update_cart = cart
  discount_code.products.map(product => {
    update_cart.line_items = update_cart.line_items.map(item => {
      if (item._product_id === product._id) {
        if (discount_code.flat_price !== null) {
          item.discount = discount_code.flat_price
        } else {
          item.discount = discount_code.percentage
        }
      }
      return item
    })
  })
  return update_cart.line_items
}

const assignToHighest = (discount_code, cart) => {
  let line_items = cart.line_items
  let update_cart = cart
  let affected_items = []
  let code = discount_code

  code.products.map(product => {
    // find out what products qualify for discount
    line_items.forEach(item => {
      if (item._product_id === product._id) {
        affected_items.push(item)
      }
    })
  })
  
  // Of those items, find the highest price item
  let highest_price_item = affected_items.sort((a, b) => (a.product_price > b.product_price) ? 1 : -1)

  update_cart.line_items = update_cart.line_items.map(item => {
    if (highest_price_item.length > 0 && item._product_id === highest_price_item[highest_price_item.length - 1]._product_id) {
      // apply discount
      if (discount_code.flat_price !== null) {
        item.discount = discount_code.flat_price
      } else {
        item.discount = discount_code.percentage
      }
    }
    return item
  })

  return update_cart.line_items
}

export const revertProductDiscount = (cart) => {
  let discount_code = cart.discount_codes[0]
  discount_code.products.map(product => {
    cart.line_items = cart.line_items.map(item => {
      if (item._product_id === product) {
        item.discount = null
      }
      return item
    })
  })
  return cart.line_items
}

// const getProductPrice = async (id, getProductbyId) => {
//   let price
//   await Promise.all([getProductbyId(id)]).then(value => {
//    price = value[0].data.price
//   })
//   return price
// }