// server.js
import "dotenv/config";
import "./config/instrument.js";
import express from "express";
import cors from "cors";
// import "dotenv/config"; // Moved to top
import path from "path";
import * as Sentry from "@sentry/node";

// Database + Cloudinary
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

// Clerk (v4+)
import { clerkMiddleware, requireAuth } from "@clerk/express";

// Routes
import chatRouter from "./routes/chatRoutes.js";   // <-- NEW AI ROUTES
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// --------------------------------------
// INIT SERVICES
// --------------------------------------
await connectDB();
await connectCloudinary();

// --------------------------------------
// MIDDLEWARE
// --------------------------------------
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        /\.vercel\.app$/  // Allow all Vercel deployments
      ];

      const isAllowed = allowedOrigins.some(allowed => {
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------------------------
// PUBLIC ROUTES (NO CLERK)
// AI Chat + Resume Builder (Gemini)
// --------------------------------------
app.use("/api", chatRouter);

// Serve resume files
app.use("/resumes", express.static(path.join(process.cwd(), "resumes")));

// Webhooks (Clerk Webhooks work even without clerkMiddleware)
app.post("/webhooks", clerkWebhooks);

// --------------------------------------
// CLERK GLOBAL MIDDLEWARE
// --------------------------------------
app.use(clerkMiddleware());

// --------------------------------------
// PROTECTED ROUTES (CLERK REQUIRED)
// --------------------------------------
app.use("/api/company", companyRoutes);
app.use("/api/users", requireAuth(), userRoutes);
app.use("/api/jobs", jobRoutes);

// --------------------------------------
// ROOT ENDPOINT
// --------------------------------------
app.get("/", (req, res) => {
  res.send("ASAP Backend running successfully 🚀");
});

// Health check endpoint for AI service
app.get("/api/health", (req, res) => {
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  const hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY);
  const hasMongoDB = !!process.env.MONGODB_URI;

  res.json({
    status: "ok",
    services: {
      groq: hasGroqKey ? "configured" : "missing",
      cloudinary: hasCloudinary ? "configured" : "missing",
      mongodb: hasMongoDB ? "configured" : "missing"
    },
    timestamp: new Date().toISOString()
  });
});

// Sentry test route
app.get("/debug-sentry", function (req, res) {
  throw new Error("Sentry test error");
});

// Setup Sentry error handler
Sentry.setupExpressErrorHandler(app);

// --------------------------------------
// START SERVER
// --------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n===================================`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`===================================`);
  console.log("🔹 Public AI Routes:");
  console.log("   → POST /api/chat");
  console.log("   → POST /api/resume");
  console.log("🔹 Protected with Clerk:");
  console.log("   → /api/company");
  console.log("   → /api/users");
  console.log("   → /api/jobs");
});
