const express = require('express');
const router = express.Router();
const UserService = require('../services/AuthService');
const authMiddleware = require('../middlewares/AuthMiddleware');

// obtbener datos del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await UserService.find(req.user.id);
        res.json(user);
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(400).json({ msg: "Error al obtener datos del usuario", error: error.message });
    }
});

// Registro de cliente
router.post('/register', async (req, res) => {
    try {
        const result = await UserService.register(req.body);
        res.json({ msg: "Usuario registrado", user: result });
    } catch (error) {
        console.error('Error en el registro del cliente:', error);
        res.status(400).json({ msg: "Error en registro", error: error.message });
    }
});


// Login
router.post('/login', async (req, res) => {
    try {
        const result = await UserService.login(req.body);
        res.json(result);
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(400).json({ msg: "Error en login", error: error.message });
    }
});

//Restaurnates favoritos del cliente
router.post('/favorites', authMiddleware, async (req, res) => {
    try {
        const { restaurantId, action } = req.body;
        const update = action === 'add'
            ? { $addToSet: { favorites: restaurantId } }
            : { $pull:     { favorites: restaurantId } };

        // findByIdAndUpdate directo, sin pasar por el pre-save del modelo
        const updated = await require('../models/UserModel').findByIdAndUpdate(
            req.user.id,
            update,
            { new: true }
        );

        if (!updated) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json({ ok: true, favorites: updated.favorites });
    } catch (error) {
        console.error('Error favoritos:', error);
        res.status(400).json({ msg: 'Error al actualizar favoritos', error: error.message });
    }
});

module.exports = router;