const nodeMailer = require('nodemailer');
require('dotenv').config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function generarHtmlBienvenida({ name, role }) {
    if (role === 'CUSTOMER') {
        return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
            <h1 style="color:#FF5722;">¡Bienvenido a OrderFood, ${name}!</h1>
            <p>Gracias por registrarte como <strong>cliente</strong>. Ahora puedes:</p>
            <ul>
                <li>Realizar pedidos rápidamente desde nuestra app.</li>
                <li>Seguir tus pedidos en tiempo real.</li>
                <li>Recibir promociones exclusivas y descuentos personalizados.</li>
            </ul>
            <p>Nos encanta tenerte con nosotros. ¡Disfruta tu experiencia!</p>
            <p style="color:#777;">Equipo OrderFood</p>
        </div>
        `;
    } else if (role === 'OWNER') {
        return `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
            <h1 style="color:#FF5722;">¡Bienvenido, ${name}!</h1>
            <p>Gracias por registrarte como <strong>propietario de restaurante</strong> en FoodExpress.</p>
            <p>Con tu cuenta podrás:</p>
            <ul>
                <li>Gestionar tu restaurante y menú de manera profesional.</li>
                <li>Recibir pedidos de clientes en tiempo real.</li>
                <li>Acceder a estadísticas y reportes de ventas.</li>
            </ul>
            <p>Estamos emocionados de ayudarte a crecer tu negocio. ¡Bienvenido a la familia OrderFood!</p>
            <p style="color:#777;">Equipo OrderFood</p>
        </div>
        `;
    }
    return '';
}

async function enviarBienvenida({ to, name, role }) {
    try {
        const mailOptions = {
            from: `"OrderFood" <${process.env.EMAIL_USER}>`,
            to,
            subject: role === 'OWNER' ? 'Bienvenido a OrderFood como propietario' : 'Bienvenido a OrderFood',
            html: generarHtmlBienvenida({ name, role })
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo de bienvenida enviado a ${to} | ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error enviando correo de bienvenida:', error);
        throw new Error('No se pudo enviar el correo de bienvenida');
    }
}

async function enviarNuevoInicioSesion({ to, name }) {
    try {
        const mailOptions = {
            from: `"OrderFood" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Nuevo inicio de sesión en tu cuenta',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
                    <h1 style="color:#FF5722;">¡Hola ${name}!</h1>
                    <p>Has iniciado sesión en tu cuenta de OrderFood.</p>
                    <p>Si no fuiste tú, por favor contacta con nuestro soporte.</p>
                    <p style="color:#777;">Equipo OrderFood</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo de nuevo inicio de sesión enviado a ${to} | ID: ${info.messageId}`);
    } catch (error) {
        console.error('Error enviando correo de nuevo inicio de sesión:', error);
        throw new Error('No se pudo enviar el correo de nuevo inicio de sesión');
    }
}

module.exports = { enviarBienvenida, enviarNuevoInicioSesion };