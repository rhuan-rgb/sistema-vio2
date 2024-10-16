const connect = require('../db/connect');

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    if (!cpf || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(cpf) || cpf.length !== 11) {
      return res
        .status(400)
        .json({
          error: "CPF inválido. Deve conter exatamente 11 dígitos numéricos",
        });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    else{
    // Construção da query INSERT
      const query = `INSERT INTO usuario (cpf, password, email, name) VALUES ('${cpf}', '${password}', '${email}', '${name}')`;
      //executando a query criada
      try{
        connect.query(query, function(err, results){
          if(err){
            console.log(err);
            console.log(err.code);
            if(err.code === 'ER_DUP_ENTRY'){
              return res.status(400).json({error: "O email já está vinculado a outro usuário",});
            }
            else{
              return res.status(500).json({
                error: "erro interno do servidor :("
              });
            }
          }
          else{
            return res.status(201).json({message: "Usuário cadastrado com sucesso"});
          }
        })
      }catch(error){
        console.error(error);
        res.status(500).json({error:"Erro interno do servidor"});
      }


    }
  }

  static async getAllUsers(req, res) {

    const query = `SELECT * FROM usuario`;
    try{
      connect.query(query, function(err, results){
        if(err){
          console.error(err);
          return res.status(500).json({error: "Erro interno do servidor"});   
        }
        return res.status(200).json({message:"Lista de usuários", users: results});
      })
    }
    catch(error){
      console.error("Erro ao executar consulta:", error);
      return res.status(500).json({error: "Erro interno do servidor"})
    }
  }

  static async updateUser(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição 
    const { id, cpf, email, password, name } = req.body;

    //Validar se todos os campos foram peenchidos 
    if (!id, !cpf || !email || !password || !name) {
        return res.status(400).json({ error: "Todos os campos devem ser preenchidos"});
    }
    const query = `UPDATE usuario SET name=?,password=?,email=?,cpf=? WHERE id_usuario=?`;
    const values = [name, password, email, cpf, id];
    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res
              .status(400)
              .json({ error: "Email já cadastrado por outro usuário" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({
            message: "Usuário não encontrado",
          });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar consulta", error);
    }
  }

  static async deleteUser(req, res) {
    //Obtém o parametro 'id' da requisição, que é o cpf de user a ser deletado
    const userId = req.params.id;
    const query = `DELETE FROM usuario WHERE id_usuario = ?`;
    const values = [userId];
    try{
        connect.query(query, values, function(err, results){
          if (err){
            console.error(err);
            return res.status(500).json({
            error:"Erro interno do servidor"});
          }
          if(results.affectedRows === 0){
            return res.status(404).json({
              error:"Usuário não encontrado"
            });
          }
          return res.status(200).json({
            message:"Usuário excluído com sucesso"
          });
        });
    }
    catch(error){
      console.error(error);
      return res.status(500).json({message: "Erro interno do servidor"});
    }
  }
};
