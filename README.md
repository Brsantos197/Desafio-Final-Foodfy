# Desafio-Final-Foodfy

📜 Introdução

Desafio final do curso LaunchBase da Rocketseat

Aplicação Web que foi desenvolvida ao longo do Bootcamp Launchstore da Rocketseat. 
Consiste em criar um sistema capaz de registrar usuários para que possam registrar suas receitas com os demais usuários/chefs que participarem da comunidade da Aplicação.

👨🏼‍💻 Tecnologia
O projeto foi construído com as seguintes tecnologias:

HTML5;
CSS3;
JavaScript;
Node.js;
PostgreSQL.

Com ajuda das seguintes bibliotecas/frameworks:

Express.js;
Nodemon;
Nunjucks.

🚀 Configurando
Para que o projeto seja utilizado, deve-se seguir alguns passos para configurá-lo corretamente:

1º Primeiro passo:

baixe a aplicação ou, utilizando o código de versionamento (git), clone o mesmo:

git clone https://github.com/Brsantos197/Desafio-Final-Foodfy.git

Após escolher uma das opções, esteja ciente de que o projeto deve ter sido baixado/clonado em um ambiente de desenvolvimento que esteja pronto para uso com node.js

2º Segundo passo:

Digite no console do ambiente:

npm install

Isso irá instalar todas as dependências utilizadas no projeto de maneira automática.

Há um arquivo incluso no projeto "database.pgsql" que contém todas as informações de como foi criado o Banco de Dados do projeto, e para que o mesmo funcione, você deve criar a database, as tables e procedures utilizadas, portanto, rode os códigos pgsql deste arquivo.

O projeto rodará na porta 3000 podendo ser acessado no endereço:

http://localhost:3000

Informações Finais:
O nome do banco de dados por padrão esta como "foodfy";
Mude as credencias do Banco de Dados para as configuradas em seu computador, isso pode ser configurado no arquivo db.js localizado no diretório: config/db.js
O projeto conta com um sistema simples de envio de E-mail, usando o mailtrap, portanto, também lembre-se de configurar o mesmo com o usuário e senha que poderá ser gerado automaticamente no site do mailtrap ao criar um inbox e na SMTP Settings mudar a integração para o nodemailer.

🌱 Seeding
Há também um arquivo configurado como seeder do projeto, você pode utilizar o "seed.js" para preencher as tabelas com informações padrãos do projeto que esta no documento "data.json", parte das informações são geradas de forma aleatória com a biblioteca "faker",para utilizar o seed.js escreva no console:

node seeds.js
Na raíz do projeto para que o seeder preencha as tabelas.

E por último, para rodar o projeto digite:

npm start

