import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
    {
        id: 1,
        nombre: "PlayStation 5 Slim",
        descripcion:
            "Consola Sony PlayStation 5 Slim con SSD 1TB, ray tracing, 4K gaming y retrocompatibilidad con PS4. La nueva generación del gaming",
        precio: 899999,
        imagen: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300",
    },
    {
        id: 2,
        nombre: "ASUS ROG Monitor 4K 144Hz",
        descripcion:
            "Monitor gaming ASUS ROG de 27 pulgadas 4K con 144Hz, 1ms, HDR400 y tecnología Adaptive-Sync para gaming competitivo",
        precio: 1199999,
        imagen: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300",
    },
    {
        id: 3,
        nombre: "Razer BlackWidow V4 Pro",
        descripcion:
            "Teclado mecánico gaming Razer con switches Green, iluminación RGB Chroma, reposamuñecas y teclas macro programables",
        precio: 349999,
        imagen: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300",
    },
    {
        id: 4,
        nombre: "Steam Deck OLED 1TB",
        descripcion:
            "Consola portátil Steam Deck con pantalla OLED de 7.4 pulgadas, 1TB SSD y acceso a toda la biblioteca de Steam en cualquier lugar",
        precio: 1299999,
        imagen: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=300",
    },
    {
        id: 5,
        nombre: "SteelSeries Arctis Pro Wireless",
        descripcion:
            "Auriculares gaming inalámbricos SteelSeries con DTS Headphone:X v2.0, micrófono retráctil y batería intercambiable de 20 horas",
        precio: 649999,
        imagen: "https://images.unsplash.com/photo-1599669454699-248893623440?w=300",
    },
    {
        id: 6,
        nombre: "Logitech G Pro X Superlight",
        descripcion:
            "Mouse gaming ultra liviano de 63g con sensor HERO 25K, switches mecánicos y hasta 70 horas de batería para gaming profesional",
        precio: 299999,
        imagen: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300",
    },
    {
        id: 7,
        nombre: "NVIDIA RTX 4080 SUPER",
        descripcion:
            "Tarjeta gráfica NVIDIA GeForce RTX 4080 SUPER con 16GB GDDR6X, ray tracing y DLSS 3 para gaming 4K extremo",
        precio: 2499999,
        imagen: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300",
    },
    {
        id: 8,
        nombre: "Xbox Series X",
        descripcion:
            "Consola Microsoft Xbox Series X con 1TB SSD, 4K nativo, 120fps, Quick Resume y Game Pass Ultimate incluido por 3 meses",
        precio: 849999,
        imagen: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300",
    },
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conectado a mongoDB");
        await Product.deleteMany({});
        console.log("Productos existentes eliminados");
        await Product.insertMany(products);
        console.log(
            "Productos insertados correctamente. Cantidad agregada: ",
            products.length
        );
        console.log("Conexion cerrada");
        process.exit(0);
    } catch (error) {
        console.error("error al poblar la base de datos: ", error);
        process.exit(1);
    }
};
seedProducts();
