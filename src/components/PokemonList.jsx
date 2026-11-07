
import  PokemonCard from "./PokemonCard";

function PokemonList({pokemons, onSelecionar}) {
  return(
    <div className='lista'>              
      
    { //mapeando pokemon do PokemonCard a chave pokemon .id e pokemon.
      pokemons.map((pokemon) => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} onClick={()=>onSelecionar(pokemon)} />

      )) 
    }
    </div>
  );
  
}

export default PokemonList;