module.exports = (orderNumber) => {
  return `
    <html>
      <body>
        <div>
          <p>Thank you! Your order has been placed</p>
          <p>Order Number: ${orderNumber}</p>
        </div>
      </body>
    </html>
  `
}