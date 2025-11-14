import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware para verificar el token JWT
export const authenticateToken = async (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token de acceso requerido",
            });
        }

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar el usuario en la base de datos
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        // Agregar el usuario al objeto request para usarlo en las rutas
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expirado. Por favor, inicia sesión nuevamente",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Token inválido",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error al verificar el token",
            error: error.message,
        });
    }
};

// Función helper para generar token JWT
export const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
};
