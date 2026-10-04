import 'dotenv/config'
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma";
import readline from 'readline';
import { normalizeEmail, validateNewPassword } from '../accounts/contracts';

function input(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

const terminalHeader = (): void => {
    console.clear();
    console.log('------------------------------------------');
    console.log('Painel Rooot Administrativo');
    console.log('------------------------------------------\n\n');
}

async function createSuperAdmin(): Promise<void> {

    const ROOT_PASS = process.env.ROOT_PASSWORD as string;
   
    try {
        terminalHeader();
        const firstName: string = await input('> Informe seu primeiro nome: ');
        const lastName: string = await input('> Informe seu sobrenome: ');

        terminalHeader();
        const address = normalizeEmail(await input('> Informe seu email: '));

        terminalHeader();
        const password: string = await input('> Crie uma senha de pelo menos 15 caracteres (máximo 72 bytes UTF-8): ');
        validateNewPassword(password);

        terminalHeader();
        const rootPass = await input('> Para finalizar, informe a chave root: ')
        if (rootPass !== ROOT_PASS) {
            terminalHeader();
            console.log('\nSenha Root inválida!')
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email: address.factual,
                emailCanonical: address.canonical,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE',
            }
        });

        console.log('Super-admin criado com sucesso!');
    } catch {
        console.log('Ocorreu um erro inesperado ao tentar criar o super-admin.');
    }
}

createSuperAdmin();
