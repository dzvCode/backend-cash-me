const otpTemplateES = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Código de verificación</title>
</head>
<body>
  <h1>Código de verificación</h1>
  <p>Hola,</p>
  <p>Tu código de verificación es: {{otpCode}}</p>
  <p>Por favor, utiliza este código para completar tu proceso de verificación.</p>
  <p>Gracias,</p>
  <p>Equipo de verificación</p>
</body>
</html>
`;

const otpTemplateEN = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verification Code</title>
</head>
<body>
  <h1>Verification Code</h1>
  <p>Hello,</p>
  <p>Your verification code is: {{otpCode}}</p>
  <p>Please use this code to complete your verification process.</p>
  <p>Thank you,</p>
  <p>Verification Team</p>
</body>
</html>
`;

const otpTemplate = {
  es: otpTemplateES,
  en: otpTemplateEN,
};

export const getOtpTemplate = (language: string): string => {
  return otpTemplate[language];
};