function PokemonModal({pokemon, onFechar}){
    return(
        <div className="fundo" onClick={onFechar}>
            <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <button className="fechar" onClick={onFechar}>
            x
        </button>
        <h2>
            #{pokemon.id} {pokemon.name}

        </h2>
        <div className="sprites">
            <img src={pokemon.sprites.front_default} alt="frente" />
            {pokemon.sprites.back_default && (
            <img src={pokemon.sprites.back_default} alt="costa" />

            )}
            
        </div>

        <p> Altura: {pokemon.height/10} m </p>
        <p> Peso: {pokemon.weight/10} kg </p>

        <h4> Habilidades </h4>
        <ul>
            {pokemon.abilities.map((a)=>(
                <li key={a.ability.name}>{a.ability.name}</li>
            ))}
           
        </ul>

        <h4>Estatíscas base</h4>
        <ul>
            {pokemon.stats.map((s)=>(
                <li key={s.stat.name}>
                    {s.stat.name}: {s.base_stat}
                </li>
            ))}
        </ul>
            </div>
        </div>
    );
}

export default PokemonModal;