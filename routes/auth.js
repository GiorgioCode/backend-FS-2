import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User";

const router = express.Router();

const resgisterValidation = [
    body("email")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("La constraseña debe tener al menso 6 caracteres"),
    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 2 })
        .withMessage("El nombre debe tener al menos 2 caracteres"),
];

router.post("/register", resgisterValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "error de validacion",
                errors: errors.array(),
            });
        }

        const { email, password, nombre, apellido } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                succes: false,
                message: "El email ya se encuentra registrado",
            });
        }

        const user = new User({
            email,
            password,
            nombre,
            apellido: apellido || "",
        });
        await user.save();
        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            message: "Usuario registrado con exito",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    nombre: user.nombre,
                    apellido: user.apellido,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Error de registro: ", error);
        res.status(500).json({
            success: false,
            message: "Error al registrar el usuario",
            error: error.message,
        });
    }
});

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("La constraseña es requerida para iniciar sesion"),
];

router.post("/login", loginValidation, async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Errores de validacion",
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email }.select("+password"));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Credenciales invalidas",
            });
        }
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Credenciales invalidas",
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Login exitoso",
            data: {
                id: user._id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
            },
            token,
        });
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({
            success: false,
            message: "Error al iniciar sesion",
            error: error.message,
        });
    }
});

router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers("authorization");
        const token = authHeader && authHeader(" ")[1];

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Token invalido o no proporcionado",
            });
        }

        const jwt = await import("jsonwebtoken");
        const decoded = jwt.default.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
            },
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expirado. por favor, inicia sesion nuevamente",
            });
        }
        res.status(401).json({
            success: false,
            message: "Token invalido",
        });
    }
});

export default router;
