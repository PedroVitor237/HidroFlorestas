'use client'
import Image from "next/image";
import Logo from '@/assets/logo/logo.png'
import { useAuth } from "@/contexts/auth.context";
import { useEffect } from "react";

export default function LoginPage() {

    const { logout } = useAuth();

    useEffect(() => {
        logout();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen text-2xl font-bold flex-col">
            <Image src={Logo} alt="Logo" width={250} height={250} /> <br /> <br /> <br /> 
            Fazendo Logout, aguarde... 
        </div>
    )
}