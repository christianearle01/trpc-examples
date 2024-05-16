import Bcrypt from 'bcryptjs';

class GlobalHelper{
    /* Use bcrypt to encrypt the user's password upon registration */
    passwordEncryption = (password: string): string => {
        return Bcrypt.hashSync(password, 2);
    }
    
    /* Use bcrypt to check if the credentials entered by user are valid/existing */
    passwordIsValid = (password: string, hash_password: string): string => {
        return !Bcrypt.compareSync(password, hash_password) ? "Wrong email and password combination" : "";
    }
}

export default new GlobalHelper();