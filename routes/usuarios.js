var express = require('express');
var router = express.Router();
var jsonfile = require('jsonfile');
var middleware = require("../middleware.js");


/* GET users listing. */
router.get('/',middleware.checkToken, function(req, res, next) {
    jsonfile.readFile('./persistence/Usuarios.json',(err,obj)=>{
        res.send(obj);
    });
});

router.post('/', function(req, res, next) {
    jsonfile.readFile('./persistence/Usuarios.json',(err,obj)=>{
        let id2= obj.length+1;
        let bod2= {
            id: id2,
            nombre: req.body.nombre,
            correo: req.body.correo,
            password: req.body.password,
            playlists: req.body.playlists,
            favoritos: req.body.favoritos,
            grupo: req.body.grupo
        };
        let usersNames = obj.map(el=>el.nombre);
        let corrs = obj.map(el=>el.correo);
        if(usersNames.includes(req.body.nombre)){
            res.statusCode=400; 
            res.send('el nombre ya existe');
        }else if(corrs.includes(req.body.correo)){
            res.statusCode=400; 
            res.send('el correo ya se esta usando');
        }
        else{
            obj.push(bod2);
            jsonfile.writeFile('./persistence/Usuarios.json', obj, function(err) {
                if (err) throw err;
            });
            res.send(obj);
        }
    });
});

router.put('/:id', middleware.checkToken,function(req, res, next) {
    let id = parseInt(req.params.id);
    jsonfile.readFile('./persistence/Usuarios.json',(err,obj)=>{
        var ind=-1;
        let ids= obj.map((el,index)=>{
            if(el.id===id){
                ind=index;
            }
            return el.id;
        });
        if(ids.includes(id)){
            obj.id=id;
            obj[ind]=req.body;
            jsonfile.writeFile('./persistence/Usuarios.json', obj, function(err) {
                if (err) throw err;
            });
            res.send(obj[ind]);
        }
        else{
            res.statusCode=404;
            res.send('el id no existe');
        }
    });
});

router.get('/:id', middleware.checkToken,function(req, res, next) {
    let id = parseInt(req.params.id);
    jsonfile.readFile('./persistence/Usuarios.json',(err,obj)=>{
        var ind=-1;
        let ids= obj.map((el,index)=>{
            if(el.id===id){
                ind=index;
            }
            return el.id;
        });
        if(ids.includes(id)){
            res.send(obj[ind]);
        }
        else{
            res.statusCode=404;
            res.send('el id no existe');
        }
    });
});

router.delete('/:id', middleware.checkToken,function(req, res, next) {
    let id = parseInt(req.params.id);
    jsonfile.readFile('./persistence/Usuarios.json',(err,obj)=>{
        var ind=-1;
        let ids= obj.map((el,index)=>{
            if(el.id===id){
                ind=index;
            }
            return el.id;
        });
        if(ids.includes(id)){
            obj.splice(ind,1);
            jsonfile.writeFile('./persistence/Usuarios.json', obj, function(err) {
                if (err) throw err;
            });
            res.send(obj);
        }
        else{
            res.statusCode=404;
            res.send('el id no existe');
        }
    });
});

module.exports = router;