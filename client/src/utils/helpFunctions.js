
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
    if (discount_code.flat_price) {
      cart.discount_total = discount_code.flat_price
    } else {
      cart.discount_total = cart.total * (100/discount_code.percentage)
    }
  } else {
    if (discount_code.flat_price !== null) {
      discount_code.products.map(product => {
        cart.line_items = cart.line_items.map(item => {
          if (item._product_id === product._id) {
            item.product_price = new Number(item.product_price - discount_code.flat_price)
            if (item.product_price < 0) {
              item.product_price = 0
            }
          }
          return item
        })
      })
      cart.discount_total = discount_code.flat_price
    } else {
      discount_code.products.map(product => {
        // find out what products qualify for discount
        let affected_items = cart.line_items.select(item => {
          if (item._product_id === product._id) {
            return true
          }
        })
        // Of those items, find the highest price item
        let highest_price_item = Math.max.apply(Math, affected_items.map(function(o) { return o.product_price; }))
        cart.line_items = cart.line_items.map(item => {
          if (item._product_id === highest_price_item._product_id) {
            // apply discount
            item.product_price = item.product_price * (100/discount_code.percentage)
          }
          return item
        })
      })
      cart.discount_total = discount_code.percentage
    }
  }

  return cart
}

export const revertProductDiscount = async (cart, getProductbyId) => {
  console.log('hi')
  let discount_code = cart.discount_codes[0]
  await Promise.all(discount_code.products.map(async product => {
    console.log('1st')
    cart.line_items = await Promise.all(cart.line_items.map(async item => {
      console.log('2nd')
      if (item._product_id === product) {
        let price = await Promise.all([getProduct(product, getProductbyId) ])
        item.product_price = price[0]
        console.log(item.product_price)
      }
      return item
    }))
  }))
  console.log(cart.line_items)
  return cart.line_items
}

const getProduct = async (id, getProductbyId) => {
  let price
  await Promise.all([getProductbyId(id)]).then(value => {
    console.log(value)
   price = value[0].data.price
  })
  console.log(price)
  return price
}