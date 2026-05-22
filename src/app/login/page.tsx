'use client';

import { useAuth } from "@/contexts/auth.context";

export default function LoginPage() {

    const { signIn, user } = useAuth();

    return (
        <div>
            Login Page Aqui <br /><br />
            
            <button 
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            onClick={() => signIn({email: 'admin@admin.com', password: 'admin1234'})}>Fazer Login Admin</button>
        </div>
    );
}