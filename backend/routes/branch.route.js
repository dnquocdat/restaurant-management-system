import { Router } from "express";

import verifyToken from "../middlewares/verify-token.js";
import verifyAdmin from "../middlewares/verify-admin.js";

import asyncErrorHandler from "../utils/asyncErrorHandler.js";

import {
    createBranch,
    updateBranch,getContract,
    searchBranchesController,
    getBranch
} from "../controllers/branch.controller.js";

const router = Router();

// Create Branch endpoint with middleware
router.post("/", verifyToken, asyncErrorHandler(verifyAdmin), asyncErrorHandler(createBranch));

// Update Branch endpoint with middleware
router.patch("/:branchId", verifyToken, asyncErrorHandler(updateBranch));

// Add Search Branches endpoint with middleware
router.get('/search', verifyToken, asyncErrorHandler(searchBranchesController));

// Get Branches's name
router.get("/", verifyToken, asyncErrorHandler(getBranch));

router.get('/:branchId', verifyToken, asyncErrorHandler(getContract));

export default router;
