'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

import Logo from '@/assets/logo/logo.png';
import { useAuth } from "@/contexts/auth.context";

export default function LogoutPage() {
    const { logout } = useAuth();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        void logout().then((result) => {
            if (!cancelled && !result.success) {
                setErrorMessage(result.message);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [logout]);

    const retryLogout = async () => {
        setLoading(true);
        setErrorMessage("");
        const result = await logout();
        if (!result.success) {
            setErrorMessage(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen text-2xl font-bold flex-col">
            <Image src={Logo} alt="Logo" width={250} height={250} />
            {loading ? <p>Fazendo logout, aguarde...</p> : null}
            {errorMessage ? (
                <div className="text-center" role="alert">
                    <p>{errorMessage}</p>
                    <button
                        type="button"
                        onClick={() => void retryLogout()}
                        className="mt-4 rounded bg-green-700 px-4 py-2 text-base text-white"
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : null}
        </div>
    );
}
