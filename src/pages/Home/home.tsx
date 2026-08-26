import { Button } from '../../components/Button/Button'

export default function Home () {
    return (
      <div>

         <header className="topo">
         <img id="logo" />
         <h1>Saúde Campinas</h1>
         <div className="opcoes-topo">
            <p>Sobre</p>
            <p>Como ajudar</p>
            <p>Eventos</p>
            <p>Área do voluntário</p>
            <p>Contato</p>
         </div>
        </header>
        
        <section className="principal">
        <h4>PROJETO SOCIAL SAÚDE CAMPINAS</h4>
        <h1>Cuidado que pousa onde é preciso.</h1>
        <p>Levamos atendimento de saúde, escuta e acolhimento para pessoas em
            situação de rua e vulnerabilidade em Campinas - conduzido por estudantes
            de medicina e da área da saúde, há 6 anos.
        </p>
        <Button id="botao-quero-ser">Quero ser voluntário</Button>
        <Button id="botao-doar">Doar medicamentos</Button>
        <div id="infos-ong1">
            <h5 className="h5-info">6 anos</h5>
            <p className="textinho-info">de atuação contínua em Campinas</p>
        </div>
        <div id="infos-ong2">
            <h5 className="h5-info">100%</h5>
            <p className="textinho-info">Conduzido por estudantes da área da saúde</p>
        </div>
        <div id="infos-ong3">
            <h5 className="h5-info">Rua a rua</h5>
            <p className="textinho-info">Atuação itinerante, sem sede fixa</p>
        </div>
                </section>
            </div>
    )
}