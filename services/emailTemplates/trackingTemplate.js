module.exports = (order) => {
  let url
  let shipment = order.shipment
  if (shipment.chosen_rate.carrier === "Fedex") {
    url = `https://www.fedex.com/apps/fedextrack/index.html?tracknumbers=${shipment.tracking}&cntry_code=us`
  } else if (shipment.chosen_rate.carrier === "UPS") {
    url = `http://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${shipment.tracking}`
  } else if (shipment.chosen_rate.carrier === "USPS") {
    url = `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${shipment.tracking}`
  }
  return `
    <html>
      <body>
        <div>
          <p>Good news!</p>
          <p>Your order has been shipped</p>
          <p>Here is your tracking link</p>
          <p>${url}</p>
        </div>
      </body>
    </html>
  `
}