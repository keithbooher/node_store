module.exports = (order) => {

  return `
    <html>
      <body>
        <div>
          <p>Good news!</p>
          <p>Your order ${order.id} is being processed and should ship soon</p>
        </div>
      </body>
    </html>
  `
}