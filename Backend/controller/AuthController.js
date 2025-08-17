require('dotenv').config({ path: '../.env' }); 
const UserModel = require('../model/user');
const bcrypt = require('bcrypt');
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Register User //
const registerUser = async (req, res) => {
    const {username, email, password} = req.body;

    // Validasi User //
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(400).json({error: error.array()})
    }

    if (!JWT_SECRET) {
        console.error("JWT_SECRET_KEY is not defined! Set it in your .env file");
        process.exit(1);
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message:
                "Password harus minimal 6 karakter, mengandung huruf besar, huruf kecil, angka, dan simbol unik",
        });
    }

    try {
        const existingUser = await UserModel.findOne({$or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username atau email sudah digunakan" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user_baru = new UserModel({
            username,
            email,
            password: hashedPassword,
        })

        await user_baru.save();

        res.status(201).json({message:"Register berhasil!"});
    } catch (error) {
        console.log("Gagal registerasi", error);
        res.status(500).json({message:"Terjadi kesalahan server!"});
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validasi input //
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password harus diisi!" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Cari user berdasarkan email //
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email atau password salah!" });
        }

        // Cek kecocokan password yang di-hash //
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Email atau password salah!" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // Sukses login //
        res.status(200).json({ 
            message: "Login sukses", 
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            } 
        });

    } catch (error) {
        console.error("Error saat login:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat login" });
    }
};

const ResetPassword = async (req, res) => {
    try {
        const { newPassword, confirmPassword, email } = req.body;
        if (!newPassword || !confirmPassword || !email) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Password tidak sama" });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password berhasil direset" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    ResetPassword
};