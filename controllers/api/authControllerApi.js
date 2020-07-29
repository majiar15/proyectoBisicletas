const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../../models/usuario');

module.exports = {
    autenticate: function(req,res,next) {
        Usuario.findOne({email: req.body.email},function(err,userInfo) {
            
            if(err){
                next(err);
            } 
            else{
                if(userInfo === null) { return res.status(401).json({status:"error", message:"Invalido email/password", data : null});}
                if(userInfo !=null && bcrypt.compareSync(req.body.password,userInfo.password)){
                    console.log('js');
                    const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'),{expiresIn:'7d'} );
                    res.status(200).json({status:"usuario encontrado",data:{usuario:userInfo, token:token }});
       
                }else{
                    res.status(401).json({status:"error",message: "Invalido email/password " ,data:null});
                }
            }
        });
    },
    forgotPassword: function(req,res,next) {
        Usuario.findOne({email:req.body.email },function(err,user) {
            if(!user) return res.status(401).json({message:"No existe el usuario ", data :null});
            user.resetPassword(function(err) {
                if(err) return next(err);
                res.status(200).json({message:"se envio un email para restablecer la password",data : null});
            });
        });
    },
    authFacebookToken: function(req,res,next) {
        console.log("jeje");

        if(req.user){
            req.user.save().then( ()=>{
                const token = jwt.sign({id:req.user.id},req.app.get('secretKey'), {expiresIn: "7d"});
                res.status(200).json({message:"ususario encontrado o creado!", data:{user:req.user,token:token}});
            }).catch((err)=>{
                console.log(err);
                res.status(500).json({message:err.message});
            });
        }else{
            res.status(401);
        }
    }
}