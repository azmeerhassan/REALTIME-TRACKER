const express = require("express");
const path = require("path");

const app = express();

/* -------------------- BASIC MIDDLEWARE -------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* -------------------- VIEW ENGINE -------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

/* -------------------- STATIC FILES -------------------- */
app.use(express.static(path.join(process.cwd(), "public")));

/* -------------------- ROUTES -------------------- */

// Home page
app.get("/", (req, res) => {
  res.render("index", {
    title: "Realtime Tracker"
  });
});

// Example tracker update (POST)
app.post("/track", (req, res) => {
  const { latitude, longitude } = req.body;

  // For now just echo data back (Vercel-safe)
  res.json({
    status: "success",
    message: "Location received",
    data: {
      latitude,
      longitude
    }
  });
});

// Health check (important for debugging)
app.get("/health", (req, res) => {
  res.json({ status: "OK", server: "Vercel" });
});

/* -------------------- ERROR HANDLING -------------------- */
app.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found"
  });
});

/* -------------------- EXPORT (CRITICAL) -------------------- */
/*
 ❌ Do NOT use app.listen()
 Vercel invokes this as a serverless function
*/
module.exports = app;
