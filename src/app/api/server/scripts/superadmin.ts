import 'dotenv/config'
import bcrypt from 'bcrypt';
import { prisma } from "../lib/prisma";
import readline from 'readline';

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
        const email: string = await input('> Informe seu email: ');

        terminalHeader();
        const password: string = await input('> Crie uma senha de 8 dígitos: ');

        if (password.length < 8) {
            console.clear();
            console.log('Sua senha não teve 8 dígitos!\nRegistro Encerrado.');
            return;
        }

        terminalHeader();
        const rootPass = await input('> Para finalizar, informe a chave root: ')
        if (rootPass !== ROOT_PASS) {
            terminalHeader();
            console.log('\nSenha Root inválida!')
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                isAdmin: true,
                password: hashedPassword,
                status: 'ACTIVE',
            }
        });

        console.log('Super-admin criado com sucesso!');
    } catch (error) {
        console.log('Ocorreu um erro inesperado ao tentar criar o super-admin.');
        console.error(error);
    }
}

createSuperAdmin();
