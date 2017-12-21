'use strict'

const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/customer-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao processar sua requisição'});
    }
};

exports.authenticate = async(req, res, next) => {
    try {
        const data = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY)
        });

        if(!data){
            res.status(404).send({message: 'Usuário ou Senha inválidos'});
            return;
        }

        const token = await authService.generateToken({id: data._id, email: data.email, name: data.name, roles: data.roles});

        res.status(200).send({ token: token, data: {email: data.email, name: data.name} });
    }
    catch (e) {
        res.status(500).send({message: 'Usuário ou Senha inválidos'});
    }
};

exports.refreshToken = async(req, res, next) => {
    try {
        //Recupera token
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const tokenDecoded = await authService.decodeToken(token);

        const data = await repository.getById(tokenDecoded.id);

        if(!data){
            res.status(404).send({message: 'Cliente não encontrado'});
            return;
        }

        const tokenData = await authService.generateToken({id: data._id, email: data.email, name: data.name, roles: data.roles});

        res.status(200).send({ token: tokenData, data: {email: data.email, name: data.name} });
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao cadastrar cliente'});
    }
};

exports.post = async(req, res, next) => {
    let contract = new validationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.password, 6, 'A senha deve conter pelo menos 6 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            roles:['user']
        });
        res.status(201).send({ message: 'Cliente cadastrado com sucesso!' });
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao cadastrar cliente'});
    }
};