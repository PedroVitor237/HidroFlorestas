import type { Metadata } from "next";
import { EmailVerificationForm } from "@/components/account/email-verification-form";

export const metadata: Metadata = { title: "Confirmar e-mail | HidroFlorestas", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function VerifyEmailPage() { return <EmailVerificationForm />; }
