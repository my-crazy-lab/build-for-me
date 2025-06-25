const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Search routes - coming soon' }));
module.exports = router;
