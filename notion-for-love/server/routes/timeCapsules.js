const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Time Capsules routes - coming soon' }));
module.exports = router;
