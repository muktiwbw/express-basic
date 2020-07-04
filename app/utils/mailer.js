const env = require('./../config/env');
const nodemailer = require('nodemailer');

class Mailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.mailHost,
      port: env.mailPort,
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.mailUsername, // generated ethereal user
        pass: env.mailPassword // generated ethereal password
      }
    });

    this.from = '"Fred Foo 👻" <foo@example.com>', // sender address
    this.to = "bar@example.com, baz@example.com", // list of receivers
    this.subject = "Hello ✔", // Subject line
    this.text = "Hello world?" // plain text body
  }

  setSender(sender) {
    this.from = sender.from;
    this.to = sender.to;
    this.subject = sender.subject;
    this.text = sender.text;

    return this;
  }

  send() {
    return this.transporter.sendMail({
      from: this.from,
      to: this.to,
      subject: this.subject,
      text: this.text
    });
  }
}

module.exports = Mailer;