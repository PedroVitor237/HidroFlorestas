# 🌿 Hidro Florestas Fullstack

Bem-vindo ao repositório do **Hidro Florestas**, uma aplicação fullstack desenvolvida com **Next.js** e **Prisma**. Este guia ajudará você a configurar o ambiente de desenvolvimento local do zero.

## IHFR experimental

A primeira versão do IHFR é um contrato experimental, versionado e sujeito a recalibração. Os conflitos das fontes históricas estão preservados e a validação científica definitiva e os testes de campo permanecem futuros. Consulte o [registro canônico da decisão](docs/governance/ADR-0001-contrato-experimental-ihfr-v0-1.md).

---

## 🚀 Primeiros Passos

Siga a ordem abaixo para garantir que o projeto e o banco de dados estejam sincronizados corretamente.

### 1. Instalação de Dependências

Após clonar o repositório, navegue até a pasta raiz e instale os pacotes necessários:

**Bash**

```
npm install
```

### 2. Configuração do Banco de Dados (Prisma)

O Prisma é o ORM do projeto. Configure `DATABASE_URL` para o ambiente pretendido antes de executar os comandos abaixo. As migrations existentes em `prisma/migrations/` formam o histórico autoritativo; não crie uma nova migration `init` para instalar o projeto.

#### **Gerar o Client do Prisma**

Sempre que você clona o projeto pela primeira vez ou quando há mudanças no arquivo `schema.prisma` feitas por outros desenvolvedores, você deve rodar:

**Bash**

```
npx prisma generate
```

> **Por que?** Este comando lê o arquivo de esquema e gera o código TypeScript/JavaScript necessário para que o seu editor (VS Code) entenda as tabelas do banco e ofereça o auto-complete (IntelliSense).

#### **Aplicar as migrations existentes**

Em um banco de desenvolvimento autorizado, após conferir `npx prisma migrate status`, aplique a cadeia existente com:

**Bash**

```
npx prisma migrate dev
```

Em um ambiente de implantação, a aplicação não deve gerar migrations interativamente. Após confirmar o destino, a cadeia existente é aplicada com `npx prisma migrate deploy`. A política de provisionamento e aprovação de cada ambiente ainda não está definida neste README; confirme-a antes de executar qualquer migration fora do banco de desenvolvimento autorizado.

`npx prisma generate` gera o Client a partir do schema local; não aplica SQL ao banco. Confira o estado real do banco antes de iniciar a aplicação, especialmente se houver migrations pendentes ou histórico divergente.

---

## 💻 Rodando o Projeto

Com as dependências instaladas e o banco de dados configurado, inicie o servidor de desenvolvimento:

**Bash**

```
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a aplicação.

---

## 🛠️ Tecnologias Utilizadas

* **Next.js** - Framework React para produção.
* **Prisma** - ORM para interação com o banco de dados.
* **Tailwind CSS** - Estilização moderna e responsiva.
* **TypeScript** - Segurança de tipos para o código.

---

## 📝 Notas Adicionais

* Certifique-se de ter um arquivo `.env` na raiz com a sua `DATABASE_URL` configurada antes de rodar os comandos do Prisma.
* Para visualizar os dados do banco de forma gráfica, você pode usar o comando `npx prisma studio`.
