// server.js

// --------------------------------------
// ENV + INSTRUMENTATION
// --------------------------------------
import "dotenv/config";
import "./config/instrument.js";

import express from "express";
import cors from "cors";
import path from "path";
import * as Sentry from "@sentry/node";

// Database + Cloudinary
import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

// Clerk (v4+)
import { clerkMiddleware, requireAuth } from "@clerk/express";

// Routes
import chatRouter from "./routes/chatRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { clerkWebhooks } from "./controllers/webhooks.js";

const app = express();

// --------------------------------------
// CORS CONFIG (MUST BE BEFORE ROUTES)
// --------------------------------------
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "http://localhost:3000", // Alternative local port

  // ✅ NEW: Render frontend domain
  "https://sourcecode-frontend.onrender.com",

  // Old Vercel frontend (keep if still used anywhere)
  "https://client-rbim26nsm-devansh-dhyanis-projects.vercel.app",
];

// Allow dynamic CLIENT_URL from env (optional)
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser tools (no origin) like Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log(`❌ CORS blocked origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight for any route
app.options("*", cors());

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(
    `✅ ${req.method} ${req.path} | Origin: ${req.headers.origin || "no-origin"}`
  );
  next();
});

// --------------------------------------
// INITIALIZE SERVICES (DB, CLOUDINARY)
// --------------------------------------
(async () => {
  try {
    await connectDB();
    await connectCloudinary();
    console.log("✅ Services initialized successfully");
  } catch (error) {
    console.error("❌ Service initialization error:", error);
  }
})();

// --------------------------------------
// BODY PARSERS
// --------------------------------------
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------------------------
// PUBLIC ROUTES (NO CLERK)
// --------------------------------------

// Root endpoint - should NOT be behind Clerk
app.get("/", (req, res) => {
  res.send("ASAP Backend running successfully 🚀");
});

// Chat AI route - public
app.use("/api", chatRouter);

// Serve resume files
app.use("/resumes", express.static(path.join(process.cwd(), "resumes")));

// Webhooks (Clerk webhooks usually use secret-based auth, not session)
app.post("/webhooks", clerkWebhooks);

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasGroqKey = !!process.env.GROQ_API_KEY;
  const hasCloudinary = !!(
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY
  );
  const hasMongoDB = !!process.env.MONGODB_URI;

  res.json({
    status: "ok",
    services: {
      groq: hasGroqKey ? "configured" : "missing",
      cloudinary: hasCloudinary ? "configured" : "missing",
      mongodb: hasMongoDB ? "configured" : "missing",
    },
    timestamp: new Date().toISOString(),
  });
});

// Sentry test route
app.get("/debug-sentry", function (req, res) {
  throw new Error("Sentry test error");
});

// --------------------------------------
// CLERK MIDDLEWARE (AFTER PUBLIC ROUTES)
// --------------------------------------

// Debug logs for env presence (won't print the keys)
if (!process.env.CLERK_PUBLISHABLE_KEY) {
  console.error("❌ CLERK_PUBLISHABLE_KEY is missing! Set it in env.");
}
if (!process.env.CLERK_SECRET_KEY) {
  console.error("❌ CLERK_SECRET_KEY is missing! Set it in env.");
}

app.use(
  clerkMiddleware({
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// --------------------------------------
// PROTECTED ROUTES (REQUIRE CLERK AUTH)
// --------------------------------------

// These routes now have authenticated Clerk context
app.use("/api/company", companyRoutes);
app.use("/api/users", requireAuth(), userRoutes);
app.use("/api/jobs", jobRoutes);

// --------------------------------------
// SENTRY ERROR HANDLER
// --------------------------------------
Sentry.setupExpressErrorHandler(app);

// --------------------------------------
// START SERVER (LOCAL ONLY)
// --------------------------------------
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n===================================`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`===================================`);
  });
}

// --------------------------------------
// EXPORT FOR VERCEL (SERVERLESS)
// --------------------------------------
export default app;
