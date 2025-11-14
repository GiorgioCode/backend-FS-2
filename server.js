import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear aplicación Express
const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging (solo en desarrollo)
if (process.env.NODE_ENV === "development") {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Ruta de salud del servidor
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Servidor funcionando correctamente",
        timestamp: new Date().toISOString(),
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Ruta no encontrada",
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Error interno del servidor",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV || "development"}`);
});
