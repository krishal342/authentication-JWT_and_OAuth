import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

import { prisma } from '../lib/prisma.js';
import  generateToken  from '../lib/tokenGenration.js';

import config from '../config/config.js';

export const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase()
            }
        })
        if (existingUser) {
            return res.status(400).json({ success: false,message: "User already exist." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email: email.toLowerCase(),
                password: hashedPassword
            }
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
        });


    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;


        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });


        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }


        const verifyPassword = bcrypt.compare(password, user.password);

        if (!verifyPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        return res.cookie('loginToken', token).status(200).json({
            success: true,
            message: "User logged in successfully"
        });


    } catch (err) {
        next(err);
    }
}

export const logout = async (req, res, next) => {
    try {
        if (req.cookies.loginToken) {
            // jwt logout
            return res.clearCookie("loginToken").status(200).json({
                success: true,
                message: "User logged out successfully"
            });
        }
        else{
            // passport logout
            req.logout(err =>{
                if (err) return next(err);
                req.session.destroy(()=>{
                    res.status(200).json({success: true, message: "User logged out successfully"});
                });
            });
        }
        

    } catch (err) {
        next(err);
    }

}

export const sendOTP = async (req, res, next) => {
    try{
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otp = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        await prisma.otp.create({
            data:{
                userId: user.id,
                otp,
                expiresAt: otpExpiry
            }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.APP_EMAIL,
                pass: config.APP_PASSWORD
            }
        });

        const mailOptions = {
            from: config.APP_EMAIL,
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        });


    }catch(err){
        next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    try{
        const { email, otp, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const otpData = await prisma.otp.findFirst({
            where: {
                userId: user.id
            },
            orderBy: {
                expiresAt: 'desc'
            }
        });

        if(!otpData || otpData.otp !== otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where:{id: user.id},
            data: {
                password: hashedPassword
            }
        })

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    }catch(err){
        next(err);
    }
}
