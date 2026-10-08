import type { Metadata } from "next";
import { AccountDeletionForm } from "@/components/account/account-deletion-form";
export const metadata: Metadata = { title: "Excluir minha conta | HidroFlorestas", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function DeleteAccountPage() { return <AccountDeletionForm />; }
