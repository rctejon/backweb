let jwt = require( 'jsonwebtoken' );
let config = require( './config' );
var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');

// Clase encargada de la creación del token
class HandlerGenerator {

  login( req, res ) {
    
    // Extrae el usuario y la contraseña especificados en el cuerpo de la solicitud
    let username = req.body.username;
    let password = req.body.password;
    
    var adm;
    if(username==='admin' && password==='admin'){
      adm='admin';
    }
    let mockedUsername = 'admin';
    let mockedPassword = 'password';
    // Este usuario y contraseña, en un ambiente real, deben ser traidos de la BD
    let id = parseInt(req.params.id);
    let BDuser;
    jsonfile.readFile('./persistence/Usuarios.json',(err,obj)=>{
        var us ={};
        var usua={};
        for (let index = 0; index < obj.length; index++) { 
          usua = obj[index];
          if(usua.nombre===username){
            us=usua;
          }
        }
        if(us==={}){
        }
        else{
            BDuser=us;
            mockedUsername = us.nombre;
            mockedPassword = us.password;
        }
    // Si se especifico un usuario y contraseña, proceda con la validación
    // de lo contrario, un mensaje de error es retornado
    if( (username && password && BDuser)||(username==='admin'&&password==='admin')) {

      // Si los usuarios y las contraseñas coinciden, proceda con la generación del token
      // de lo contrario, un mensaje de error es retornado
      if( username === mockedUsername && password === mockedPassword ) {
        
        // Se genera un nuevo token para el nombre de usuario el cuál expira en 24 horas
        let token = jwt.sign( { username: username },
          config.secret, { expiresIn: '24h' } );
        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
        res.json( {
          success: true,
          message: 'Authentication successful!',
          userid: BDuser.id,
          token: token
        } );

      }
      else if(username==='admin'&&password==='admin'){
        let token = jwt.sign( { username: username },
          config.secret, { expiresIn: '24h' } );
        // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
        res.json( {
          success: true,
          message: 'Authentication successful!',
          userid: 'admin',
          token: token
        } );
      } 
      else {
        
        // El error 403 corresponde a Forbidden (Prohibido) de acuerdo al estándar HTTP
        res.statusCode=403;
        res.json( {
          success: false,
          message: 'Incorrect username or password'
        } );

      }

    } else if(adm==='admin'){
        let token2 = jwt.sign( { username: username },
          config.secret, { expiresIn: '24h' } );
      // Retorna el token el cuál debe ser usado durante las siguientes solicitudes
      res.json( {
        success: true,
        message: 'Admin Authentication successful!',
        token: token2
      } );

    } else {
      // El error 400 corresponde a Bad Request de acuerdo al estándar HTTP
      res.statusCode=400;
      res.json( {
        success: false,
        message: 'Authentication failed! Please check the request'
      } );

    }
    });

  }

  index( req, res ) {
    
    // Retorna una respuesta exitosa con previa validación del token
    res.json( {
      success: true,
      message: 'Index page'
    } );

  }
}

module.exports = HandlerGenerator;
