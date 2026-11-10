# Pokédex (PokéAPI)

Aplicação front-end feita com **React + Vite** que consome a [PokéAPI](https://pokeapi.co/) e mostra os Pokémon em uma interface interativa e responsiva.

Atividade avaliativa individual de Front-end com PokéAPI.

**Autor(a):** _Sandra da Silva Alcântara_

---

## Como rodar o projeto

**Pré-requisito:** ter o [Node.js](https://nodejs.org/) instalado.

```bash
# 1. instalar as dependências
npm install

# 2. iniciar o projeto em modo de desenvolvimento
npm run dev
```

Depois, abra no navegador o endereço mostrado no terminal (normalmente `http://localhost:5173`).

Outros comandos:

```bash
npm run build   # gera a versão final na pasta dist
npm run lint    # verifica problemas no código
```

---

## Dependências utilizadas

| Ferramenta | Para que serve |
| ---------- | -------------- |
| **React** (com hooks `useState` e `useEffect`) | construir a interface com componentes |
| **Vite** | iniciar e compilar o projeto |
| **ESLint** | verificar a qualidade do código |
| **CSS puro** | estilização, com flexbox e grid |
| **fetch** (nativo do navegador) | fazer as requisições à API, sem biblioteca extra |

Não foram usadas bibliotecas de UI nem classes: todos os componentes são funções.

---

## Funcionalidades

- **Listagem paginada:** 20 Pokémon por página, com botões Anterior e Próximo e a indicação "Página X de Y"
- **Cards:** cada card mostra número, imagem, nome e tipos (com cor diferente para cada tipo)
- **Detalhes em modal:** ao clicar em um card abre uma janela com imagem de frente e de costas, altura, peso, habilidades e estatísticas base
- **Busca por nome:** campo de texto que filtra a lista na hora, sem chamar a API
- **Carregando e erro:** mensagem "Carregando..." durante a busca e mensagem amigável, com botão para tentar de novo, se a API falhar
- **Layout responsivo:** a quantidade de colunas de cards se ajusta sozinha à largura da tela (desktop, tablet e celular)

### O que não foi implementado

- **Filtro por tipo** (endpoint `/type`): ficou de fora por falta de tempo antes da entrega. Os tipos de cada Pokémon aparecem nos cards, mas ainda não é possível filtrar por eles.

---

## Estrutura do projeto

```
src/
├── main.jsx                  ponto de entrada da aplicação
├── App.jsx                   estados, busca de dados e montagem da tela
├── App.css                   estilos
├── api.js                    função buscarJson (fetch + tratamento de erro)
└── components/
    ├── BarraPesquisa.jsx     campo de busca por nome
    ├── PokemonList.jsx       grid com os cards
    ├── PokemonCard.jsx       um card de Pokémon
    ├── PokemonModal.jsx      janela de detalhes
    └── Paginacao.jsx         botões Anterior / Próximo
```

---

## Decisões de implementação

### Estado centralizado no `App`

Todos os estados ficam no `App.jsx`: lista de Pokémon, página, total, carregando, erro, Pokémon selecionado e texto da busca. Os componentes filhos não guardam estado: só recebem dados e funções por **props**. Assim o fluxo é fácil de acompanhar: o `App` decide e os filhos mostram.

### Consumo da API em duas etapas

O endpoint `/pokemon` só retorna o **nome** e uma **URL** de cada Pokémon. Para ter imagem, tipos, altura, peso e estatísticas, o código faz uma segunda requisição para a URL de cada um. Todas as requisições da página são feitas ao mesmo tempo com `Promise.all`, o que é mais rápido do que fazer uma por vez. Só são buscados os 20 Pokémon da página atual, nunca todos.

### Paginação com `limit` e `offset`

A própria API faz a paginação: `limit` define quantos Pokémon vêm e `offset` quantos são pulados. O `offset` é calculado por `pagina * 20`. A API também informa o total de Pokémon (`count`), usado para calcular o número de páginas com `Math.ceil`. Os botões ficam desativados na primeira e na última página.

### `useEffect` com dependência `[pagina]`

A busca de dados fica dentro de um `useEffect` que depende da `pagina`. Quando o usuário clica em Anterior ou Próximo, o estado `pagina` muda, o React executa o efeito de novo e carrega os Pokémon da nova página. A função de busca é declarada dentro do efeito porque o `useEffect` não aceita uma função `async` diretamente.

### Tratamento de carregamento e erro

Dois estados controlam isso: `carregando` e `erro`. A busca usa `try / catch / finally`:

- `try`: tenta buscar os dados
- `catch`: se algo falhar (sem internet, API fora do ar), guarda uma mensagem amigável
- `finally`: roda sempre, para desligar o "Carregando..." tanto no sucesso quanto no erro

A função `buscarJson`, em `api.js`, lança um erro quando a resposta não é bem-sucedida (`resposta.ok` falso), e esse erro é tratado no `catch` do `App`. Na tela, a renderização condicional (`condição && elemento`) escolhe o que mostrar: carregando, erro ou lista.

### Busca por nome no cliente (client-side)

A busca usa o método `filter` sobre a lista que já foi carregada e não chama a API. O texto digitado e o nome do Pokémon são comparados em minúsculas, e `includes` permite achar por parte do nome (ex.: "pika" encontra "pikachu"). O filtro é calculado a cada renderização, então não precisa de estado extra para o resultado. Como a busca trabalha só com a lista da página atual, ela não encontra Pokémon de outras páginas, o que segue o enunciado ("filtrar a listagem atual").

### Modal sem nova requisição

Quando um card é clicado, o Pokémon inteiro é guardado no estado `selecionado`, e o modal aparece quando esse estado não está vazio. Como o objeto já veio completo da listagem, o modal usa os dados que já existem, sem chamar a API de novo. Ele fecha pelo botão X ou clicando no fundo escuro; o `stopPropagation` impede que clicar dentro da janela também feche.

### Componentização

Cada parte da tela é um componente com uma responsabilidade:

- `PokemonList` só monta o grid de cards
- `PokemonCard` só desenha um card
- `PokemonModal` só mostra os detalhes
- `BarraPesquisa` só mostra o campo de busca
- `Paginacao` só mostra os botões de página

Isso evita código repetido e deixa cada arquivo pequeno e fácil de entender.

### Responsividade

A lista usa CSS Grid com `repeat(auto-fill, minmax(150px, 1fr))`, que ajusta o número de colunas sozinho conforme a largura da tela, sem precisar de várias regras para cada tamanho. O modal usa `width: 100%` com `max-width`, e `max-height` com rolagem, para caber bem no celular.

---

## Fluxo dos dados

```
Abre a página → useEffect busca a lista (limit/offset)
→ busca os detalhes de cada Pokémon (Promise.all)
→ setPokemons → React desenha os cards

Clica em Próximo → setPagina → useEffect roda de novo → novos cards
Clica em um card → setSelecionado → modal aparece
Digita na busca → setBusca → filter → lista filtrada
```