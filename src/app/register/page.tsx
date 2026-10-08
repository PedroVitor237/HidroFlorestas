"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, User } from "lucide-react";

import LogoHF from "@/assets/logo/logo-hf.png";
import Logo from "@/assets/logo/logo.png";
import RegisterBackground from "@/assets/auth/register-background.png";

import { useAuth } from "@/contexts/auth.context";

export default function RegisterPage() {
  const { signUp } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const requestKey = useRef<string | null>(null);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim()
    ) {
      setErrorMessage("Preencha seu nome, sobrenome, e-mail e senha.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    requestKey.current ??= crypto.randomUUID();

    try {
      const result = await signUp({
        firstName,
        lastName,
        email,
        password,
      }, requestKey.current);
      if (!result.success) setErrorMessage(result.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="h-[100px] border-b border-black/10 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center px-6">
          <Image src={LogoHF} alt="HidroFlorestas" width={220} priority />
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-100px)] items-center justify-center p-6">
        <div className="flex w-full max-w-[1400px] overflow-hidden rounded-[20px] bg-white shadow-[0px_4px_18px_-3px_rgba(0,0,0,0.25)]">
          {/* Painel esquerdo */}
          <div className="relative hidden md:flex w-[55%] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#F3FAFF] to-[#F4F4F4] p-12">
            <Image
              src={RegisterBackground}
              alt="Background"
              fill
              sizes="(min-width: 768px) 55vw, 0px"
              priority
              className="object-cover object-center"
            />

            {/* Camada Translucida */}
            <div className="absolute inset-0 bg-white/75" />

            {/* Conteúdo do painel esquerdo */}
            <div className="relative z-10 flex h-full w-full flex-col items-center">
              <Image
                src={Logo}
                alt="Logo HidroFlorestas"
                width={260}
                className="mb-8"
              />

              <h2 className="text-center text-6xl font-bold">
                <span className="text-[#0084DD]">HIDRO</span>
                <span className="text-[#00B51A]">FLORESTAS</span>
              </h2>

              <p className="mt-auto pb-8 text-center text-xl text-[#3E3E3E]">
                STARTUP & INOVAÇÃO
              </p>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleRegister} onChange={event => { const target = event.target; if (target instanceof HTMLInputElement && ["firstName", "lastName", "email", "password"].includes(target.name)) { requestKey.current = null; setErrorMessage(""); } }} className="w-full md:w-[45%] bg-white p-8 md:p-12" aria-busy={loading}>
            <div className="flex justify-center">
              <Image src={LogoHF} alt="HidroFlorestas" width={200} />
            </div>

            <hr className="my-6 border-black/20" />

            <h1 className="text-center text-[25px] font-bold text-[#A1640B]">
              CRIE SUA CONTA
            </h1>

            <p className="mt-3 text-center text-[18px] text-[#3E3E3E]">
              Preencha o formulário abaixo e junte-se a nós
            </p>

            {/* Nome */}
            <div className="mt-8">
              <label htmlFor="first-name" className="mb-2 block text-[18px] font-bold text-[#A1640B]">
                Nome
              </label>

              <div className="flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 focus-within:ring-2 focus-within:ring-[#A1640B]">
                <User size={22} className="text-[#858585]" />

                <input
                  type="text"
                  id="first-name"
                  name="firstName"
                  autoComplete="given-name"
                  disabled={loading}
                  required
                  placeholder="Seu nome"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-[#858585]"
                />
              </div>
            </div>

            {/* Sobrenome */}
            <div className="mt-5">
              <label htmlFor="last-name" className="mb-2 block text-[18px] font-bold text-[#A1640B]">
                Sobrenome
              </label>

              <div className="flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 focus-within:ring-2 focus-within:ring-[#A1640B]">
                <User size={22} className="text-[#858585]" />

                <input
                  type="text"
                  id="last-name"
                  name="lastName"
                  autoComplete="family-name"
                  disabled={loading}
                  required
                  placeholder="Seu sobrenome"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-[#858585]"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-5">
              <label htmlFor="register-email" className="mb-2 block text-[18px] font-bold text-[#A1640B]">
                E-mail
              </label>

              <div className="flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 focus-within:ring-2 focus-within:ring-[#A1640B]">
                <Mail size={22} className="text-[#858585]" />

                <input
                  type="email"
                  id="register-email"
                  name="email"
                  autoComplete="email"
                  disabled={loading}
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-[#858585]"
                />
              </div>
            </div>

            {/* Senha */}
            <div className="mt-5">
              <label htmlFor="register-password" className="mb-2 block text-[18px] font-bold text-[#A1640B]">
                Senha
              </label>

              <div className="flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 focus-within:ring-2 focus-within:ring-[#A1640B]">
                <LockKeyhole size={22} className="text-[#858585]" />

                <input
                  type={showPassword ? "text" : "password"}
                  id="register-password"
                  name="password"
                  autoComplete="new-password"
                  disabled={loading}
                  required
                  aria-describedby="register-password-help"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none placeholder:text-[#858585]"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer text-[#858585]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Mostrar senha */}
            <div className="mt-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />

                <span className="text-sm text-[#858585]">Mostrar senha</span>
              </label>
            </div>

            <p id="register-password-help" className="mt-3 text-sm text-[#3E3E3E]">Use uma frase de pelo menos 15 caracteres. Sua senha será preservada como digitada.</p>
            {errorMessage ? <p role="alert" className="mt-4 text-sm text-red-700">{errorMessage}</p> : null}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-8
                w-full
                rounded-[10px]
                bg-[#00B51A]
                py-4
                text-[22px]
                font-bold
                text-white
                cursor-pointer
                hover:opacity-90
                disabled:opacity-70
                active:scale-[0.98]
              "
            >
              {loading ? "CRIANDO..." : "CRIAR CONTA"}
            </button>

            <div className="mt-8 text-center text-[16px] text-[#3E3E3E]">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#A1640B] underline"
              >
                Entrar na minha conta
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
