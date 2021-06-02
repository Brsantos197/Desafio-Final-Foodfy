const nodemailer = require('nodemailer')

module.exports =  nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "f6e60ef521fe10",
      pass: "13c305e89b80c7"
    }
  })

