import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/account/password-reset-form";

export const metadata: Metadata = { title: "Redefinir senha | HidroFlorestas", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function ResetPasswordPage() { return <PasswordResetForm />; }
