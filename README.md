# WenLock

Sistema full stack para gerenciamento de usuários, desenvolvido como avaliação prática para a posição de Desenvolvedor Full Stack.

O projeto reúne uma interface construída com React e uma API RESTful em NestJS, com persistência em MySQL e documentação interativa via Swagger UI.

## Tecnologias

### Frontend

- React 19
- TypeScript
- Vite
- Material UI
- React Router
- Feature-Sliced Design (FSD)

### Backend

- NestJS
- TypeScript
- TypeORM
- MySQL 8.4
- class-validator e class-transformer
- bcrypt
- Swagger/OpenAPI
- Jest

### Infraestrutura

- Docker Compose
- Yarn Workspaces

## Estado atual

| Requisito | Situação |
| --- | --- |
| Tela de apresentação (Home) | Implementado |
| Lista de usuários | Implementado |
| Pesquisa por nome | Implementado |
| Paginação | Implementado |
| API CRUD de usuários | Implementado |
| Validações da API | Implementado |
| Banco de dados MySQL | Implementado |
| Swagger UI | Implementado |
| Login com e-mail ou matrícula | Implementado |
| Cadastro no frontend | Implementado |
| Visualização no frontend | Implementado |
| Edição no frontend | Implementado |
| Exclusão no frontend | Implementado |

## Arquitetura

O repositório utiliza um monorepo com dois workspaces independentes:

```text
wenlock/
├── frontend/                  # Aplicação React
│   ├── src/
│   │   ├── app/               # Inicialização, providers e rotas
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── widgets/           # Blocos de interface reutilizáveis
│   │   ├── features/          # Casos de uso: cadastro, edição e exclusão
│   │   ├── entities/          # Usuários, sessão, tipos e acesso à API
│   │   └── shared/            # API client, assets e recursos compartilhados
│   ├── .env.example
│   └── package.json
├── backend/                   # API NestJS
│   ├── src/
│   │   ├── common/            # Contratos e recursos compartilhados
│   │   ├── database/          # Migrations do banco de dados
│   │   ├── modules/auth/      # Autenticação e usuário padrão
│   │   └── modules/users/     # Entidade, DTOs, serviço e controller
│   ├── .env.example
│   └── package.json
├── docker-compose.yml         # MySQL para desenvolvimento
├── package.json               # Orquestração dos workspaces
└── yarn.lock
```

### Frontend

O frontend segue Feature-Sliced Design. As dependências fluem das camadas de maior nível para as de menor nível: `app → pages → widgets/entities → shared`.

A URL da API fica isolada no cliente HTTP compartilhado e é configurada por variável de ambiente. A listagem possui busca com debounce, cancelamento de requisições obsoletas, paginação e estados de carregamento, erro e lista vazia.

### Backend

O backend segue a organização modular do NestJS. O módulo `users` concentra:

- `User`: mapeamento da tabela;
- DTOs: entrada, consulta e resposta;
- `UsersService`: regras de negócio e persistência;
- `UsersController`: contrato HTTP e documentação Swagger.

A senha é transformada em hash bcrypt antes da persistência, possui `select: false` no TypeORM e não integra os DTOs de resposta.

## Decisões técnicas

- **Monorepo:** mantém frontend e backend separados, mas permite instalar e executar ambos pela raiz.
- **Feature-Sliced Design:** reduz acoplamento e facilita a evolução das funcionalidades do frontend.
- **TypeORM com migrations:** o schema é versionado e não depende de sincronização automática.
- **MySQL em Docker:** torna o ambiente de desenvolvimento reproduzível.
- **Porta `3307`:** evita conflito com instalações locais que já utilizam a porta padrão `3306`.
- **DTOs distintos:** impede que informações sensíveis, como a senha, sejam retornadas pela API.
- **Validação global:** propriedades desconhecidas são rejeitadas e os parâmetros são transformados para os tipos esperados.
- **Busca no servidor:** pesquisa e paginação continuam eficientes conforme o volume de usuários cresce.
- **Variáveis de ambiente:** endereços e credenciais não ficam acoplados ao código-fonte.

## Pré-requisitos

- Node.js 20.19+, 22.12+ ou 24+
- Yarn 1.22.22, disponibilizado pelo Corepack
- Docker Desktop com suporte a Docker Compose

> O Node.js 23 pode executar o projeto, mas algumas ferramentas exibem avisos por não ser uma versão LTS oficialmente suportada.

## Instalação

Clone o repositório e acesse sua raiz:

```bash
git clone https://github.com/mikemourao/CRUD_TEST.git
cd CRUD_TEST
```

Habilite o Yarn e instale as dependências:

```bash
corepack enable yarn
yarn install --frozen-lockfile
```

Crie os arquivos locais de ambiente a partir dos exemplos.

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
Copy-Item backend/.env.example backend/.env
```

Linux ou macOS:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Variáveis de ambiente

### Frontend

Arquivo: `frontend/.env`

```env
VITE_API_URL=http://localhost:3000/api
```

### Backend

Arquivo: `backend/.env`

```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=wenlock
DB_PASSWORD=wenlock
DB_DATABASE=wenlock
DB_SYNCHRONIZE=false
DB_RUN_MIGRATIONS=true
DB_LOGGING=false

DEFAULT_USER_EMAIL=milena.santana@energy.org.br
DEFAULT_USER_REGISTRATION=000001
DEFAULT_USER_PASSWORD=abc123
```

Os arquivos `.env` são ignorados pelo Git. Apenas os arquivos `.env.example`, sem segredos reais, devem ser versionados.

## Executando o projeto

### 1. Inicie o MySQL

```bash
docker compose up -d mysql
```

O banco estará disponível em `localhost:3307`. Na primeira inicialização da API, a migration cria automaticamente as tabelas `users` e `migrations`.

Antes de iniciar a API, aguarde o status do container ficar `healthy`:

```bash
docker compose ps mysql
```

### 2. Inicie frontend e backend

```bash
yarn dev
```

Serviços disponíveis:

| Serviço | Endereço |
| --- | --- |
| Frontend | <http://localhost:5173> |
| API | <http://localhost:3000/api> |
| Swagger UI | <http://localhost:3000/docs> |
| OpenAPI JSON | <http://localhost:3000/docs-json> |
| MySQL | `localhost:3307` |

## Comandos

### Monorepo

```bash
yarn dev       # frontend e backend em modo de desenvolvimento
yarn build     # build dos dois workspaces
yarn lint      # lint dos dois workspaces
yarn test      # testes do backend
```

### Execução individual

```bash
yarn web:dev       # somente frontend
yarn web:build
yarn web:lint

yarn api:dev       # somente backend
yarn api:build
yarn api:lint
yarn api:test
yarn api:start     # executa o backend compilado; requer yarn api:build antes
```

## API de usuários

Base URL: `http://localhost:3000/api`

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/auth/login` | Autentica por e-mail ou matrícula e senha |
| `POST` | `/users` | Cadastra um usuário |
| `GET` | `/users` | Lista usuários |
| `GET` | `/users/:id` | Consulta um usuário pelo UUID |
| `PATCH` | `/users/:id` | Atualiza parcialmente um usuário |
| `DELETE` | `/users/:id` | Exclui um usuário |

### Login

Exemplo de autenticação com e-mail:

```http
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "milena.santana@energy.org.br",
  "password": "abc123"
}
```

O campo `identifier` também aceita a matrícula do usuário.

### Usuário padrão

O backend cria ou atualiza o usuário padrão ao iniciar:

```text
Nome: Milena Santana Borges
E-mail: milena.santana@energy.org.br
Matrícula: 000001
Senha: abc123
```

As credenciais podem ser configuradas pelas variáveis `DEFAULT_USER_*`. A senha é armazenada exclusivamente como hash `bcrypt`.

### Busca e paginação

```http
GET /api/users?search=Millena&page=1&limit=15
```

| Parâmetro | Tipo | Padrão | Regra |
| --- | --- | --- | --- |
| `search` | string | — | Busca parcial por nome |
| `page` | number | `1` | Mínimo `1` |
| `limit` | number | `15` | Entre `1` e `100` |

### Cadastro

```json
{
  "name": "Millena Silva",
  "email": "millena@wenlock.com",
  "registration": "123456",
  "password": "abc123"
}
```

Validações:

- todos os campos são obrigatórios no cadastro;
- nome aceita apenas letras e espaços;
- e-mail precisa possuir formato válido;
- matrícula aceita apenas números;
- senha exige exatamente seis caracteres alfanuméricos;
- e-mail e matrícula não podem se repetir.

### Códigos HTTP

| Código | Uso |
| --- | --- |
| `200` | Consulta ou atualização realizada |
| `201` | Usuário cadastrado |
| `204` | Usuário excluído |
| `400` | Dados, UUID ou paginação inválidos |
| `401` | E-mail, matrícula ou senha inválidos |
| `404` | Usuário não encontrado |
| `409` | E-mail ou matrícula duplicados |

Os exemplos completos e a execução interativa estão disponíveis no Swagger UI.

## Banco de dados

A migration inicial cria a tabela `users` com a seguinte estrutura:

| Coluna | Tipo | Restrições |
| --- | --- | --- |
| `id` | `varchar(36)` | chave primária UUID |
| `name` | `varchar(120)` | obrigatório |
| `email` | `varchar(160)` | obrigatório e único |
| `registration` | `varchar(30)` | obrigatório e único |
| `password` | `varchar(255)` | obrigatório, armazena apenas hash |
| `created_at` | `datetime(6)` | preenchimento automático |
| `updated_at` | `datetime(6)` | atualização automática |

Os dados ficam em um volume Docker persistente. Para parar os serviços sem apagar os dados:

```bash
docker compose down
```

Para remover também todos os registros e recriar o banco do zero:

```bash
docker compose down -v
```

> Atenção: a opção `-v` remove definitivamente o volume local do MySQL e todos os usuários cadastrados.

## Qualidade e testes

Antes de entregar alterações, execute:

```bash
yarn lint
yarn build
yarn test --runInBand
```

Os testes unitários atuais verificam paginação, consulta, remoção, usuário inexistente e ausência da senha nas respostas.

## Solução de problemas

### Frontend exibe `Failed to fetch`

Confirme se API e banco estão ativos:

```bash
docker compose ps mysql
yarn api:dev
```

Verifique também se `frontend/.env` aponta para `http://localhost:3000/api`.

### Porta `3000` ou `5173` em uso

Encerre processos antigos antes de executar `yarn dev`. Se alterar as portas, atualize também `FRONTEND_URL` e `VITE_API_URL`.

### Porta MySQL `3307` em uso

Altere o mapeamento em `docker-compose.yml` e mantenha `DB_PORT` no `backend/.env` com o mesmo valor.

### Swagger não reflete uma alteração

Atualize <http://localhost:3000/docs> com `Ctrl + F5` após o backend recompilar.

## Documentação complementar

- [Documentação específica do backend](backend/README.md)
- [Variáveis do frontend](frontend/.env.example)
- [Variáveis do backend](backend/.env.example)
