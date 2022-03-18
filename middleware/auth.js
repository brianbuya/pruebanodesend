const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

module.exports = (req, res, next) => {
    //console.log('Yo soy un middleware');
    //console.log(req.get('Authorization'));
    const authHeader = req.get('Authorization');

    if(authHeader) {
        // Obtener el token
        const token = authHeader.split(' ')[1];

        // Comprobar el JWT
        try {
            const usuario = jwt.verify(token, process.env.SECRETA );
/*             console.log('desde middleware', usuario);

            //console.log(usuario);
            res.json({usuario}); */
            req.usuario = usuario
            
        } catch (error) {
            console.log(error);
            console.log('JWT no valido');
        }

    }

    //console.log('No hay header... =(')

    return next();
}