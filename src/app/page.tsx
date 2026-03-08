'use client'
export default function LandingPage() {
  return (
    <div>
      Página de Início / <i>Landing-Page</i>
      <br />
      <a href="/login" className="underline text-blue-600">Página de Cadastro</a>
      <br />
      <a href="/register" className="underline text-blue-600">Página de Login</a>
<br />
      <button className="p-2 bg-blue-200 rounded-2xl cursor-pointer" onClick={async () => {
        const res = await fetch('/api/auth/sign-in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: 'teste@gmail.com', password: '12345678' })
        })

        alert(res.status);
      }}>
        Simular Login
      </button>
    </div>
  );
}
