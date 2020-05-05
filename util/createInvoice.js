const fs = require("fs");
const PDFDocument = require("pdfkit");
const utils = require('../util/utils');
const path = require('path');
var base64ToImage = require('base64-to-image');
async function createInvoice(invoice, pathInvoice) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generatebarcode(doc, invoice)
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(pathInvoice));


    var html = '<br> Dear ' + invoice.shipping.name + ',' +
        '<br/><br> Making you happy with our service is the key to our success. <br/> <br> Click this link to view your <a href="http://195.229.192.170:3000/' + pathInvoice + '">Invoice</a><br/>   ';
    console.log('http://195.229.192.170:3000/' + pathInvoice)
    utils.SendEmail(invoice.shipping.address, 'Purcahse', html);
}


async function createTransaction(invoice, pathInvoice) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformationTrans(doc, invoice);
    if (invoice.payment_type + "" !== '4')
        generateCustomerInformationBank(doc, invoice);
    else {
        generateCustomerInformationCash(doc, invoice);
    }


    generateInvoiceTableTran(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(pathInvoice));

    var html = '<br> Dear ' + invoice.shipping.name + ',' +
        '<br/ <br> Click this link to view your <a href="http://195.229.192.170:3000/' + pathInvoice + '">Transaction Details</a><br/>   ';
    console.log('http://195.229.192.170:3000/' + pathInvoice)
    utils.SendEmail(invoice.shipping.address, 'Transaction Details', html);
}

function generateHeader(doc) {
    doc
        .image("logo.png", 66, 45, { width: 66 })
        .fillColor("#444444")
        .fontSize(20)
        // .text("Coboney.", 110, 57) // After Logo Text
        .fontSize(10)
        .text("Coboney.", 200, 50, { align: "right" })
        .text("30 Street ,Irbid ,Jordan", 200, 65, { align: "right" })
        .text("", 200, 80, { align: "right" })
        .moveDown();

}

function generatebarcode(doc, invoice) {
    doc.image(invoice.barCode,
        450,
        510,
        {
            width: 100,
            align: 'center',
        });
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.subtotal - invoice.paid),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(
            // invoice.shipping.city +
            // ", " +
            // invoice.shipping.state +
            // ", " +
            invoice.shipping.country,
            300,
            customerInformationTop + 30
        )
        // .image('/Users/apple/Downloads/Coboney-APIs-master/images/deals/57-55-76056810593232.png'',
        //     490,
        //     customerInformationTop - 11,
        //     {
        //         width: 60,
        //         align: 'center',
        //     })
        .moveDown();

    generateHr(doc, 252);
}
function generateCustomerInformationTrans(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Transaction", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Transaction ID:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.total),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(
            // invoice.shipping.city +
            // ", " +
            // invoice.shipping.state +
            // ", " +
            invoice.shipping.country,
            300,
            customerInformationTop + 30
        )
        // .image('/Users/apple/Downloads/Coboney-APIs-master/images/deals/57-55-76056810593232.png'',
        //     490,
        //     customerInformationTop - 11,
        //     {
        //         width: 60,
        //         align: 'center',
        //     })
        .moveDown();

    generateHr(doc, 252);
}
function generateCustomerInformationBank(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Bank Account Details", 50, 280);

    generateHr(doc, 310);

    const customerInformationTop = 320;

    doc
        .fontSize(10)
        .text("Bank", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.bank, 150, customerInformationTop)
        .font("Helvetica")
        .text("Bank Account No:", 50, customerInformationTop + 15)
        .text(invoice.account, 150, customerInformationTop + 15)
        .text("Account Title:", 50, customerInformationTop + 30)
        .text(
            invoice.account_title,
            150,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}
function generateCustomerInformationCash(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Cash", 50, 280);

    generateHr(doc, 310);

    const customerInformationTop = 320;

    doc
        .fontSize(10)
        .text("We will contact with you soon.", 50, customerInformationTop)
        .font("Helvetica-Bold")
        // .text('Cash', 150, customerInformationTop)
        .font("Helvetica")
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.item,
            item.description,
            formatCurrency(item.amount),
            item.quantity,
            formatCurrency(item.amount * item.quantity)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.subtotal)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Extra Charges",
        "",
        formatCurrency(invoice.extra_charges)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Total",
        "",
        formatCurrency(invoice.total)
    );
    doc.font("Helvetica");
}
function generateInvoiceTableTran(doc, invoice) {
    let i;
    const invoiceTableTop = 420;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        const position = invoiceTableTop + (i + 1) * 30;
        generateTableRow(
            doc,
            position,
            item.item,
            item.description,
            formatCurrency(item.amount),
            item.quantity,
            formatCurrency(item.amount * item.quantity)
        );

        generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.subtotal)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Extra Charges",
        "",
        formatCurrency(invoice.extra_charges)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Total",
        "",
        formatCurrency(invoice.total)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Copyright © 2020 Coboney. All Rights Reserved.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 90, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(cents) {
    return "JOD " + Number(cents).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}

module.exports = {
    createInvoice, createTransaction
};