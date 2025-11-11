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
                /[a-z0-9]+@[a-z0-9]+\.[a-z0-9]+/,
                "Por favor ingrese un email valido",
            ],
        },
        password: {
            type: String,
            required: [true, "La contraseña es requerida"],
            minlength: [6, "La constraseña debe tener al menos 6 caracteres"],
            select: false,
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
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};
const User = mongoose.model("User", userSchema);
export default User;
