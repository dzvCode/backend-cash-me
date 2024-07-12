// create mail sender method using nodemailer
import { InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';

export const mailSender = async (email: string, otp: number, language : string = 'es') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  
  let subject = 'Cash Me OTP Verification';
  
  
  let text = `
    Dear User,

    Thank you for choosing Cash Me! To proceed with your transaction, please use the following One-Time Password (OTP) to verify your identity:

    OTP Code: ${otp}

    Please note that this OTP is valid for the next 10 minutes. Do not share this code with anyone. If you did not request this OTP, please contact our support team immediately.

    Thank you for your cooperation.

    Best regards,
    The Cash Me Team

    Need help? Contact us at $ {senderEmail}
  `;

  if (language === 'es') {
    // Spanish
    subject = 'Verificación de OTP de Cash Me';
    text = `
      Estimado usuario,

      ¡Gracias por elegir Cash Me! Para proceder con su transacción, utilice el siguiente código de contraseña única (OTP) para verificar su identidad:

      Código OTP: ${otp}

      Tenga en cuenta que este OTP es válido durante los próximos 10 minutos. No comparta este código con nadie. Si no solicitó este OTP, comuníquese con nuestro equipo de soporte de inmediato.

      Gracias por su cooperación.

      Saludos cordiales,
      El equipo de Cash Me

      ¿Necesita ayuda? Contáctenos en $ {senderEmail}
    `;
  }
  const mailOptions = {
    from: 'cashme.g6@gmail.com',
    to: email,
    subject: subject,
    text: text,
  };

  try {
    const response = await transporter.sendMail(mailOptions);
    return response;
  } catch (error) {
    throw new InternalServerErrorException('Failed to send OTP');
  }
}