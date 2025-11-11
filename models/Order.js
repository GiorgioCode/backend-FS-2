import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "El usuario es requerido"],
        },
        productos: [
            {
                id: {
                    type: mongoose.Schema.Types.Mixed,
                    required: true,
                },
                nombre: {
                    type: String,
                    required: true,
                },
                precio: {
                    type: Number,
                    required: true,
                },
                cantidad: {
                    type: Number,
                    required: true,
                    min: [1, "La cantidad minima a ordenar es 1"],
                },
            },
        ],
        total: {
            type: Number,
            required: [true, "El total es requerido"],
            min: [0, "El total debe ser mayor o igual a 0"],
        },
        fecha: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

orderSchema.index({ usuario: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
