import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import pupperteer from 'puppeteer';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const BASE_URL = 'http://localhost:3000';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CERTIFICATE_TEMPLATE_PATH = path.join(__dirname, '../assets/certificates');

const generatePdf = async (htmlContent) =>{
    try {
        const browser = await pupperteer.launch({
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        //await

        page.setContent(htmlContent, {waitUntil: 'domcontentloaded', timeout: 60000});

        const pdfBuffer = await page.pdf({
            width: '260mm',
            height: '150mm',
            printBackground: true,
        })

        await browser.close();
        return pdfBuffer;
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}

export const createCertificate = async (req, res) => {
    try {
        const {
            registerId,
            email,
            phone,
            address,
            fullName,
            dob,
            gender,
            bloodGroup,
            dateTime
        } = req.body;

     const dateObject = new Date(dateTime); // Using a standard ISO-like format is often more reliable

const formatter = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false, // Use 24-hour format
});

const formattedDate = formatter.format(dateObject);

        const template_path = path.join(__dirname, 'certificate.html');
        const templateContent = fs.readFileSync(template_path, 'utf-8');
        const template = Handlebars.compile(templateContent);

        const data = {
            registerId,
            emailId: email,
            phoneNumber: phone,
            address,
            fullName,
            dateOfBirth:dob,
            gender,
            bloodGroup,
            DateTime:formattedDate
        }

        const htmlContent = template(data);
        const pdfBuffer = await generatePdf(htmlContent);

        if(!fs.existsSync(CERTIFICATE_TEMPLATE_PATH)){
            fs.mkdirSync(CERTIFICATE_TEMPLATE_PATH, { recursive: true });
        }

        const fileName = `${Date.now()}_certificate.pdf`;

        const pdfPath = path.join(CERTIFICATE_TEMPLATE_PATH, fileName);

        fs.writeFileSync(pdfPath, pdfBuffer);

        const fileUrl = `${BASE_URL}/assets/certificates/${fileName}`;

        return res.status(200).json({status: 1, message:'Certificate generated successfully', certificateUrl: fileUrl });
    } catch (error) {
        console.error('Error creating certificate:', error);
        return res.status(500).json({ status : 0, message: 'certificate generation failed', error: error.message });
    }

}