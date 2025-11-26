import "dotenv/config";
import { generateResume } from "./utils/aiService.js";

const verifyFix = async () => {
    console.log("Verifying fix with updated aiService.js...");
    try {
        const result = await generateResume("I am a software engineer with 5 years of experience in React and Node.js.");
        console.log("Success! Resume generated:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.error("Verification Failed:", error.message);
        if (error.error) {
            console.error("Detailed Error:", JSON.stringify(error.error, null, 2));
        }
    }
};

verifyFix();
