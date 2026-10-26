const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());

let latestData = {
    conc: "",
    temp: "",
    humid: "",
    readingStatus: "waiting"
};

// Track last received data time
let lastReceived = 0;

// Receive data from ESP32
app.post("/data", (req, res) => {

    latestData = {
        conc: req.body.conc,
        temp: req.body.temp,
        humid: req.body.humid,
        readingStatus: req.body.readingStatus || "live"
    };

    lastReceived = Date.now();

    console.log("Received:", latestData);

    res.json({
        success: true
    });
});

// Return latest data to dashboard
app.get("/latest", (req, res) => {

    const timeout = Date.now() - lastReceived;

    // No data received for more than 5 seconds
    if (timeout > 5000) {
        return res.json({
            conc: 0,
            temp: 0,
            humid: 0,
            readingStatus: "connection error"
        });
    }

    res.json(latestData);
});

// Serve dashboard
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});