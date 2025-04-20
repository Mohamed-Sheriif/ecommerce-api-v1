const express = require("express");

const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateLoggedUserPassword,
  updateMe,
  getMe,
  deleteMe,
  uploadUserImage,
  resizeUserImage,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateLoggedUserValidator,
  updateUserPasswordValidator,
  deleteUserValidator,
} = require("../validators/userValidator");

const AuthService = require("../services/authService");

const router = express.Router();

router.use(AuthService.protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The ID of the user
 *           example: 1234567890abcdef12345678
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: John Doe
 *         slug:
 *           type: string
 *           description: The slug of the user
 *           example: john-doe
 *         email:
 *           type: string
 *           description: The email of the user
 *           example: user@gmail.com
 *         phone:
 *           type: string
 *           description: The phone number of the user
 *           example: 1234567890
 *         profileImage:
 *           type: string
 *           description: The profile image of the user
 *           example: user.jpg
 *         role:
 *           type: string
 *           description: The role of the user
 *           example: user
 *         active:
 *           type: boolean
 *           description: The active status of the user
 *           example: true
 *         wishlist:
 *           type: array
 *           items:
 *             type: string
 *             description: The wishlist of the user
 *             example: 1234567890abcdef12345678
 *         addresses:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *              id:
 *                type: string
 *                description: The ID of the address
 *                example: 1234567890abcdef12345678
 *              alias:
 *                type: string
 *                description: The alias of the address
 *                example: Home
 *              details:
 *                type: string
 *                description: The details of the address
 *                example: 123 Main St, Apt 4B
 *              city:
 *                type: string
 *                description: The city of the address
 *                example: New York
 *              postalCode:
 *                type: string
 *                description: The postal code of the address
 *                example: 10001
 *         createdAt:
 *           type: string
 *           description: The creation date of the user
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           description: The last update date of the user
 *           example: 2023-01-01T00:00:00.000Z
 */

// User

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the logged-in user's information
 *     tags:
 *       - Users Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */

router.get("/me", getMe, getUser);

/**
 * @swagger
 * /users/updateMyPassword:
 *   put:
 *     summary: Update the logged-in user's password
 *     tags:
 *       - Users Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The current password of the user
 *                 example: oldpassword123
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/updateMyPassword", updateLoggedUserPassword);

/**
 * @swagger
 * /users/updateMe:
 *   put:
 *     summary: Update the logged-in user's information
 *     tags:
 *       - Users Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: user@gmail.com
 *               phone:
 *                 type: string
 *                 description: The phone number of the user
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/updateMe", updateLoggedUserValidator, updateMe);

/**
 * @swagger
 * /users/deleteMe:
 *   delete:
 *     summary: Deactivate the logged-in user
 *     tags:
 *       - Users Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/deleteMe", deleteMe);

router.use(AuthService.allowedTo("admin"));

// Admin routes

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               passwordConfirm:
 *                 type: string
 *                 example: password123
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all users (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: integer
 *                   example: 10
 *                 paginationResult:
 *                   type: object
 *                   properties:
 *                     curruntPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     numberOfPages:
 *                       type: integer
 *                       example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get(getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update a user by ID (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 example: 1234567890
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *   delete:
 *     summary: Delete a user by ID (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

/**
 * @swagger
 * /users/{id}/password:
 *   put:
 *     summary: Update a user's password by ID (Admin only)
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: newpassword123
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose password is being updated
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

router.put("/:id/password", updateUserPasswordValidator, updateUserPassword);

module.exports = router;
