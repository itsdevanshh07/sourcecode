import { getTemplateHtml } from "./utils/resumeTemplates.js";
import { generatePdf } from "./utils/pdfService.js";

const mockData = {
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    summary: "Experienced software engineer.",
    skills: ["JavaScript", "React", "Node.js", "Puppeteer"],
    experiences: [
        {
            title: "Senior Developer",
            company: "Tech Corp",
            from: "2020",
            to: "Present",
            desc: ["Led team of 5 developers.", "Optimized backend performance by 50%."]
        }
    ],
    education: [
        {
            degree: "BS Computer Science",
            school: "State University",
            year: "2019"
        }
    ]
};

const verifyV2 = async () => {
    console.log("Testing Resume Builder v2...");

    const templates = ['chronological', 'functional', 'combination', 'ats'];

    for (const t of templates) {
        console.log(`Generating ${t} template...`);
        try {
            const html = getTemplateHtml(mockData, t);
            const filename = `test_${t}.pdf`;
            const url = await generatePdf(html, filename);
            console.log(`Success: ${url}`);
        } catch (error) {
            console.error(`Failed to generate ${t}:`, error);
        }
    }
};

verifyV2();
