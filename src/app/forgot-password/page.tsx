import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/account/forgot-password-form";

export const metadata: Metadata = { title: "Recuperar senha | HidroFlorestas", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function ForgotPasswordPage() { return <ForgotPasswordForm />; }
