import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // Opciones recomendadas para Mongoose 6+
            // Ya no son necesarias en versiones recientes, pero las dejamos por compatibilidad
        });

        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error("❌ Error al conectar con MongoDB:", error.message);
        process.exit(1);
    }
};

export default connectDB;
