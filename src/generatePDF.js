const fs = require("fs");
const PdfPrinter = require("pdfmake");

var fonts = {
  Roboto: {
    normal: __dirname + "/fonts/Roboto-regular.ttf",
    bold: __dirname + "/fonts/Roboto-Medium.ttf",
    italics: __dirname + "/fonts/Roboto-Italic.ttf",
    bolditalics: __dirname + "/fonts/Roboto-MediumItalic.ttf",
  },
};

var data = [];
data["invoicenumber"] = "62384";
data["buyeraddress"] = "1600 Pennsylvania Avenue NW";
data["item"] = "PHPRunner Enterprise Edition";
data["price"] = "$999.00";

function crearPDF(orden_compra) {
  var printer = new PdfPrinter(fonts);
  var docDefinition = {
    content: [
      {
        fontSize: 11,
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              {
                text: "Status: unpaid",
                border: [false, false, false, true],
                margin: [-5, 0, 0, 10],
              },
              {
                text: "Invoice# " + data.invoicenumber,
                alignment: "right",
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
              },
            ],
          ],
        },
      },
      {
        layout: "noBorders",
        fontSize: 11,
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              { text: "Website.com", margin: [0, 10, 0, 0] },
              {
                text: "Invoice date: " + data.invoicedata,
                alignment: "right",
                margin: [0, 10, 0, 0],
              },
            ],
            ["...", ""],
            ["...", ""],
            ["...", ""],
          ],
        },
      },
      {
        fontSize: 11,
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              {
                text: " ",
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
              },
              {
                text: "Payment amount: $" + data.price,
                alignment: "right",
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
              },
            ],
          ],
        },
      },
      {
        layout: "noBorders",
        fontSize: 11,
        table: {
          widths: ["100%"],
          body: [
            [{ text: "User account for payment:", margin: [0, 10, 0, 0] }],
            [data.buyerinfo],
            [data.buyeraddress],
            ["Payment link:"],
            [
              {
                text:
                  "https://website.com/shopcart/invoices_view.php?hash=" +
                  data.hash,
                margin: [0, 0, 0, 10],
                fontSize: 10,
              },
            ],
          ],
        },
      },
      {
        fontSize: 11,
        table: {
          widths: ["5%", "56%", "13%", "13%", "13%"],
          body: [
            [
              { text: "Pos", border: [false, true, false, true] },
              { text: "Item", border: [false, true, false, true] },
              { text: "Price", border: [false, true, false, true] },
              {
                text: "Quantity",
                alignment: "center",
                border: [false, true, false, true],
              },
              { text: "Total", border: [false, true, false, true] },
            ],
            [
              { text: "1", border: [false, true, false, true] },
              { text: data.item, border: [false, true, false, true] },
              { text: "$" + data.price, border: [false, true, false, true] },
              {
                text: "1",
                alignment: "center",
                border: [false, true, false, true],
              },
              { text: "$" + data.price, border: [false, true, false, true] },
            ],
          ],
        },
      },
      {
        layout: "noBorders",
        fontSize: 11,
        margin: [0, 0, 5, 0],
        table: {
          widths: ["88%", "12%"],
          body: [
            [
              { text: "Subtotal:", alignment: "right", margin: [0, 5, 0, 0] },
              { text: "$" + data.price, margin: [0, 5, 0, 0] },
            ],
            [{ text: "Tax %:", alignment: "right" }, "$0.00"],
          ],
        },
      },
      {
        fontSize: 11,
        table: {
          widths: ["88%", "12%"],
          body: [
            [
              {
                text: "Total:",
                alignment: "right",
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
              },
              {
                text: "$" + data.price,
                border: [false, false, false, true],
                margin: [0, 0, 0, 10],
              },
            ],
          ],
        },
      },
      {
        layout: "noBorders",
        fontSize: 11,
        alignment: "center",
        table: {
          widths: ["100%"],
          body: [
            [{ text: "Wire transfer info:", margin: [0, 10, 0, 0] }],
            ["SWIFT: ..."],
            ["Account number: ..."],
            ["Company name: ..."],
            [" "],
            ["Company address:"],
            ["..."],
          ],
        },
      },
    ],
  };
  var options = {};

  var pdfDoc = printer.createPdfKitDocument(docDefinition, options);

  pdfDoc.pipe(fs.createWriteStream("Compra_PineAppleSea_Respuesta.pdf"));
  pdfDoc.end();
}

module.exports = crearPDF;
