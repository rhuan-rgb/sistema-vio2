let organizadores = [];
let nextId = 1;

module.exports = class organizadorController {
  static async createOrganizador(req, res) {
    const { telefone, email, password, name } = req.body;

    if (!telefone || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    } else if (isNaN(telefone) || telefone.length !== 11) {
      return res.status(400).json({
        error: "Telefone inválido. Deve conter exatamente 11 dígitos numéricos",
      });
    } else if (!email.includes("@")) {
      return res.status(400).json({ error: "Email inválido. Deve conter @" });
    }

    // Verifica se já existe um organizador com o mesmo email
    const existingOrganizador = organizadores.find(
      (organizador) => organizador.email === email
    );
    if (existingOrganizador) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    // Cria e adiciona novo organizador
    const newOrganizador = { id: nextId++, telefone, email, password, name };
    organizadores.push(newOrganizador);

    return res.status(201).json({
      message: "Organizador criado com sucesso",
      organizador: newOrganizador,
    });
  }

  static async getAllOrganizador(req, res) {
    return res
      .status(200)
      .json({ message: "Obtendo todos os organizadores", organizadores });
  }

  static async updateOrganizador(req, res) {
    //Desestrutura e recupera os dados enviados via corpo da requisição
    const { id, telefone, email, password, name } = req.body;

    //Validar se todos os campos foram preenchidos
    if (!id || !telefone || !email || !password || !name) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    //Procurar o indice do organizador no Arry 'organizadores' pelo id
    const organizadorIndex = organizadores.findIndex(
      (organizador) => organizador.id === id
    );

    // Se o organizador não for entrontrado organizadorIndex equivale a -1
    if (organizadorIndex === -1) {
      return res.status(400).json({ error: "Organizador não encontrado" });
    }

    //Atualiza os dados do organizador no Arry 'organizadores'
    organizadores[organizadorIndex] = { id, telefone, email, password, name };

    return res.status(200).json({
      message: "Organizador atualizado",
      organizador: organizadores[organizadorIndex],
    });
  }

  static async deleteOrganizador(req, res) {
    //Obtém o parametro 'id' da requisição, que é o id de organizador a ser deletado
    const organizadorId = req.params.id;

    //Procurar o indice do organizador no Arry 'organizadores' pelo email
    const organizadorIndex = organizadores.findIndex(
      (organizador) => organizador.id == organizadorId
    );

    // Se o organizador não for entrontrado organizadorIndex equivale a -1
    if (organizadorIndex == -1) {
      return res.status(400).json({ error: "Organizador não encontrado" });
    }

    //Removendo o organizador do Array 'organizadores'
    organizadores.splice(organizadorIndex, 1);
    return res.status(200).json({ message: "Organizador apagado" });
  }
};