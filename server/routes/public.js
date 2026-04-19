const express = require('express');
const router = express.Router();
const { PLAN_DATA } = require('../utils/plans');

// GET /api/public/plans
router.get('/plans', (req, res) => {
    res.json(PLAN_DATA);
});

module.exports = router;
