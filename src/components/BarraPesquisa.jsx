
//campo de busca, não guarda estado o texto fica no App
// value={busca}: o que aparece no campo vem do estado
// onChange: a cada letra digitada, avisa o App pela função onBuscaChange
// e.target.value: o texto que está no campo naquele momento
function BarraPesquisa({busca, onBuscaChange}){
    return(
        <div className="barra">
            <input value={busca} onChange={(e)=>onBuscaChange(e.target.value)} placeholder="Buscar por nome..." type="text" />
        </div>
    );
}
export default BarraPesquisa;