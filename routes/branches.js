const express = require('express');

const { getBranchs, createBranch, deleteBranch, editBranch } = require('../controllers/branch');

const router = express.Router();

router.route('/')
    .get(getBranchs)
    .post(createBranch)

router.route('/:id')
    .delete(deleteBranch)
    .put(editBranch)

module.exports = router;