'use strict'

const validationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');

exports.get = async(req, res, next) => {
    try{
        var data = await repository.get();
        res.status(200).send(data);
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao processar sua requisição'});
    }
};

exports.getById = async(req, res, next) => {
    try{
        var data = await repository.getById(req.params.id)
        res.status(200).send(data);
     }
     catch (e) {
        res.status(500).send({message: 'Falha ao processar sua requisição'});
    }
};

exports.post = async(req, res, next) => {
    let contract = new validationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');

    if(!contract.isValid()){
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        await repository.create(req.body);
        res.status(201).send({ message: 'Produto cadastrado com sucesso!' });
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao cadastrar produto'});
    }
};

exports.put = async(req, res, next) => {
    try {
        await repository.update(req.params.id, req.body)
        res.status(200).send({ message: 'Produto atualizado com sucesso!' });
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao atualizar produto'});
    }
};

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id)
        res.status(200).send({ message: 'Produto removido com sucesso!' });
    }
    catch (e) {
        res.status(500).send({message: 'Falha ao remover produto'});
    }
};