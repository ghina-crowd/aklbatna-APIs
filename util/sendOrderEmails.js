



var Mailgen = require('mailgen');
const utils = require('./utils');

async function sendOrderStatus(order, User, Message) {

    var data = [];
    var totalOrderPrice = 0;
    var number = 0;
    var name = '';
    var price = '';
    order['dataValues'].alkebetna_sub_orders.forEach(subOrders => {

        name = '';
        price = '';
        number = number + 1;

        if (subOrders['dataValues'].Meal) {
            // console.log(subOrders['dataValues'].quantity);
            name = subOrders['dataValues'].Meal['dataValues'].name;
            // console.log(name);
            totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].Meal['dataValues'].price)
            price = subOrders['dataValues'].quantity + " * " + subOrders['dataValues'].Meal['dataValues'].price + " = " + String(totalOrderPrice)
        }

        if (subOrders['dataValues'].offer) {
            name = subOrders['dataValues'].offer['dataValues'].title;
            // console.log(name);
            totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].offer['dataValues'].price)
            price = subOrders['dataValues'].quantity + " * " + subOrders['dataValues'].offer['dataValues'].price + " = " + String(totalOrderPrice)
        }
        if (subOrders['dataValues'].subscription) {
            name = subOrders['dataValues'].subscription['dataValues'].title;
            // console.log(name);
            totalOrderPrice = totalOrderPrice + (Number(subOrders['dataValues'].quantity) * subOrders['dataValues'].subscription['dataValues'].price)
            price = subOrders['dataValues'].quantity + " * " + subOrders['dataValues'].subscription['dataValues'].price + " = " + String(totalOrderPrice)
        }

        data.push({
            item: number,
            description: name,
            price: price

        });


    });

    // Prepare email contents
    var email = {
        body: {
            name: User.first_name + ' ' + User.last_name,
            intro: Message,
            table: {
                title: 'Transaction# ' + order['dataValues'].transaction_id,
                data: data,
                columns: {
                    // Optionally, customize the column widths
                    customWidth: {
                        item: '4%',
                        price: '25%'
                    },
                    // Optionally, change column text alignment
                    customAlignment: {
                        price: 'right'
                    }
                }
            },
            action: {
                instructions: 'You can check the status of your order and more.',
                button: {
                    color: '#3869D4',
                    text: 'View',
                    link: 'https://Alkabetna.com/order/' + order['dataValues'].order_id,
                }
            },
            outro: 'We thank you for your purchase.'
        }
    };






    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Alkabetna',
            link: 'https://Alkabetna.com/',
            // Optional logo
            logo: 'http://195.229.192.170:3100/images/logo.png'
        }
    });


    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var emailText = mailGenerator.generatePlaintext(email);

    utils.SendEmailsForOrders(User.email, 'Alkabetna', emailBody, emailText);
}
async function sendSubs(emailTo, Message) {


    // Prepare email contents
    var email = {
        body: {
            intro: Message,
        }
    };






    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            // Appears in header & footer of e-mails
            name: 'Alkabetna',
            link: 'https://Alkabetna.com/',
            // Optional logo
            logo: 'http://195.229.192.170:3100/images/logo.png'
        }
    });


    // Generate an HTML email with the provided contents
    var emailBody = mailGenerator.generate(email);

    // Generate the plaintext version of the e-mail (for clients that do not support HTML)
    var emailText = mailGenerator.generatePlaintext(email);

    console.log('sending emails', [emailTo])
    utils.SendEmailsForOrders([emailTo], 'Alkabetna', emailBody, emailText);
}

module.exports = {
    sendOrderStatus, sendSubs
};