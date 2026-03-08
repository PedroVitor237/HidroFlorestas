'use client';

import { useAuth } from "@/contexts/auth.context";
import { useEffect } from "react";

export default function LayoutPrivate({ children }: { children: React.ReactNode }) {

    const { fetchUserData } = useAuth()

    useEffect(() => {
        fetchUserData();
    }, [])

    return children
}