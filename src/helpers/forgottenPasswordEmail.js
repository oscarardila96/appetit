import transporter from "./mailer.js";

const emailNewPassword = async (data) => {

    const { email, name, token } = data;

    const info = await transporter.sendMail({
        from: '"Red Social Comida"<correo@redsocialcomida.com',
        to: `${email}`,
        subject: "Restablece tu contraseña en Red Social Comida",
        text: "Restablece tu contraseña en Red Social Comida",
        html: `<p> Hola ${name}, has solicitado restablecer tu contraseña en Red Social Comida. </p>
        <p> Accede al siguiente enlace para generar una nueva contraseña.
        <a href="${process.env.BACKEND_URL}/api/user/forgotten-password/${token}">Restablecer contraseña</a> </p>
        <p> Si no solicitaste restablecer tu contraseña, ignora este mensaje.</p>
        `
    });
    console.log("Mensaje enviado: %s", info.messageId)
};

export default emailNewPassword;