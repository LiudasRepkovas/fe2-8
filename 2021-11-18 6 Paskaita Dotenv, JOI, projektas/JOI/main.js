import { response } from 'express';
import joi from 'joi';

const schema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().max(10).required(),
    surname: joi.string().max(10).required(),
    age: joi.number().min(1).max(100).required()
});

const stringSchema = joi.string().email().required();

const validationResult = schema.validate({
    email: 'email@gmail.com',
    name: 'X Æ A-12',
    surname: 'Repkovas',
    age: 28,
});

const validationResultFail = schema.validate({
    email: 'emailgmail.com',
    name: 'Liudas111111111111',
    surname: 'Repkovas11111111111111'
});

console.log(validationResult);

if(validationResultFail.error){
    response.status(400).send({success: false, error: {
        message: validationResultFail.error.details[0].message
    }});
    return;
}



response.send()

try {
    const body = {
        email: 'email@gmail.com',
        name: 'X Æ A-12',
        surname: 'Repkovas',
        age: 28,
    };

    const value = await schema.validateAsync(body, {abortEarly: false});
    console.log("VISKAS GERAI")

    const responseObject = {success: true}
    response.send(responseObject);
} catch(e) {
    console.log('NETEISINGAS JSON');
    console.log(e);

    const responseObject = {
        success: false,
        error: "kazkas blogai"
    };


    response.send(responseObject);
}

