import express from "express";
import { body, validationResult } from "express-validator";
import Order from "../models/Order.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validaciones para crear orden
const orderValidation = [
    body("productos")
        .isArray({ min: 1 })
        .withMessage("Debe haber al menos un producto"),
    body("productos.*.id")
        .notEmpty()
        .withMessage("El ID del producto es requerido"),
    body("productos.*.nombre")
        .trim()
        .notEmpty()
        .withMessage("El nombre del producto es requerido"),
    body("productos.*.precio")
        .custom((value) => {
            const num = Number(value);
            return !isNaN(num) && num >= 0;
        })
        .withMessage("El precio debe ser un número mayor o igual a 0"),
    body("productos.*.cantidad")
        .custom((value) => {
            const num = Number(value);
            return !isNaN(num) && Number.isInteger(num) && num >= 1;
        })
        .withMessage("La cantidad debe ser un número entero mayor a 0"),
    body("total")
        .custom((value) => {
            const num = Number(value);
            return !isNaN(num) && num >= 0;
        })
        .withMessage("El total debe ser un número mayor o igual a 0"),
];

// POST /api/orders - Crear una orden (requiere autenticación)
router.post("/", authenticateToken, orderValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: errors.array(),
            });
        }

        const { productos, total } = req.body;

        // Crear la orden con el ID del usuario autenticado
        const order = new Order({
            usuario: req.user._id,
            productos,
            total,
            fecha: new Date(),
        });

        await order.save();

        // Poblar los datos del usuario en la respuesta
        await order.populate("usuario", "email nombre apellido");

        res.status(201).json({
            success: true,
            message: "Orden creada exitosamente",
            data: order,
        });
    } catch (error) {
        console.error("Error al crear orden:", error);
        console.error("Error details:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
        });
        res.status(500).json({
            success: false,
            message: "Error al crear orden",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Error interno del servidor",
        });
    }
});

// GET /api/orders - Obtener todas las órdenes del usuario autenticado
router.get("/", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ usuario: req.user._id })
            .sort({ createdAt: -1 })
            .populate("usuario", "email nombre apellido");

        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener órdenes",
            error: error.message,
        });
    }
});

// GET /api/orders/:id - Obtener una orden específica del usuario
router.get("/:id", authenticateToken, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            usuario: req.user._id,
        }).populate("usuario", "email nombre apellido");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Orden no encontrada",
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("Error al obtener orden:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener orden",
            error: error.message,
        });
    }
});

export default router;
