
function Paginacao({pagina, setPagina, totalPaginas}){
    // o disabled está desativando o bultão qdo a pg atual for a 1a ou a ultima ai o desabilit funciona.
    // on Clic ele roda qdo aperta o botão.Qdo clica no botão anterior volta.qdo no botão px ele segui.acrescenta +1. 
    return(
        <div className="paginacao">
          
            <button disabled={pagina === 0 } onClick={()=>setPagina(pagina-1)}> 
            
                Anterior
            </button>
            <span>
                Página {pagina+1} de {totalPaginas}
            </span>
            <button disabled={pagina +1 >= totalPaginas } onClick={()=>setPagina(pagina+1)}>
                Próximo
            </button>
        </div>
    );
}

export default Paginacao;
