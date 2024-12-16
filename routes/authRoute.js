const express = require("express");

const {
  signup,
  login,
  forgotPassword,
  verifypassResetCode,
  resetPassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
} = require("../validators/authValidator");

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: User Signup
 *    description: Create a new user account.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: The username of the new user
 *                example: Mohamed Sheriif
 *              email:
 *                type: string
 *                description: The email of the new user
 *                example: Mohamedsh@example.com
 *              password:
 *                type: string
 *                description: The password of the new user
 *                example: securepassword123
 *              passwordConfirm:
 *                type: string
 *                description: The password of the new user
 *                example: securepassword123
 *    responses:
 *      201:
 *        description: User created successfully
 *      400:
 *        description: Bad Request
 */
router.post("/signup", signupValidator, signup);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: User Login
 *    description: Authenticate a user and return a token.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: The email of the user
 *                example: admin@gmail.com
 *              password:
 *                type: string
 *                description: The password of the user
 *                example: 123456
 *    responses:
 *      200:
 *        description: Login successful
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: JWT token
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWYyOWM1ZTRiMGU5YzRkYzYyYjNhMCIsImlhdCI6MTY3ODAxMjAwMH0.QK1X5Ow36e42iWqFbyGyeHqRMTHMVNWaBQK7D9HTcHw
 *      401:
 *        description: Invalid credentials
 */
router.post("/login", loginValidator, login);

/**
 * @swagger
 * /forgotPassword:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Forgot Password
 *    description: Initiate a password reset process by sending a reset code.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: The email of the user requesting a reset
 *                example: johndoe@example.com
 *    responses:
 *      200:
 *        description: Reset code sent successfully
 *      400:
 *        description: Invalid email
 *      404:
 *        description: User not found
 *      500:
 *        description: Server error
 */
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);

/**
 * @swagger
 * /verifyResetCode:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Verify Reset Code
 *    description: Verify the reset code sent to the user's email.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              resetCode:
 *                type: string
 *                description: The reset code sent to the user
 *                example: 123456
 *    responses:
 *      200:
 *        description: Reset code verified successfully
 *      400:
 *        description: Invalid reset code or reset code expired
 */
router.post("/verifyResetCode", verifypassResetCode);

/**
 * @swagger
 * /resetPassword:
 *  post:
 *    tags:
 *      - Authentication
 *    summary: Reset Password
 *    description: Reset the user's password using a valid reset code.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: The email of the user
 *                example: mohamed@example.com
 *              newPassword:
 *                type: string
 *                description: The new password for the user
 *                example: newSecurePassword123
 *    responses:
 *      200:
 *        description: Password reset successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                token:
 *                  type: string
 *                  description: JWT token
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MWYyOWM1ZTRiMGU5YzRkYzYyYjNhMCIsImlhdCI6MTY3ODAxMjAwMH0.QK1X5Ow36e42iWqFbyGyeHqRMTHMVNWaBQK7D9HTcHw
 *      400:
 *        description: Invalid email
 */
router.post("/resetPassword", resetPassword);

module.exports = router;
