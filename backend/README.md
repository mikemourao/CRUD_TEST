# WenLock API

API RESTful para gerenciamento de usuários, desenvolvida com NestJS, TypeORM e MySQL.

## Executar localmente

Na raiz do projeto:

```bash
docker compose up -d mysql
cp backend/.env.example backend/.env
yarn api:dev
```

A API estará em `http://localhost:3000/api` e o Swagger UI em `http://localhost:3000/docs`.
O MySQL do Docker é publicado em `localhost:3307`, pois a porta local `3306` pode permanecer disponível para outras instalações.

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/users` | Cadastra um usuário |
| `GET` | `/api/users?search=&page=1&limit=15` | Lista, pesquisa e pagina usuários |
| `GET` | `/api/users/:id` | Consulta um usuário |
| `PATCH` | `/api/users/:id` | Atualiza parcialmente um usuário |
| `DELETE` | `/api/users/:id` | Exclui um usuário |

## Exemplo de cadastro

```json
{
  "name": "Millena Silva",
  "email": "millena@wenlock.com",
  "registration": "123456",
  "password": "abc123"
}
```

Nome aceita somente letras e espaços; matrícula aceita somente números; senha exige exatamente seis caracteres alfanuméricos. E-mail e matrícula são únicos. A senha é persistida como hash bcrypt e nunca é retornada pela API.

## Scripts

```bash
yarn api:dev
yarn api:build
yarn api:test
yarn workspace @wenlock/api lint
```

Por padrão, `DB_RUN_MIGRATIONS=true` executa a migration da tabela `users` ao iniciar a API. `DB_SYNCHRONIZE` permanece desabilitado para que alterações do banco sejam versionadas e controladas.
