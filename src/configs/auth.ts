// configuracao do token gerado

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1d',
  },
};
