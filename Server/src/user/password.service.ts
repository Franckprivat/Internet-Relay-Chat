import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
    private readonly saltOrRounds = 10;

    /**
     * Hache un mot de passe avec bcrypt.
     * @param password Le mot de passe en clair à hasher.
     * @returns Le mot de passe hashé.
     */
    async hashPassword(password: string): Promise<string> {
        if (!password || typeof password !== 'string' || password.trim().length === 0) {
            throw new Error('Password must be a non-empty string');
        }

        try {
            const hashedPassword = await bcrypt.hash(password, this.saltOrRounds);
            console.log('Password hashed successfully:', hashedPassword);
            return hashedPassword;
        } catch (error) {
            console.error('Error while hashing password:', error);
            throw new Error('Failed to hash password');
        }
    }

    /**
     * Compare un mot de passe en clair avec un mot de passe hashé.
     * @param password Le mot de passe en clair.
     * @param hashedPassword Le mot de passe hashé.
     * @returns `true` si les mots de passe correspondent, sinon `false`.
     */
    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        if (!password || !hashedPassword) {
            throw new Error('Password and hashed password must be provided');
        }

        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            console.error('Error while comparing passwords:', error);
            throw new Error('Failed to compare passwords');
        }
    }
}
