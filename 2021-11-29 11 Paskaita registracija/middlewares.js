import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from './config.js';


// authorizacijos middleware'as
export const auth = (req, res, next) => {

    // tikrinam ar yra authorization headeris
    if(!req.headers.authorization) {
        res.status(400).send({success: false, error: "Please provide authorization header"});
        return;
    }

    // authroization headerio formatas yra "Bearer <token>", tad splittinam per tarpa tokenui gauti

    const token = req.headers.authorization.split(' ')[1];

    // tikrinam ar tokenas validus
    const isTokenValid = jwt.verify(token, TOKEN_SECRET);

    // jei tokenas validus iskoduojam jame uzsifruotus duomenis
    if(isTokenValid){
        const tokenData = jwt.decode(token);
        const tokenUserId = tokenData.userId;
        // irasom prisijungusio userio id i req objekta velesniam naudojimui.
        req.userId = tokenUserId;
        // kvieciam next(), kad baigtume middleware'o darba ir perduotume req i handleri
        next();
        return
    } 
    // jei tokenas nevalidus grazinam errora
    res.status(400).send({success: false, error: 'Invalid token'});
}