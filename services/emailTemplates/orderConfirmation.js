module.exports = (orderNumber) => {
  return `
    <html>
      <body>
        <div>
          <p>Thank you! Your order has been placed</p>
          <p>Order Number: ${orderNumber}</p>
          <p>Please allow 3 days processing and 3-5 business days for shipping </p>
        </div>
      </body>
    </html>
  `
}