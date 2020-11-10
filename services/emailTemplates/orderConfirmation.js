module.exports = (orderNumber) => {
  return `
    <html>
      <body>
        <div>
          <p>Thank you for your purchase at Keep Your Eye Open! Your order has been placed</p>
          <p>Order Number: ${orderNumber}</p>
          <p>Please allow 7 days for processing and 3-5 business days for shipping </p>
          <p>If you have any questions concerning your order, send me an email at keepyoureyeopn@gmail.com</p>
        </div>
      </body>
    </html>
  `
}