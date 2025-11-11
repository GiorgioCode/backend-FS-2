import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            require: [true, "El nombre del producto es requerido"],
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, "La descripcion es requerida"],
            trim: true,
        },
        precio: {
            type: Number,
            required: [true, "El precio es requerido"],
            min: [0, "El precio debe ser mayor o igual a 0"],
        },
        imagen: {
            type: String,
            required: [true, "La imagen de producto es requerida"],
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
