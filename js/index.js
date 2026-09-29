// parte do destaque
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".featured-grid");
  if (!grid) return;
  const destaques = produtos.filter((produto) => produto.destaque);

  // a parte para os produtos aparecerem no destaque
  destaques.forEach((produto) => {
    const rotacao = (Math.random() * 8 - 4).toFixed(1);

    grid.innerHTML += `
        <div class="featured-card"
            style="--hover-rotate:${rotacao}deg;"
            onclick="window.location.href='../individual.html?id=${produto.id}'">
            <span class="badge ${produto.badgeClass}">${produto.badge}</span>
            <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
            <h3>${produto.nome}</h3>
            <div class="description-wrapper"
                data-full="${produto.descricao}">
                <p>${produto.descricao}</p>
            </div>
        </div>
    `;
  });
});

// parte da distribuição das categorias
const distribuicao = document.querySelector("#distribuicao");
if (distribuicao) {
  distribuicao.addEventListener("click", () => {
    window.open("../parceiros.html");
  });
}

document.querySelectorAll(".categoria-card").forEach((card) => {
  card.addEventListener("click", () => {
    const filtro = card.dataset.filter;
    window.location.href = `../catalogo.html?categoria=${filtro}`;
  });
});
