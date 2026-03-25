import  * as express from 'express';
import { TableCreationController } from '../controller/TableCreationController';
import { UserController } from '../controller/UserController';
const router = express.Router();

router.post('/table/creation', TableCreationController.tableCreation);

router.post('/user/signup', UserController.signup);

// Signin endpoints separated by role
router.post('/user/staff/signin', UserController.staffSignin);
router.post('/user/candidate/signin', UserController.candidateSignin);

// Forgot OTP (generate new OTP for staff/company verification)
router.post('/user/forgot-otp', UserController.forgotOtp);

// Forgot password OTP (generate new OTP for forgot-password flow)
router.post('/user/forgot-password-otp', UserController.forgotPasswordOtp);

// Validate OTP for forgot-password flow
router.post('/user/validate-forgot-password-otp', UserController.validateForgotPasswordOtp);

// Change password after OTP validation
router.post('/user/change-forgot-password', UserController.changeForgotPassword);

export default router;