
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

export const discountCodeAdjustments = (discount_code, cart) => {
  if (discount_code.affect_order_total) {
    if (discount_code.flat_price !== null) {
      cart.discount_total = discount_code.flat_price
      cart.sub_total = cart.sub_total - discount_code.flat_price
    } else {
      cart.discount_total = discount_code.percentage
      cart.sub_total = cart.sub_total * (discount_code.percentage/100)
    }

  } else {
    console.log(discount_code.apply_to_all_products)
    if (discount_code.apply_to_all_products) {
      cart.line_items = applyToAll(discount_code, cart)
    } else {
      cart.line_items = applyToHighest(discount_code, cart)
    }

    if (discount_code.flat_price !== null) {
      cart.discount_total = discount_code.flat_price
    } else {
      cart.discount_total = discount_code.percentage
    }

  }

  return cart
}

const applyToAll = (discount_code, cart) => {
  let update_cart = cart
  discount_code.products.map(product => {
    update_cart.line_items = update_cart.line_items.map(item => {
      if (item._product_id === product._id) {

        if (discount_code.flat_price !== null) {
          item.product_price = new Number(item.product_price - discount_code.flat_price)
        } else {
          item.product_price = item.product_price * (discount_code.percentage/100)
        }

        if (item.product_price < 0) {
          item.product_price = 0
        }
      }
      return item
    })
  })
  return update_cart.line_items
}

const applyToHighest = (discount_code, cart) => {
  let line_items = new Array(cart.line_items)[0]
  let update_cart = new Object(cart)
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
      if (code.flat_price !== null) {
        item.product_price = new Number(item.product_price - code.flat_price)
      } else {
        item.product_price = item.product_price * (code.percentage/100)
      }

      if (item.product_price < 0) {
        item.product_price = 0
      }

    }
    return item
  })

  return update_cart.line_items
}

export const revertProductDiscount = async (cart, getProductbyId) => {
  let discount_code = cart.discount_codes[0]
  await Promise.all(discount_code.products.map(async product => {
    cart.line_items = await Promise.all(cart.line_items.map(async item => {
      if (item._product_id === product) {
        let price = await Promise.all([getProductPrice(product, getProductbyId) ]).then(value => value[0])
        item.product_price = price
      }
      return item
    }))
  }))
  return cart.line_items
}

const getProductPrice = async (id, getProductbyId) => {
  let price
  await Promise.all([getProductbyId(id)]).then(value => {
   price = value[0].data.price
  })
  return price
}