const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new Schema({
    title: { 
        type: String,
        required: true
    },
    department: { 
        type: String,
        required: true
    },
    city: { 
        type: String,
        required: true
    },
    street: { 
        type: String,
        required: true
    },
    reference: { 
        type: String 
    },
    fullAddress: { 
        type: String,
        required: true
    },
    lat: { 
        type: Number,
        required: false
    },
    lang: { 
        type: Number,
        required: false
    },
    isDefault: { 
        type: Boolean,
        default: false
    },
}, { _id: false });

const UserSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String,
        required: true
    },
    email: { 
        type: String,   
        required: true, 
        unique: true, 
        match: /.+\@.+\..+/ 
    },
    passwordHash: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["CUSTOMER", "OWNER"], 
        default: "CUSTOMER" 
    },
    phone: { 
        type: String 
    },
    address: [AddressSchema],
    restaurantId: { 
        type: Schema.Types.ObjectId, 
        ref: "Restaurant", 
        required: false 
    }, // solo si es owner
    favorites: [{
        type: String
    }], // lista de IDs de restaurantes favoritos
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Hash de la contraseña antes de guardar
UserSchema.pre("save", async function (next) {
    if (!this.isModified("passwordHash")) return next();
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);

});

// Método para comparar contraseña en login
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};

// Actualizar updatedAt automáticamente
UserSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
  
});

module.exports = model("User", UserSchema);