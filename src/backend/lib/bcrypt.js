import bcrypt from 'bcryptjs';
export const hashPassword = (pass) => bcrypt.hashSync(pass, 10);
export const comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);