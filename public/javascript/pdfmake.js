const express = require('express');
const router = express.Router();
const pdfMake = require('../../pdfmake/pdfmake');
const vfsFonts = require('../../pdfmake/vfs_fonts');
//pdfMake.vfs = vfsFonts.pdfMake.vfs;
router.post("/viewfir", function(req, res, next) {
    const fullname = req.body.fullname;
    const guardianname = req.body.fatherorhusbandname;
    const address = req.body.contactaddress;

    const contactnumber = req.body.contactnumber;

    const email = req.body.email;

    const date = req.body.date;

    const subject = req.body.subject;

    const complaint = req.body.complaint;

    //const guardianname = req.body.fatherorhusbandname;


    var documentDefinition = {
        content: [
            'From',
            `${fullname} `,
            `${guardianname}`,
            `${address}`,
            `${contactnumber}`,
            `${email}`,
            `Date :${date}`,
            `Subject: ${subject}`,
            "Respected sir/madam,"
            `               ${complaint}`,
            `Evidence if any :${evidence}`
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="filename.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });
});
module.exports = router;