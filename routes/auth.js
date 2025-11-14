import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

// Validaciones para registro
const registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe tener al menos 6 caracteres"),
    body("nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre es requerido")
        .isLength({ min: 2 })
        .withMessage("El nombre debe tener al menos 2 caracteres"),
];

// Validaciones para login
const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("Debe ser un email válido")
        .normalizeEmail(),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
];

// Ruta de registro
router.post("/register", registerValidation, async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: errors.array(),
            });
        }

        const { email, password, nombre, apellido } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "El email ya está registrado",
            });
        }

        // Crear nuevo usuario
        const user = new User({
            email,
            password,
            nombre,
            apellido: apellido || "",
        });

        await user.save();

        // Generar token JWT
        const token = generateToken(user._id);

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: "Usuario registrado exitosamente",
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
        console.error("Error en registro:", error);
        res.status(500).json({
            success: false,
            message: "Error al registrar usuario",
            error: error.message,
        });
    }
});

// Ruta de login
router.post("/login", loginValidation, async (req, res) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        // Buscar usuario y incluir el password (ya que está en select: false)
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas",
            });
        }

        // Verificar contraseña
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas",
            });
        }

        // Generar token JWT
        const token = generateToken(user._id);

        // Respuesta exitosa
        res.json({
            success: true,
            message: "Login exitoso",
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
        console.error("Error en login:", error);
        res.status(500).json({
            success: false,
            message: "Error al iniciar sesión",
            error: error.message,
        });
    }
});

// Ruta para verificar token (usuario autenticado)
router.get("/me", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado",
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
                user: {
                    id: user._id,
                    email: user.email,
                    nombre: user.nombre,
                    apellido: user.apellido,
                },
            },
        });
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expirado",
            });
        }

        res.status(401).json({
            success: false,
            message: "Token inválido",
        });
    }
});

export default router;
