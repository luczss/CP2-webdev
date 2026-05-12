//array com os produtos

const produtos = [
    {
        id:1,
        emoji:"🏴‍☠️",
        badge:"One Piece",
        nome:"Monkey D. Luffy",
        descricao:"Edição gear five com efeitos e base o NIKA ",
        preco:349.99,
        
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

