import { Button } from '../../components/Button/Button'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'

export default function Home () {
    return (
      <div>
    
                <Header
                    logoUrl="/favicon.svg"
                    navLinks={[
                        { label: "Sobre", href: "/sobre" },
                        { label: "Como ajudar", href: "/doacao" },
                        { label: "Eventos", href: "/eventos" },
                        { label: "Área do voluntário", href: "/login" },
                        { label: "Contato", href: "#contato" },
                    ]}
                />
         
        
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
                    <section id="principios">
                       <img alt="foto voluntario + paciente da ong"></img>
                       <h1>Um olhar humanizado para cada pessoa que atendemos</h1>
                       <p>"Levar atendimento de saúde para pessoas vulnerabilidade socioecônomica,
                       prestando um serviço social humanizado, com olhar holístico e empático
                      sobre cada indivíduo.</p>
                   </section>

                   <section class="cartoezinhos"> 
                       <div id="cartao1">
                           <img alt="icone de pessoinha"></img>
                           <h2>Humanização</h2>
                           <p>Cada atendimento parte da conversa, antes de qualquer procedimento.</p>
                        </div>       
                       <div id="cartao2">
                           <img alt="icone circulo"></img>
                           <h2>Respeito</h2>
                           <p>Reconhecemos a história e a autonomia de cada pessoa atendida</p>
                       </div>       
                       <div id="cartao3">
                          <img alt="icone de 3 pessoas"></img>
                          <h2>Altruísmo</h2>
                          <p>Voluntários que doam tempo e conhecimento sem esperar retorno.</p>
                       </div>
                </section>

                <section id="como ajudar">
                  <img alt="foto random da ong"></img>
                  <div class="dicas doacao">
                     <h1>Duas formas diretas de fazer parte.</h1>
                     <img alt="icone de remedio"></img>
                     <h5>Doe medicamentos e insumos</h5>
                     <p>Remédios e amostras grátis parados no armário podem completar
                         o estoque que levamos para as ações.       
                     </p>
                  </div>
                  <div class="dicas doacao">
                      <img alt="mao com coracao"></img>
                      <h5>Seja voluntários nas ações</h5>
                      <p>Estudantes de medicina e de outras áreas da saúde encontram aqui
                        um espaço para aprender cuidando.
                     </p>
                      <Button>Quero ajudar</Button>
                  </div>
                <section id="calendario">
                    <h3>Próximos eventos</h3>
                    <h1>Onde estaremos nas próximas semanas.</h1>
                    <p>Nossas ações acontecem direto na rua, sem endereço fixo.
                             Confira as próximas datas e junte-se a nós. </p>
                          <button>Ver agenda completa</button>
                    <div id="calendario 1">
                          <p class="datas">14 DE SETEMBRO - MUTIRÃO</p>       
                          <h5>Atendimento de rua</h5>
                          <img alt='foto de exemplo'></img>
                          <button>Quero participar</button>
                    </div>
                    <div id="calendario 2">
                          <p class="datas">21 DE SETEMBRO - CAPACITAÇÃO</p>
                          <h5>Coleta de medicamentos</h5>
                          <img alt='foto de exemplo'></img>
                          <button>Quero participar</button>
                    </div>
                    <div id="calendario 3">
                          <p class="datas">5 DE OUTUBRO - CAPACITAÇÃO</p>
                          <h5>Doação de alimentos</h5>
                          <img alt='foto de exemplo'></img>
                          <button>Quero participar</button>
                    </div>
                </section>

                <section>
                    <h1>Um espaço para quem já faz parte do cuidado</h1>
                    <div id="voluntario">
                         <h5>ÁREA DO VOLUNTÁRIO</h5>
                         <h6>Acompanhe sua inscrição</h6>
                         <p>Confirme presença nos mutirões</p>
                         
                         <p>Veja a agenda atualizada</p>
                         
                         <p>Fale direto com a equipe</p>
                         <button>Entrar</button>
                    </div>
                    <div id="adm">
                         <h5>PAINEL DA EQUIPE</h5>
                         <h6>Gestão de estoque e eventos</h6>

                         <p>Estoque em tempo real</p>

                         <p>Alertas de validade</p>

                         <p>Histórico de alterações</p>
                         <button>Entrar</button>
                    </div>
                </section>

                <section>
                  <h1>Perguntas frequentes</h1>
                  <div class="perguntinhas">
                    <h2>A ONG tem sede fixa?</h2>
                  </div>
                  <div class="perguntinhas">
                    <h2>Quem pode ser voluntário?</h2>
                  </div>
                  <div class="perguntinhas">
                    <h2>Como faço para doar medicamentos ou insumos?</h2>
                  </div>
                  <div class="perguntinhas">
                    <h2>Preciso ter experiência para participar das ações?</h2>
                  </div>
                </section>

             </section>   

            <Footer
                    logoUrl="/favicon.svg"
                    navLinks={[
                        { label: "Sobre", href: "#sobre" },
                        { label: "Como ajudar", href: "#como-ajudar" },
                        { label: "Eventos", href: "#eventos" },
                        { label: "Área do voluntário", href: "/login" },
                        { label: "Contato", href: "#contato" },
                    ]}
                />
             
            </div>
    )
}