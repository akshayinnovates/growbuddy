const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Load API key from .env file

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.PERENUAL_API_KEY;

if (!API_KEY) {
    console.error("❌ ERROR: API Key is missing. Please check your .env file.");
    process.exit(1);
}

const path = require("path");

// 🔥 Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// ✅ Home route serves your index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


// ✅ Route to get a list of plants
app.get("/plants", async (req, res) => {
    try {
        console.log("Fetching plant data from Perenual API...");

        // 🔥 FIXED: Correct API URL with `/v1/`
        const response = await axios.get(`https://perenual.com/api/v1/species-list?key=${API_KEY}`);

        console.log("✅ API Response Status:", response.status);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error fetching plants:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch plant data" });
    }
});

// ✅ Route to search for a plant by name
app.get("/search_plant", async (req, res) => {
    const plantName = req.query.q;
    if (!plantName) {
        return res.status(400).json({ error: "Plant name is required" });
    }

    try {
        console.log(`Searching for plant: ${plantName}`);

        // 🔥 FIXED: Correct API URL with `/v1/`
        const response = await axios.get(`https://perenual.com/api/v1/species-list?key=${API_KEY}&q=${plantName}`);

        console.log("✅ API Response Status:", response.status);
        res.json(response.data);
    } catch (error) {
        console.error("❌ Error searching for plant:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch plant data" });
    }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
