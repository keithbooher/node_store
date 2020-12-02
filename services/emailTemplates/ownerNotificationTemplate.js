module.exports = (orderNumber) => {
  return `
    <html>
      <body>
        <div>
          <p>Someone just placed an order with your store</p>
          <p>Order Number: ${orderNumber}</p>
          <a href="nodestore.com/admin/orders/${orderNumber}">Found here</a>
        </div>
      </body>
    </html>
  `
}