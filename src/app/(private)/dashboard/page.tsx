'use client';
import { useAuth } from "@/contexts/auth.context";

export default function DashBoard() {
    const { user } = useAuth();
    return <span>{user?.email}</span>
}