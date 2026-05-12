//array com os produtos

const produtos = [
    {
        id:1,
        emoji:"🏴‍☠️",
        badge:"One Piece",
        nome:"Monkey D. Luffy",
        descricao:"Edição gear five com efeitos e base o NIKA ",
        preco:349.99,
        imgsrc:"../assets/71DUkhf8pQL.jpg",
    },
    {
        id:2,
        emoji:"🦇",
        badge:"DC Comics",
        nome:"Batman Dark Knight",
        descricao:"Edição premium com capa removivel e batarangues inclusos.",
        preco:319.90,
        
    },
    {
        id:3,
        emoji:"🟢",
        badge:"Star Wars",
        nome:"Mestre Yoda",
        descricao:"Edição com sabre de luz removivel e base flutuante magnetica",
        preco:289.90,

    },
    {
        id:4,
        emoji:"🎌",
        badge:"JoJo's Bizarre",
        nome:"Jotaro Kujo",
        descricao:"Edição especial, Jotaro Star Platinum, bone removivel",
        preco:449.99,

    },
    {
        id:5,
        emoji:"⚡",
        badge:"Marvel",
        nome:"Thor Ragnarok",
        descricao:"Edição com martelo mjolnir e capa removivel ",
        preco:279.90,

    }
];

//Carrinho funcional 

let carrinho   = [];
let descontoAp = false;
let filtroAt   = "Todos";

const fmt   = v => v.toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
const total = () => carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}

function atualizarBadge() {
  const n = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  document.getElementById("badge").textContent = n;
}

function adicionarAoCarrinho(id) {
  const produto  = produtos.find(p => p.id === id);
  const existente = carrinho.find(i => i.id === id);

  if (existente) existente.quantidade++;
  else carrinho.push({ ...produto, quantidade: 1 });

  descontoAp = false;
  atualizarBadge();
  renderDrawer();
  toast(produto.nome + " adicionado");

  const btn = document.querySelector(`[data-id="${id}"]`);
  if (btn) {
    btn.classList.add("adicionado");
    btn.textContent = "Adicionado";
    setTimeout(() => { btn.classList.remove("adicionado"); btn.textContent = "Adicionar"; }, 1400);
  }
}

function remover(id) {
  carrinho = carrinho.filter(i => i.id !== id);
  descontoAp = false;
  atualizarBadge();
  renderDrawer();
}

function altQtd(id, delta) {
  const item = carrinho.find(i => i.id === id);
  if (!item) return;
  item.quantidade += delta;
  if (item.quantidade <= 0) { remover(id); return; }
  descontoAp = false;
  atualizarBadge();
  renderDrawer();
}

function aplicarDesconto() {
  if (descontoAp || !carrinho.length) return;
  descontoAp = true;
  renderDrawer();
}

function finalizarCompra() {
  if (!carrinho.length) { toast("Carrinho vazio!"); return; }
  const totalFinal = document.getElementById("total-val").textContent;
  alert("Compra finalizada!\n" + totalFinal + "\n\nObrigado pela compra!");
  carrinho = [];
  descontoAp = false;
  atualizarBadge();
  renderDrawer();
  toggleDrawer();
}
// render e drawer
function renderDrawer() {
  const itensEl  = document.getElementById("drawer-itens");
  const footerEl = document.getElementById("drawer-footer");

  if (!carrinho.length) {
    itensEl.innerHTML  = `<div class="vazio"><span class="vazio-icon">◻</span><p>Carrinho vazio</p></div>`;
    footerEl.innerHTML = "";
    return;
  }

  itensEl.innerHTML = "";
  carrinho.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("drawer-item");
    div.innerHTML = `
      <img class="drawer-item-img" src="${item.img}" alt="${item.nome}" onerror="this.style.display='none'"/>
      <div class="drawer-item-info">
        <p class="drawer-item-nome">${item.nome}</p>
        <p class="drawer-item-preco">${fmt(item.preco)}</p>
        <div class="drawer-controles">
          <button class="ctrl" onclick="altQtd(${item.id}, -1)">−</button>
          <span class="ctrl-n">${item.quantidade}</span>
          <button class="ctrl" onclick="altQtd(${item.id}, 1)">+</button>
          <button class="ctrl-del" onclick="remover(${item.id})">✕</button>
        </div>
      </div>
      <span class="drawer-item-subtotal">${fmt(item.preco * item.quantidade)}</span>`;
    itensEl.appendChild(div);
  });

  const subtotal = total();
  const totalFinal = descontoAp ? subtotal * 0.9 : subtotal;

  footerEl.innerHTML = `
    <div class="resumo-linha"><span class="l">Subtotal</span><span class="v">${fmt(subtotal)}</span></div>
    ${descontoAp ? `<div class="resumo-linha"><span class="l">Desconto 10%</span><span class="v verde">−${fmt(subtotal * 0.1)}</span></div>` : ""}
    <div class="resumo-total"><span class="l">Total</span><span class="v" id="total-val">${fmt(totalFinal)}</span></div>
    <button class="btn-desc" ${descontoAp ? "disabled" : ""} onclick="aplicarDesconto()">
      ${descontoAp ? "✓ Desconto aplicado" : "Aplicar desconto de 10%"}
    </button>
    <button class="btn-fin" onclick="finalizarCompra()">Finalizar compra</button>`;
}

function toggleDrawer() {
  document.getElementById("overlay").classList.toggle("show");
  renderDrawer();
}

function fecharOverlay(e) {
  if (e.target === document.getElementById("overlay")) toggleDrawer();
}

function renderFiltros() {
  const badges = ["Todos", ...new Set(produtos.map(p => p.badge))];
  const div = document.getElementById("filtros");
  if (!div) return;
  div.innerHTML = "";

  badges.forEach(b => {
    const btn = document.createElement("button");
    btn.classList.add("filtro-btn");
    if (b === filtroAt) btn.classList.add("ativo");
    btn.textContent = b;
    btn.onclick = () => { filtroAt = b; renderFiltros(); renderProdutos(); };
    div.appendChild(btn);
  });
}

function renderProdutos() {
  const grid = document.getElementById("grid-produtos");
  if (!grid) return;

  const lista = filtroAt === "Todos" ? produtos : produtos.filter(p => p.badge === filtroAt);
  document.getElementById("count-label").textContent = lista.length + " " + (lista.length === 1 ? "item" : "itens");
  grid.innerHTML = "";

  lista.forEach((p, i) => {
    const card = document.createElement("article");
    card.classList.add("card");
    card.style.animationDelay = `${i * 0.07}s`;
    card.innerHTML = `
      <div class="card-img">
        <img src="${p.img}" alt="${p.nome}" onerror="this.parentElement.innerHTML='<div class=\"card-img-placeholder\"></div>'"/>
      </div>
      <div class="card-body">
        <span class="card-badge">${p.badge}</span>
        <h3 class="card-nome">${p.nome}</h3>
        <p class="card-desc">${p.descricao}</p>
        <div class="card-footer">
          <span class="card-preco">${fmt(p.preco)}</span>
          <button class="card-btn" data-id="${p.id}" onclick="adicionarAoCarrinho(${p.id})">Adicionar</button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFiltros();
  renderProdutos();
  renderDrawer();
});
