const jwt = require('jsonwebtoken');

/*
	Verificar Token
*/

const verifyToken = ( req, res, next ) => {
	let token = req.get('Authorization');

	jwt.verify( token, process.env.SEED, (err, decoded) => {
		if(err){
			return res.status(401).json({
				code: 401,
				err:{
					message: 'Token no válido'
				}
			});
		}

		req.user = decoded.user;
		next();
		
	});

	
};


/* Verificar Admin Role*/
const adminRole = ( req, res, next ) => {
	
	let isAdmin = req.user.role === "ADMIN_ROLE";

	if(!isAdmin){
		return res.status(401).json({
			code: 401,
			err:{
				message: 'No tienes permiso de administrador'
			}
		});
	}

	next();
};

module.exports = {
	verifyToken,
	adminRole
}