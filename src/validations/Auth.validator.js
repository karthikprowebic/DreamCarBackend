const { z } = require('zod');

const loginSchema = z.object({
  email: z.string({required_error:"This email field is required"})
    .email('Email must be a valid email address') // Validates email format
    .min(1, 'Email is required'), // Checks if the email is provided
  password: z.string({required_error:"This field is required"})
    .min(6, 'Password must be at least 6 characters long') // Password should be at least 6 characters
    .max(100, 'Password cannot exceed 100 characters'), // Limit to avoid overly large inputs
    
});

const registerSchema = z.object({
  name: z.string({required_error:"This name field is required"})
    .min(1, 'Name is required') // Checks if name is provided
    .max(50, 'Name cannot exceed 50 characters'), // Limits the length of the name
  email: z.string({required_error:"This field is required"})
    .email('Email must be a valid email address') // Email format validation
    .min(1, 'Email is required'), // Ensures the email is provided
  password: z.string({required_error:"This password field is required"})
    .min(6, 'Password must be at least 6 characters long') // Minimum password length
    .max(100, 'Password cannot exceed 100 characters'), // Maximum password length   
  password_confirmation: z.string({required_error:"This password_confirmation field is required"})
    .min(6, 'Confirm password must be at least 6 characters long') ,
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match", // Custom validation to ensure passwords match
  path: ['password_confirmation'],
});

const changePasswordSchema = z.object({
  oldPassword: z.string({required_error:"This oldPassword field is required"})
    .min(6, 'Old password must be at least 6 characters long'), // Validates the old password
  
  newPassword: z.string({required_error:"This newPassword field is required"})
    .min(6, 'New password must be at least 6 characters long') // Validates the new password
    .max(100, 'New password cannot exceed 100 characters'), // Limits the new password length
  confirmNewPassword: z.string({required_error:"This confirmNewPassword field is required"})
    .min(6, 'Confirm new password must be at least 6 characters long') // Validates the confirmation password
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match", // Custom validation to ensure new passwords match
  path: ['confirmNewPassword'],
});

module.exports = {
  loginSchema,
  registerSchema,
  changePasswordSchema,
};
