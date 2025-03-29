import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    console.log("Healthcheck route hit");
    console.log("req.ip: ", req.ip);
    res.json({ status: "ok" });
});

export default router;