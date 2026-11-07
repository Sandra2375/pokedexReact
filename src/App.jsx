import { useState, useEffect } from 'react'; //hook:useState armazena e atualiza dados que podem mudar durante projeto.useEffect lida com possiveis efeitos colaterais do projeto tb busca dados da net como a pokeap 
import { API, buscarJson } from './api';
import './App.css';
import PokemonList from "./components/PokemonList";
import Paginacao from './components/Paginacao';
import PokemonModal from './components/PokemonModal';

const por_pagina = 20; //quant de pókemon p/ pag (p/ mudar quant).

function App() {
  //estado que guarda os pokemons, começa vazio.
  const [pokemons, setPokemons] = useState([]);
  //Páginação
  const [pagina, setPagina] = useState(0);// Começa na primeira página.
  const [total, setTotal] = useState(0);// Números total de Pókemons na API.
  //tratamento de erros
  const [carregando, setCarregando] = useState(true); // começa true, ao abrir já está buscando
  const [erro, setErro] = useState(""); // string vázia = sem erro.
  //Modal
  const [selecionado, setSelecionado] = useState(null); //Pokémon aberto no modal, null = nenhum
  
  //roda toda vez que carregar a pg.
  useEffect(() => {
    async function carregar() {
      setCarregando(true); //começando a busca.
      setErro(""); //limpando erro anterior.

      try{
       
      const offset = pagina * por_pagina; 

      //busca a lista pela url.
      const dados = await buscarJson(`${API}/pokemon?limit=${por_pagina}&offset=${offset}`);

      setTotal(dados.count); // a API inf o total que tem.
      

      //para cada cards, busca os detalhes ex: img, nome, tipos...
      const detalhes = await Promise.all(
        dados.results.map((item) => buscarJson(item.url)),
      );

      //gda no estado, e o react escreve na tela.
      setPokemons(detalhes);

      }catch{
        // qqr erro no try cai aqui.
      setErro("não foi possível carregar os Pokémons. verifique sua conexão e tente novamente");
      }finally{
      setCarregando(false); //roda sempre, independente de sucesso ou erro.

      }
    }
    carregar();
  }, [pagina]); 

  const totalPaginas = Math.ceil(total/por_pagina); //o math calculo p arredonda sempre p mais ou num maior.

  return(


    <div className='app'>              
      
                
      <h1>Pokedex</h1>
      {carregando && <p className='mensagem'>Carregando...</p>}
      {erro && (
        <div className='mensagem erro'> 
          <p>{erro}</p>
          <button onClick={()=>window.location.reload()}>Tentar Novamente</button>
        </div>
      )}

      {!carregando && !erro && (
        <>
        <PokemonList pokemons={pokemons} onSelecionar={setSelecionado} />
        <Paginacao pagina={pagina} setPagina={setPagina} totalPaginas={totalPaginas} />
        </>
      )} 

      {selecionado && (
        <PokemonModal pokemon={selecionado} onFechar={()=>setSelecionado(null)} /> 
      )} 
       
    </div>
  );

}

export default App;