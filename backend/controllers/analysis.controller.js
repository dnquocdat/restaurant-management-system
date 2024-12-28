import CustomError from "../utils/errors.js";
import STATUS_CODE from "../utils/constants.js";
import formatResponse from "../utils/formatresponse.js";
import { getAnalysis } from "../services/analysis.service.js";

// Append the getAnalysisController
export const getAnalysisController = async (req, res) => {
  const {
    branch_id = '',
    time_type,
    month,
    year,
    quarter,
    start_year,
    end_year
  } = req.query;

  // Minimal validation: ensure time_type is present
  if (!time_type) {
    throw new CustomError(
      "BAD_REQUEST",
      "Parameter 'time_type' is required",
      STATUS_CODE.BAD_REQUEST
    );
  }

  // Call the service
  const analysisData = await getAnalysis({
    branch_id,
    time_type,
    month,
    year,
    quarter,
    start_year,
    end_year
  });

  return formatResponse(
    res,
    "Get Analysis",
    "Analysis retrieved successfully",
    STATUS_CODE.SUCCESS,
    analysisData
  );
};