const express = require('express');
const router = express.Router();
const {
    createAccountManager,
    getAllAccountManagers,
    updateAccountManager,
} = require('../controllers/accountManagerController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.use(protect, superAdminOnly);

router.route('/')
    .post(createAccountManager)
    .get(getAllAccountManagers);

router.route('/:id')
    .put(updateAccountManager);

module.exports = router;