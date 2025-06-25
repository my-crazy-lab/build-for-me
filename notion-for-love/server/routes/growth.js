const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Growth routes - coming soon' }));
module.exports = router;
