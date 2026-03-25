import { User } from '../model/User';
import bcrypt from "bcrypt";
import * as crypto from 'crypto';
import { Token } from '../model/Token';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import { LoginAudit } from '../model/LoginAudit';
import { Company } from '../model/Company';
import { CompanyService } from '../service/CompanyService';
import { RoleService } from '../service/RoleService';
import { StaffDetails } from '../model/StaffDetails';
import { env } from '../env';
import { UserService } from '../service/UserService';
import { StaffService } from '../service/StaffService';
import { EducationService } from '../service/EducationService';
import { Education } from '../model/Education';
import { ExperienceService } from '../service/ExperienceService';
import { Experience } from '../model/Experience';
import { DbConnection } from '../common/DBConfig';

export class UserController {
    static async signup(request: Request, response: Response) {
        try {
            const { role, companyData, staffData, canidateData, experience, education } = request.body;
            if (role !== env.role.candidate && role !== env.role.staff) {
                return response.status(400).send({
                    status: 0,
                    message: 'Please choose the role.',
                });
            }
            const roleId = await RoleService.findOne({
                select: ['id'],
                where: {
                    roleSlug: role,
                },
            });
            if (!roleId) {
                return response.status(404).send({
                    status: 0,
                    message: 'Invalid Role.',
                });
            }
            if (role === env.role.staff) {
                if (!staffData) {
                    return response.status(400).send({
                        status: 0,
                        message: 'Please fill the fields',
                    });
                }
                if (!companyData) {
                    return response.status(400).send({
                        status: 0,
                        message: 'Please fill the company details',
                    });
                }
                const where = {
                    shortName: getShortName(companyData.companyName),
                };
                const company = await CompanyService.findOne({ where });
                let companyId;
                if (company) {
                    companyId = company.id;
                } else {
                    const company = new Company();
                    company.companyName = companyData.companyName;
                    company.shortName = getShortName(companyData.companyName);
                    company.email = companyData.companyEmail;
                    company.address = companyData.address;
                    company.linkdin = companyData.linkdIn;
                    company.website = companyData.website;
                    company.location = companyData.location;
                    company.industryType = companyData.industryType;
                    company.isActive = 0;
                    company.logo = companyData.logo;
                    const companyCreation = await CompanyService.create(company);
                    if (!companyCreation) {
                        return response.status(400).send({
                            status: 0,
                            message: 'Company creation failed. Please try again.',
                        })
                    }
                    companyId = companyCreation.id;
                }

                const staffUser = new User();
                staffUser.userName = staffData.name;
                staffUser.emailId = staffData.emailId;
                staffUser.password = await bcrypt.hash(staffData.password, 10);
                staffUser.phoneNumber = staffData.phoneNumber;
                staffUser.roleId = roleId.id;
                staffUser.companyId = companyId;
                staffUser.address = staffData.address;
                staffUser.dateOfBirth = staffData.dateOfBirth;
                staffUser.type = '';
                staffUser.isActive = 0;
                const userCreation = await UserService.create(staffUser);
                if (!userCreation) {
                    return response.status(400).send({
                        status: 0,
                        message: 'User creation failed. Please try again.',
                    })
                }

                const staffDataExist = await StaffService.findOne({
                    where: {
                        staffId: userCreation.id,
                    },
                });

                if (staffDataExist) {
                    return response.status(404).send({
                        status: 0,
                        message: 'Staff data already exist..',
                    });
                }

                const staff = new StaffDetails();
                staff.staffId = userCreation.id;
                staff.degination = staffData.desgination;
                staff.experience = staffData.experience;
                staff.officeNumber = staffData.officeNumber;
                await StaffService.create(staff);

                return response.status(200).send({
                    status: 1,
                    message: 'Company registered successfully. Awaiting admin approval.',
                });

            } else {
                const user = new User();
                user.userName = canidateData.name;
                user.emailId = canidateData.emailId;
                user.password = await bcrypt.hash(canidateData.password, 10);
                user.phoneNumber = canidateData.phoneNumber;
                user.dateOfBirth = canidateData.dateOfBirth;
                user.isActive = 1;
                user.filePath = canidateData.filePath;
                user.roleId = roleId.id;
                user.fileName = canidateData.filename;
                user.type = canidateData.type;
                const userCreation = await UserService.create(user);
                if (!userCreation) {
                    return response.status(400).send({
                        status: 0,
                        message: 'User creation failed. Please try again.',
                    })
                }
                let isComplete: number = 1;
                if (education && education?.length) {
                    const educationExist = await EducationService.findOne({
                        select: ['id'],
                        where: {
                            userId: userCreation.id,
                        },
                    });
                    if (educationExist) {
                        return response.status(400).send({
                            status: 0,
                            message: 'Education data already exists.',
                        });
                    }
                    const educationArr = [];
                    for (const edu of education) {
                        const education1 = new Education();
                        education1.collegeName = edu.collegeName;
                        education1.startDate = edu.startDate;
                        education1.endDate = edu.endDate;
                        education1.score = edu.score;
                        education1.course = edu.course;
                        education1.createdBy = userCreation.id;
                        education1.userId = userCreation.id;
                        educationArr.push(education1);
                    }
                    await EducationService.create(educationArr);
                    isComplete++;
                }

                if (canidateData.type !== 'Fresher' && (experience && experience?.length)) {
                    const experienceExist = await ExperienceService.findOne({
                        select: ['id'],
                        where: {
                            userId: userCreation.id,
                        },
                    });
                    if (experienceExist) {
                        return response.status(400).send({
                            status: 0,
                            message: 'Experience data already exists.',
                        });
                    }
                    const experienceArr = [];
                    for (const exp of experience) {
                        const experience1 = new Experience();
                        experience1.companyName = exp.companyName;
                        experience1.role = exp.role;
                        experience1.startDate = exp.startDate;
                        experience1.endDate = exp.endDate;
                        experience1.userId = userCreation.id;
                        experience1.createdBy = userCreation.id;
                        experienceArr.push(experience1);
                    }
                    await ExperienceService.create(experienceArr);
                    isComplete++;
                }
                const toast = (isComplete === 1 && canidateData.type === 'Fresher')
                    ? 'Please complete your education details.'
                    : (isComplete === 1 && canidateData.type !== 'Fresher')
                        ? 'Please complete your education and experience details.'
                        : (isComplete === 2 && canidateData.type !== 'Fresher')
                            ? 'Please complete your experience details.'
                            : '';
                return response.status(200).send({
                    status: 1,
                    message: `User registration successful. ${toast}`,
                });
            }
        } catch (err) {
            console.log ('Signup Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Something went wrong. Please try again.',
            });
        }

    }

    static async staffSignin(request: Request, response: Response) {
        try {
            const { emailId, password } = request.body;

            if (!emailId || !password) {
                return response.status(400).send({
                    status: 0,
                    message: 'Email and password are required.',
                });
            }

            const user = await UserService.findOne({ emailId });

            if (!user) {
                return response.status(401).send({
                    status: 0,
                    message: 'Invalid email or password.',
                });
            }

            const staffDetailsExist = await StaffService.findOne({
                where: { staffId: user.id },
            });

            if (!staffDetailsExist) {
                return response.status(404).send({
                    status: 0,
                    message: 'Staff details not found for this account.',
                });
            }

            const role = await RoleService.findOne({
                select: ['id', 'roleSlug'],
                where: { id: user.roleId },
            });

            if (!role || role.roleSlug !== env.role.staff) {
                return response.status(403).send({
                    status: 0,
                    message: 'This account is not a staff account.',
                });
            }

            if (user.isActive !== 1) {
                return response.status(403).send({
                    status: 0,
                    message: 'Your account is awaiting admin approval.',
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return response.status(401).send({
                    status: 0,
                    message: 'Invalid email or password.',
                });
            }

            const tokenString = crypto.randomBytes(32).toString('hex');

            const tokenRecord = new Token();
            tokenRecord.token = tokenString;
            tokenRecord.userId = user.id;
            await DbConnection.getRepository(Token).save(tokenRecord);

            const auditRecord = new LoginAudit();
            auditRecord.userId = user.id;
            auditRecord.loginTime = new Date();
            // auditRecord.logoutTime = null as any;
            await DbConnection.getRepository(LoginAudit).save(auditRecord);

            return response.status(200).send({
                status: 1,
                message: 'Staff login successful.',
                token: tokenString,
                userId: user.id,
            });
        } catch (err) {
            console.log('Staff Signin Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Something went wrong. Please try again.',
            });
        }
    }

    static async candidateSignin(request: Request, response: Response) {
        try {
            const { emailId, password } = request.body;

            if (!emailId || !password) {
                return response.status(400).send({
                    status: 0,
                    message: 'Email and password are required.',
                });
            }

            const user = await UserService.findOne({ emailId });

            if (!user) {
                return response.status(401).send({
                    status: 0,
                    message: 'Invalid email or password.',
                });
            }

            const role = await RoleService.findOne({
                select: ['id', 'roleSlug'],
                where: { id: user.roleId },
            });

            if (!role || role.roleSlug !== env.role.candidate) {
                return response.status(403).send({
                    status: 0,
                    message: 'This account is not a candidate account.',
                });
            }

            if (user.isActive !== 1) {
                return response.status(403).send({
                    status: 0,
                    message: 'Your account is not active.',
                });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return response.status(401).send({
                    status: 0,
                    message: 'Invalid email or password.',
                });
            }

            const tokenString = crypto.randomBytes(32).toString('hex');

            const tokenRecord = new Token();
            tokenRecord.token = tokenString;
            tokenRecord.userId = user.id;
            await DbConnection.getRepository(Token).save(tokenRecord);

            const auditRecord = new LoginAudit();
            auditRecord.userId = user.id;
            auditRecord.loginTime = new Date();
            await DbConnection.getRepository(LoginAudit).save(auditRecord);

            return response.status(200).send({
                status: 1,
                message: 'Candidate login successful.',
                token: tokenString,
                userId: user.id,
            });
        } catch (err) {
            console.log('Candidate Signin Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Something went wrong. Please try again.',
            });
        }
    }

    static async forgotPasswordOtp(request: Request, response: Response) {
        try {
            const { emailId } = request.body as any;

            if (!emailId) {
                return response.status(400).send({
                    status: 0,
                    message: 'Please provide `emailId`.',
                });
            }

            const user = await UserService.findOne({ emailId });

            if (!user) {
                return response.status(401).send({
                    status: 0,
                    message: 'Invalid emailId.',
                });
            }

            // 6-digit OTP and 10 minutes
            const otp = String(crypto.randomInt(100000, 999999));
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

            await UserService.create(user);

            if (!env.mail.smtpHost || !env.mail.smtpPort || !env.mail.smtpUser || !env.mail.smtpPass || !env.mail.mailFrom) {
                return response.status(500).send({
                    status: 0,
                    message: 'Email service is not configured. Please set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/MAIL_FROM.',
                });
            }

            const transporter = nodemailer.createTransport({
                host: env.mail.smtpHost,
                port: env.mail.smtpPort,
                secure: env.mail.smtpPort === 465,
                auth: {
                    user: env.mail.smtpUser,
                    pass: env.mail.smtpPass,
                },
            });

            await transporter.sendMail({
                from: env.mail.mailFrom,
                to: emailId,
                subject: 'Forgot Password OTP',
                text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
            });

            return response.status(200).send({
                status: 1,
                message: 'OTP sent to your email successfully.',
            });
        } catch (err) {
            console.log('Forgot Password OTP Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Something went wrong. Please try again.',
            });
        }
    }

    static async validateForgotPasswordOtp(request: Request, response: Response) {
        try {
            const { emailId, otp } = request.body as any;

            if (!emailId || !otp) {
                return response.status(400).send({
                    status: 0,
                    message: 'Please provide `emailId` and `otp`.',
                });
            }

            const user = await UserService.findOne({ emailId });

            if (!user || !user.otp || !user.otpExpiry) {
                return response.status(400).send({
                    status: 0,
                    message: 'OTP not found or already used.',
                });
            }

            const now = new Date();
            if (now > user.otpExpiry) {
                return response.status(400).send({
                    status: 0,
                    message: 'OTP expired. Please request a new OTP.',
                });
            }

            if (String(user.otp) !== String(otp)) {
                return response.status(400).send({
                    status: 0,
                    message: 'Invalid OTP.',
                });
            }

            user.otp = null as any;
            user.otpExpiry = null as any;
            await UserService.create(user);

            return response.status(200).send({
                status: 1,
                message: 'OTP validated successfully.',
            });
        } catch (err) {
            console.log('Validate OTP Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Something went wrong. Please try again.',
            });
        }
    }

    static async changeForgotPassword(request: Request, response: Response) {
        try {
            const { emailId, newPassword } = request.body as any;

            if (!emailId || !newPassword) {
                return response.status(400).send({
                    status: 0,
                    message: 'Please provide `emailId` and `newPassword`.',
                });
            }

            const user = await UserService.findOne({ emailId });
            if (!user) {
                return response.status(401).send({
                    status: 0,
                    message: 'Invalid emailId.',
                });
            }

            if (user.otp || user.otpExpiry) {
                return response.status(400).send({
                    status: 0,
                    message: 'OTP not validated yet. Please validate OTP first.',
                });
            }

            user.password = await bcrypt.hash(newPassword, 10);
            user.otp = null as any;
            user.otpExpiry = null as any;
            await UserService.create(user);

            return response.status(200).send({
                status: 1,
                message: 'Password changed successfully.',
            });
        } catch (err) {
            console.log('Change Password Error: ', err);
            return response.status(500).send({
                status: 0,
                message: 'Something went wrong. Please try again.',
            });
        }
    }
}

function getShortName(name: string) {
    return name.trim().split(/\s+/).map(word => word[0]).join('').toUpperCase();
}
