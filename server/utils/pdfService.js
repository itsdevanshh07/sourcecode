import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

const RESUME_DIR = path.join(process.cwd(), 'resumes');

// Ensure resume directory exists
if (!fs.existsSync(RESUME_DIR)) {
    fs.mkdirSync(RESUME_DIR, { recursive: true });
}

export const generatePdf = async (htmlContent, filename) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const filePath = path.join(RESUME_DIR, filename);

        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        return `/resumes/${filename}`;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        throw new Error("Failed to generate PDF");
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
