// ===================================================
// Conexão do formulário de Parceiros com o Supabase
// ===================================================

// 1. Configuração do Supabase (suas credenciais do projeto)
const SUPABASE_URL = "https://geahsdgmzifsjegtpusw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlYWhzZGdtemlmc2plZ3RwdXN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3MzA2NzAsImV4cCI6MjEwNjMwNjY3MH0.iu54tsWJqSMRHzWb-OQbiiG5fYF7Rx44cgJQN-90lnE";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);

// 2. Pega o formulário na página
const formParceiro = document.getElementById("formParceiro");
const formAviso = document.getElementById("formAviso");

if (formParceiro) {
  formParceiro.addEventListener("submit", async (event) => {
    event.preventDefault(); // impede o envio "tradicional" da página

    formAviso.textContent = "Enviando...";
    formAviso.style.color = "inherit";

    // 3. Monta o objeto com os dados do formulário
    const formData = new FormData(formParceiro);

    // Campos simples
    const nome = formData.get("nome");
    const contato = formData.get("contato");
    const estado = formData.get("estado");
    const cidade = formData.get("cidade");

    // Checkboxes "interesse" (pode marcar mais de um) -> vira uma lista
    const interesses = formData.getAll("interesse");

    // Checkboxes "insumo-tipo" (pode marcar mais de um) -> vira uma lista
    const insumoTipo = formData.getAll("insumo-tipo");

    // Campos condicionais (só existem se a seção aparecer, mas FormData
    // já lida bem com isso - se não existir, vem undefined/null)
    const aluguelQtd = formData.get("aluguel-qtd");
    const aluguelPrazo = formData.get("aluguel-prazo");
    const vendaQtd = formData.get("venda-qtd");
    const vendaPagamento = formData.get("venda-pagamento");

    // 4. Monta o registro que vai pro banco
    const novoLead = {
      nome,
      contato,
      estado,
      cidade,
      interesses: interesses.length > 0 ? interesses : null,
      aluguel_qtd: interesses.includes("aluguel") ? aluguelQtd : null,
      aluguel_prazo: interesses.includes("aluguel") ? aluguelPrazo : null,
      venda_qtd: interesses.includes("venda") ? vendaQtd : null,
      venda_pagamento: interesses.includes("venda") ? vendaPagamento : null,
      insumo_tipo: insumoTipo.length > 0 ? insumoTipo : null,
    };

    // 5. Envia pro Supabase
    const { error } = await supabaseClient
      .from("parceiros_leads")
      .insert([novoLead]);

    if (error) {
      console.error("Erro ao enviar cadastro:", error);
      formAviso.textContent =
        "Ops! Não conseguimos enviar seu cadastro. Tente novamente em instantes.";
      formAviso.style.color = "red";
    } else {
      formAviso.textContent =
        "Cadastro enviado com sucesso! Nossa equipe vai entrar em contato em breve.";
      formAviso.style.color = "green";
      formParceiro.reset();
    }
  });
}
