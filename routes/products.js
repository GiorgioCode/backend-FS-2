import express from "express";
import { body, validationResult } from "express-validator";
import Product from "../models/Product.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validaciones para crear producto
const productValidation = [
    body("nombre").trim().notEmpty().withMessage("El nombre es requerido"),
    body("descripcion")
        .trim()
        .notEmpty()
        .withMessage("La descripción es requerida"),
    body("precio")
        .isFloat({ min: 0 })
        .withMessage("El precio debe ser un número mayor o igual a 0"),
    body("imagen").trim().notEmpty().withMessage("La imagen es requerida"),
];

// GET /api/products - Obtener todos los productos (público)
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        // Convertir a formato compatible con frontend
        const formattedProducts = products.map((product) => ({
            id: product._id.toString(),
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            imagen: product.imagen,
        }));
        res.json({
            success: true,
            data: formattedProducts,
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener productos",
            error: error.message,
        });
    }
});

// GET /api/products/:id - Obtener un producto por ID (público)
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        // Formatear para compatibilidad con frontend
        const formattedProduct = {
            id: product._id.toString(),
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            imagen: product.imagen,
        };

        res.json({
            success: true,
            data: formattedProduct,
        });
    } catch (error) {
        console.error("Error al obtener producto:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener producto",
            error: error.message,
        });
    }
});

// POST /api/products - Crear un producto (requiere autenticación)
router.post("/", authenticateToken, productValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Errores de validación",
                errors: errors.array(),
            });
        }

        const { nombre, descripcion, precio, imagen } = req.body;

        const product = new Product({
            nombre,
            descripcion,
            precio,
            imagen,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            data: product,
        });
    } catch (error) {
        console.error("Error al crear producto:", error);
        res.status(500).json({
            success: false,
            message: "Error al crear producto",
            error: error.message,
        });
    }
});

export default router;
