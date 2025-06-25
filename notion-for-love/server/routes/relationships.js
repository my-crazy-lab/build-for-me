const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Relationships routes - coming soon' }));
module.exports = router;
