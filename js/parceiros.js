// FAQ
const faqs = document.querySelectorAll(".faq-item");

faqs.forEach((faq) => {
  const button = faq.querySelector(".faq-question");

  button.addEventListener("click", () => {
    const aberto = faq.classList.contains("active");

    faqs.forEach((item) => {
      item.classList.remove("active");
      item.querySelector(".faq-answer").style.maxHeight = null;
    });

    if (!aberto) {
      faq.classList.add("active");
      const answer = faq.querySelector(".faq-answer");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// FORMULÁRIO DE PARCERIA

const estados = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

const selectEstado = document.querySelector("#estado");
const selectCidade = document.querySelector("#cidade");

if (selectEstado && selectCidade) {
  estados.forEach((estado) => {
    const opcao = document.createElement("option");
    opcao.value = estado.sigla;
    opcao.textContent = estado.nome;
    selectEstado.appendChild(opcao);
  });

  selectEstado.addEventListener("change", async () => {
    const uf = selectEstado.value;
    selectCidade.disabled = true;
    selectCidade.innerHTML = `<option value="" disabled selected>Carregando cidades...</option>`;

    try {
      const resposta = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
      );
      if (!resposta.ok) throw new Error("Falha na API do IBGE");

      const cidades = await resposta.json();
      selectCidade.innerHTML = `<option value="" disabled selected>Selecione a cidade</option>`;

      cidades.forEach((cidade) => {
        const opcao = document.createElement("option");
        opcao.value = cidade.nome;
        opcao.textContent = cidade.nome;
        selectCidade.appendChild(opcao);
      });

      selectCidade.disabled = false;
    } catch (erro) {
      console.error("Erro ao buscar cidades:", erro);
      selectCidade.innerHTML = `<option value="" disabled selected>Não foi possível carregar as cidades</option>`;
    }
  });
}

// mostrar/esconder subopções de acordo com o interesse marcado
const checkboxesInteresse = document.querySelectorAll(
  'input[name="interesse"]',
);
checkboxesInteresse.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    const alvo = document.querySelector(`#${checkbox.dataset.alvo}`);
    if (alvo) {
      alvo.hidden = !checkbox.checked;
    }
  });
});

// envio do formulário (por enquanto via WhatsApp, sem banco de dados ainda)
const formParceiro = document.querySelector("#formParceiro");
const formAviso = document.querySelector("#formAviso");

if (formParceiro) {
  formParceiro.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.querySelector("#nome")?.value.trim() || "";
    const contato = document.querySelector("#contato")?.value.trim() || "";
    const estado = selectEstado?.value || "";
    const cidade = selectCidade?.value || "";

    const interesses = Array.from(checkboxesInteresse)
      .filter((c) => c.checked)
      .map((c) => c.value);

    if (!nome || !contato || !estado || !cidade || interesses.length === 0) {
      formAviso.textContent =
        "Preencha nome, contato, estado, cidade e selecione ao menos uma opção de interesse.";
      formAviso.className = "form-aviso erro";
      return;
    }

    const detalhes = [];

    if (interesses.includes("aluguel")) {
      detalhes.push(
        `Aluguel: ${document.querySelector("#aluguel-qtd")?.value || ""} | Prazo: ${document.querySelector("#aluguel-prazo")?.value || ""}`,
      );
    }

    if (interesses.includes("venda")) {
      detalhes.push(
        `Venda: ${document.querySelector("#venda-qtd")?.value || ""} | Pagamento: ${document.querySelector("#venda-pagamento")?.value || ""}`,
      );
    }

    if (interesses.includes("insumos")) {
      const insumosSelecionados = Array.from(
        document.querySelectorAll('input[name="insumo-tipo"]:checked'),
      )
        .map((c) => c.value)
        .join(", ");
      detalhes.push(`Insumos: ${insumosSelecionados || "Nenhum selecionado"}`);
    }

    const mensagem = encodeURIComponent(
      `Olá! Gostaria de ser parceiro da Smart Shield.\n\n` +
        `Nome: ${nome}\n` +
        `Contato: ${contato}\n` +
        `Estado: ${estado}\n` +
        `Cidade: ${cidade}\n` +
        `Interesses: ${interesses.join(", ")}\n` +
        `${detalhes.join("\n")}`,
    );

    const whatsappUrl = `https://wa.me/554499485216?text=${mensagem}`;

    window.open(whatsappUrl, "_blank");

    formAviso.textContent =
      "Cadastro enviado via WhatsApp. Nossa equipe entrará em contato em breve.";

    formAviso.className = "form-aviso sucesso";

    formParceiro.reset();
    selectCidade.innerHTML = `<option value="" disabled selected>Selecione o estado primeiro</option>`;
    selectCidade.disabled = true;
  });
}
