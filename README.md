# agenda-de-tarefas-back
Este repositório é a implementação do back-end da disciplina de desenvolvimento móvel - OPT002


#### Tecnologias Utilizadas:
* Typescript
* Express
* Docker
* Postgres
* PrismaORM

[![Languages and Tools](https://skillicons.dev/icons?i=ts,express,docker,postgres,prisma)](https://skillicons.dev)

## Configurando o ambiente

### Clone o repositório
```bash
git clone https://github.com/joaoPAndrade/agenda-de-tarefas-back.git
```

### Navegue até a raiz do projeto
```bash
cd agenda-de-tarefas-back
```

### Configure a arquivo `.env`
Ao clonar o repositório, será necessário configurar o arquivo .env para que o banco de dados rode e se conecte corretamente.
No repositório clonado existe um arquivo com o nome **.env.example**. Crie um arquivo com o nome **.env** ou apenas retire o **.example** do arquivo já existente.
Dentro desse arquivo será necessário colocar a sua url de configuração do banco de dados postgres.
```bash
DATABASE_URL = postgresql://usuario:senha@host:5432/nome_do_banco?schema=nome_do_schema
```

### Executar o Docker
```bash
docker compose up -d
```

### Instalar as dependências do projeto
```bash
npm i
```

### Executar o projeto
```bash
npm run dev
```

### Por padrão o sistema rodará na porta 3333, portanto deverá ser acessado via
```bash
http://localhost:3333/
```





