const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { enviarBienvenida } = require('../utils/SeendMailer');

class UserService {

    // Obtener datos del usuario autenticado
    static async find(userId) {
        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        return user;
    }


    // Registro de cliente
    static async register({ name, apellido, email, password, phone, address, role }) {
        if (!["CUSTOMER", "OWNER"].includes(role)) {
            throw new Error("Role inválido");
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        const newUser = new User({
            name,
            apellido,
            email,
            passwordHash: password, // La contraseña se maneja en el modelo con pre-save
            phone,
            address,
            role,
            restaurantId: role === "OWNER" ? null : undefined // Solo se asigna si es OWNER
        });

        await newUser.save();
        await enviarBienvenida({
            to: newUser.email,
            name: newUser.name,
            role: newUser.role // CUSTOMER o OWNER
        });

        return newUser;
    }

    // Login
    static async login({ email, password }) {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Contraseña incorrecta');
        }

        const token = jwt.sign(
            { 
                userId: user._id, 
                role: user.role 
            }, 
            process.env.JWT_SECRET, 
            { 
                expiresIn: '7d' 
            }
        );
        return { token, user };
    }

    static async getUserById(userId) {
        return User.findById(userId).select('-passwordHash');
    }

    static async updateUser(userId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        Object.assign(user, updateData);
        await user.save();
        return user;
    }
}

module.exports = UserService;