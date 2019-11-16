//express = micro Framework do Node (instalar dependencia - yarn add express)
//importando dependencia express através do require
const express = require('express');
//criando o servidor (API). o Servidor tem que ouvir uma Porta que esta no fim codigo.
const server = express();

//Habilitando express para JSON no corpo da requisição
server.use(express.json());

//Query params = ?teste=1
//Query params = /user/1
//Request body = { "name": "Diego", "email": "diego@rocketseat.com.br"}
//CRUD - Create, Read, Update, Delete

//criado variavel users para a lista nao iniciar vazia (vetor)
const users = ['Diego', 'Claudio', 'Vitor'];

//Middleware é uma função que recebe os parametros req e res e faz alguma coisa na aplicação.
//Manipula os dados de resposta.
//Midleware Global é chamado independente da Rota. Desta maneira bloqueia-se as demais Rotas.
  //_server.use((req, res) => {
  //_  console.log('A requisição foi chamada!')
  //_});

//Liberação das demais Rotas
server.use((req, res, next) => {
//Ex.: Mostrando as Rotas chamadas no Insomnia
//req,method - retorna o HTTP metodo utlizado (GET, POST, etc)
  console.log(`Metodo: ${req.method}; URL: ${req.url}; `);
//A Função next habilita a execução dos demais Middleware 
  return next();
});

//Middleware local (verifica no body da requisição se existe a informação usuario "name")
function checkUserExists(req, res, next) {
  if(!req.body.name) {
    //Retorna o tipo de erro e envia msg via JSON
    return res.status(400).json({ error: 'User name is required' });
    }
    return next();
}

//Midleware se existe Usuario como parametro de acordo com o index.
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    //Retorna o tipo de erro e envia msg via JSON
    return res.status(400).json({ error: 'User does not exists'});
    }
    //Toda rota que usar o Middleware checkUserInArray, tem acesso a variavel req.user
    req.user = user;
    return next();
}

//Rota para listar todos os usuarios (não precisa receber parametros)
server.get('/users', (req, res) => {
//Usando o Midleware de req.user
  //_ return res.json(users);
      return res.json(req.users);
});
//
//Rota para listar um usuario atraves do index
//: sinaliza que vai ser recebido um Router Params
//o index foi inserido devido ao uso do vetor users (posição do nome no array)
//Utilizando Middleware checkUserInArray
server.get('/users/:index', checkUserInArray, (req, res) => {
  //_const nome = req.query.nome;
  //_const id = req.params.id;
  //_const { id } = req.params;
  const {index} = req.params;//desistruturação
  //retorna usuario de acordo com o index que receber
  return res.json(users[index]);
//acima pode se usar também _return res.json(req.user);
});

//Rota de criação de novo usuario (não precisa receber parametros)
//Utilizando Middleware checkUserExists
server.post('/users', checkUserExists, (req, res) => {
//busca o valor da variavel name no corpo da requisição (body)
  const { name } = req.body;
//usando metodo push para inserir um valor no array (users)
  users.push(name);
//Retorna a lista de todos os usuarios via JSON
  return res.json(users);
});

//Rota para Edição/Alteração de usuario (Router Params)
//Utilizando Middleware checkUserExists e checkUserInArray
server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
//pega o novo nome do corpo da requisição e sobrepoe no index do array users
  users[index] = name;
//Retorna a lista de todos os usuarios via JSON
  return res.json(users);
});

//Rota para apagar usuario
//Precisa receber qual o index (usuario) que se quer deletar (Router Params)
//Utilizando Middleware checkUserInArray
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;
//splice vai ate o valor do index e deleta tantas posições conforme o segundo valor
  users.splice(index,1);
//Não precisa retornar a lista de usuario
  //_  return res.json(users);
//Basta retornar um Status Code de certo.
  return res.send();
})

  server.listen(3000);
