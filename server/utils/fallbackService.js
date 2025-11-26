// Simple rule-based fallback when AI is down
export const getFallbackResponse = (message) => {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
        return "Hi there! I'm currently in offline mode, but I can still help you navigate the site. How can I assist you?";
    }

    if (lowerMsg.includes("job") || lowerMsg.includes("work") || lowerMsg.includes("vacancy")) {
        return "You can browse all available jobs on our 'Apply Job' page. We have listings for various roles!";
    }

    if (lowerMsg.includes("resume") || lowerMsg.includes("cv")) {
        return "Check out our Resume Builder tool! It helps you create a professional ATS-friendly resume in minutes.";
    }

    if (lowerMsg.includes("apply") || lowerMsg.includes("application")) {
        return "To apply for a job, simply click on a job listing and hit the 'Apply Now' button.";
    }

    if (lowerMsg.includes("login") || lowerMsg.includes("sign in")) {
        return "You can log in using the button at the top right. We support secure login via Clerk.";
    }

    return "I'm currently having trouble connecting to my AI brain. Please try again later, or browse the site manually using the navigation menu.";
};
