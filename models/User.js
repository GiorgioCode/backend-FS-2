import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "El email es requerido"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Por favor ingrese un email válido",
            ],
        },
        password: {
            type: String,
            required: [true, "La contraseña es requerida"],
            minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
            select: false, // No incluir password por defecto en las consultas
        },
        nombre: {
            type: String,
            required: [true, "El nombre es requerido"],
            trim: true,
        },
        apellido: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt automáticamente
    }
);

// Middleware pre-save para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified("password")) {
        return next();
    }

    try {
        // Generar salt y hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para eliminar campos sensibles del objeto antes de enviarlo
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
