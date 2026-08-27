// add so no cadastro do voluntario, pra conferir se ele é adulto
const calcularIdade = (dataNasc) => {
  const hoje = new Date();
  const nascimento = new Date(dataNasc);
  let idade = hoje.getFullYear() - nascimento.getFullYear();

  if (
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() == nascimento.getMonth() && hoje.getDay() < nascimento.getDay())
  ) {
    return idade - 1;
  }
};


export default calcularIdade;
