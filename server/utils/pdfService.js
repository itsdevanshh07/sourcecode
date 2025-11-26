import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { v2 as cloudinary } from 'cloudinary';

export const generatePdf = async (htmlContent, filename) => {
    let browser;
    const tempFilePath = path.join(os.tmpdir(), filename);

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        await page.pdf({
            path: tempFilePath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            }
        });

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: 'raw', // Use 'raw' for PDFs to keep them as files
            folder: 'resumes',
            public_id: path.parse(filename).name,
            overwrite: true
        });

        // Clean up temp file
        fs.unlinkSync(tempFilePath);

        return uploadResult.secure_url;

    } catch (error) {
        console.error("PDF Generation Error:", error);
        // Attempt cleanup if it exists
        if (fs.existsSync(tempFilePath)) {
            try { fs.unlinkSync(tempFilePath); } catch (e) { console.error("Cleanup error:", e); }
        }
        throw new Error("Failed to generate PDF");
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
