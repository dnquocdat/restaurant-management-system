import CustomError from "../utils/errors.js";
import STATUS_CODE from "../utils/constants.js";
import formatResponse from "../utils/formatresponse.js";

import { checkEmployeeExists } from "../services/check.service.js";

import {
  addEmployee as addEmployeeService,
  deleteEmployee as deleteEmployeeService,
  updateEmployee as updateEmployeeService,
  getEmployeeInformation as getEmployeeInformationService,
} from "../services/employee.service.js";

export const addEmployee = async (req, res, next) => {
  const {
    employee_name,
    employee_email,
    date_of_birth,
    gender,
    employee_phone_number,
    employee_address,
  } = req.body;

  // Validate required fields
  if (
    !employee_name ||
    !employee_email ||
    !date_of_birth ||
    !gender ||
    !employee_phone_number ||
    !employee_address
  ) {
    throw new CustomError(
      "BAD_REQUEST",
      "Please provide all required fields",
      STATUS_CODE.BAD_REQUEST
    );
  }

  // Add employee
  const employee = await addEmployeeService({
    employee_name,
    employee_email,
    date_of_birth,
    gender,
    employee_phone_number,
    employee_address,
  });

  // Format response
  const data = {
    employee_id: employee.employee_id,
    employee_name: employee.employee_name,
    employee_email: employee.employee_email,
    date_of_birth: employee.date_of_birth,
    gender: employee.gender,
    employee_phone_number: employee.employee_phone_number,
    employee_address: employee.employee_address,
    hire_date: employee.hire_date,
    quit_date: employee.quit_date,
  };

  return formatResponse(
    res,
    "Add Staff Information",
    "Add staff successfully",
    STATUS_CODE.CREATED,
    data
  );
};

export const deleteEmployee = async (req, res, next) => {
  let { employeeId } = req.params;

  employeeId = parseInt(employeeId, 10);

  // Check if the employee exists and has not quit
  await checkEmployeeExists(employeeId);

  await deleteEmployeeService(employeeId);

  return formatResponse(
    res,
    "Delete Employee",
    "Employee deleted successfully",
    STATUS_CODE.SUCCESS,
    null
  );
};

export const updateEmployee = async (req, res, next) => {
  let { employeeId } = req.params;
  employeeId = parseInt(employeeId, 10);

  await checkEmployeeExists(employeeId);

  const updateData = req.body;

  // Perform update
  await updateEmployeeService(employeeId, updateData);

  return formatResponse(
    res,
    "Update Employee Information",
    "Employee updated successfully",
    STATUS_CODE.SUCCESS,
    null
  );
};

export const getEmployeeInformation = async (req, res, next) => {
  let { employeeId } = req.params;
  employeeId = parseInt(employeeId, 10);

  const employee = await getEmployeeInformationService(employeeId);

  return formatResponse(
    res,
    "Get Employee Information",
    "Employee information retrieved successfully",
    STATUS_CODE.SUCCESS,
    employee
  );
};
