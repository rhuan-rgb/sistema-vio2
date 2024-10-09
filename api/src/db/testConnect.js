const connect = require("./connect");

module.exports = function testConnect() {
  try {
    const query = `SELECT 'Conexão bem-sucedida' AS Mensagem`;
    connect.query(query, function (err) {
      if (err) {
        consolo.log("Conexão não realizada", err);
        return;
      }
      console.log("Conexão realizada com Mysql");
    });
  } catch (error) {
    console.error("Erro a executar a consulta:", erro);
  }
};
