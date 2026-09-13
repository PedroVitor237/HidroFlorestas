'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';

import LogoHF from '@/assets/logo/logo-hf.png';
import { useAuth } from '@/contexts/auth.context';

export default function LoginPage() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleLogin() {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Informe seu email e sua senha.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const result = await signIn({
        email,
        password,
      });
      if (!result.success) {
        setErrorMessage(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="h-25 border-b border-black/10 bg-white">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Image
            src={LogoHF}
            alt="HidroFlorestas"
            width={220}
            priority
          />

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#"
              className="text-[16px] font-medium text-[#3E3E3E] underline hover:text-[#0084DD]"
            >
              Sobre nós
            </Link>

            <Link
              href="#"
              className="text-[16px] font-medium text-[#3E3E3E] underline hover:text-[#0084DD]"
            >
              O que são laboratórios IHFR?
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex min-h-[calc(100vh-100px)] items-center justify-center p-6">
        <div className="w-full max-w-[500px] rounded-[20px] bg-white p-8 shadow-[0px_4px_18px_-3px_rgba(0,0,0,0.25)] md:p-10">
          {/* Logo */}
          <div className="flex justify-center">
            <Image
              src={LogoHF}
              alt="HidroFlorestas"
              width={230}
              priority
            />
          </div>

          <hr className="my-6 border-black/20" />

          {/* Título */}
          <h1 className="text-center text-[25px] font-bold text-amber-700">
            FAÇA SEU LOGIN
          </h1>

          <p className="mt-2 text-center text-[18px] text-[#3E3E3E]">
            Acesse sua conta para gerenciar seus projetos
          </p>

          {/* Email */}
          <div className="mt-8">
            <label htmlFor="email" className="mb-2 block text-[18px] font-bold text-amber-700">
              E-mail
            </label>

            <div className="flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 focus-within:ring-2 focus-within:ring-amber-700text-amber-700">
              <Mail size={24} className="text-[#858585]" />

              <input
                type="email"
                id="email"
                placeholder="seu@email.com"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                aria-describedby={errorMessage ? 'login-error' : undefined}
                className="w-full bg-transparent outline-none placeholder:text-[#858585]"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="mt-6">
            <label htmlFor="password" className="mb-2 block text-[18px] font-bold text-amber-700">
              Senha
            </label>

            <div className="flex items-center gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 focus-within:ring-2 focus-within:ring-amber-700text-amber-700">
              <LockKeyhole size={24} className="text-[#858585]" />

              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                aria-describedby={errorMessage ? 'login-error' : undefined}
                className="w-full bg-transparent text-[16px] text-[#3E3E3E] outline-none placeholder:text-[#858585]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer text-[#858585]"
              >
                {showPassword ? (
                  <EyeOff size={22} />
                ) : (
                  <Eye size={22} />
                )}
              </button>
            </div>
          </div>

          {/* Mostrar senha / Esqueceu senha */}
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="h-4 w-4"
              />

              <span className="text-sm text-[#858585]">
                Mostrar senha
              </span>
            </label>

            <Link
              href="#"
              className="text-sm font-medium text-amber-700 underline"
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {errorMessage ? (
            <p id="login-error" role="alert" className="mt-4 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          {/* Botão */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="
              mt-8
              w-full
              cursor-pointer
              rounded-[10px]
              bg-green-600
              py-4
              text-[22px]
              font-bold
              text-white
              hover:opacity-90
              disabled:cursor-not-allowed
              disabled:opacity-70
              active:scale-[0.98]
            "
          >
            {loading ? 'ENTRANDO...' : 'ENTRAR'}
          </button>

          {/* Cadastro */}
          <div className="mt-8 text-center text-[16px] text-[#3E3E3E]">
            Não tem uma conta?{' '}
            <Link
              href="/register"
              className="font-semibold text-amber-700 underline"
            >
              Cadastrar-se
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}






// 'use client';

// import { useAuth } from "@/contexts/auth.context";

// export default function LoginPage() {

//     const { signIn, user } = useAuth();

//     return (
//         <div>
//             Login Page Aqui <br /><br />
            
//             <button 
//             className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
//             onClick={() => signIn({email: 'admin@admin.com', password: 'admin1234'})}>Fazer Login Admin</button>
//         </div>
//     );
// }
