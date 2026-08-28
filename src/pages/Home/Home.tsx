import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import './Home.css'

export default function Home() {
  return (
    <div>
      <Header
        logoUrl="/favicon.svg"
        navLinks={[
          { label: 'Sobre', href: '#sobre' },
          { label: 'Como ajudar', href: '#como-ajudar' },
          { label: 'Eventos', href: '/eventos' },
          { label: 'Área do voluntário', href: '/login' },
          { label: 'Contato', href: '#contato' },
        ]}
      />

      <section className="principal">
        <h4>PROJETO SOCIAL SAÚDE CAMPINAS</h4>
        <h1>Cuidado que pousa onde é preciso.</h1>
        <p>
          Levamos atendimento de saúde, escuta e acolhimento para pessoas em
          situação de rua e vulnerabilidade em Campinas - conduzido por estudantes
          de medicina e da área da saúde, há 6 anos.
        </p>
        <button id="botao-quero-ser" type="button">Quero ser voluntário</button>
        <button id="botao-doar" type="button">Doar medicamentos</button>

        <section>
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
      </section>

      <section id="principios">
        <img className="fotos" alt="foto voluntario + paciente da ong" />
        <h1>Um olhar humanizado para cada pessoa que atendemos</h1>
        <p>
          “Levar atendimento de saúde para pessoas em vulnerabilidade
          socioeconômica, prestando um serviço social humanizado, com olhar
          holístico e empático sobre cada indivíduo.”
        </p>
      </section>

      <section className="cartoezinhos">
        <div id="cartao1">
          <img className="fotos" alt="icone de pessoinha" />
          <h2>Humanização</h2>
          <p>Cada atendimento parte da conversa, antes de qualquer procedimento.</p>
        </div>
        <div id="cartao2">
          <img className="fotos" alt="icone circulo" />
          <h2>Respeito</h2>
          <p>Reconhecemos a história e a autonomia de cada pessoa atendida.</p>
        </div>
        <div id="cartao3">
          <img className="fotos" alt="icone de 3 pessoas" />
          <h2>Altruísmo</h2>
          <p>Voluntários que doam tempo e conhecimento sem esperar retorno.</p>
        </div>
      </section>

      <section id="como-ajudar">
        <img className="fotos" alt="foto random da ong" />
        <div className="dicas doacao">
          <h1>Duas formas diretas de fazer parte.</h1>
          <img className="fotos" alt="icone de remedio" />
          <h5>Doe medicamentos e insumos</h5>
          <p>
            Remédios e amostras grátis parados no armário podem completar o
            estoque que levamos para as ações.
          </p>
        </div>
        <div className="dicas doacao">
          <img className="fotos" alt="mao com coracao" />
          <h5>Seja voluntário nas ações</h5>
          <p>
            Estudantes de medicina e de outras áreas da saúde encontram aqui um
            espaço para aprender cuidando.
          </p>
          <button id="botao-quero-ajudar" type="button">Quero ajudar</button>
        </div>
      </section>

      <section id="calendario">
        <h3 id="titulo-eventos">Próximos eventos</h3>
        <h1>Onde estaremos nas próximas semanas.</h1>
        <p>
          Nossas ações acontecem direto na rua, sem endereço fixo. Confira as
          próximas datas e junte-se a nós.
        </p>
        <button id="agenda" type="button">Ver agenda completa</button>

        <div id="calendario-1">
          <p className="datas">14 DE SETEMBRO - MUTIRÃO</p>
          <h5>Atendimento de rua</h5>
          <img alt="foto de exemplo" />
          <button className="quero-participar" type="button">Quero participar</button>
        </div>
        <div id="calendario-2">
          <p className="datas">21 DE SETEMBRO - CAPACITAÇÃO</p>
          <h5>Coleta de medicamentos</h5>
          <img alt="foto de exemplo" />
          <button className="quero-participar" type="button">Quero participar</button>
        </div>
        <div id="calendario-3">
          <p className="datas">5 DE OUTUBRO - CAPACITAÇÃO</p>
          <h5>Doação de alimentos</h5>
          <img alt="foto de exemplo" />
          <button className="quero-participar" type="button">Quero participar</button>
        </div>
      </section>

      <section>
        <h1>Um espaço para quem já faz parte do cuidado</h1>
        <div id="area-colaboradores">
          <div id="voluntario">
            <h5 id="botao-voluntario">ÁREA DO VOLUNTÁRIO</h5>
            <h6>Acompanhe sua inscrição</h6>
            <p>Confirme presença nos mutirões</p>
            <p>Veja a agenda atualizada</p>
            <p>Fale direto com a equipe</p>
            <button className="botao-entrar" type="button">Entrar</button>
          </div>
          <div id="adm">
            <h5 id="botao-equipe">PAINEL DA EQUIPE</h5>
            <h6>Gestão de estoque e eventos</h6>
            <p>Estoque em tempo real</p>
            <p>Alertas de validade</p>
            <p>Histórico de alterações</p>
            <button type="button">Entrar</button>
          </div>
        </div>
      </section>

      <section>
        <h1>Perguntas frequentes</h1>
        <div className="perguntinhas">
          <h2>A ONG tem sede fixa?</h2>
        </div>
        <div className="perguntinhas">
          <h2>Quem pode ser voluntário?</h2>
        </div>
        <div className="perguntinhas">
          <h2>Como faço para doar medicamentos ou insumos?</h2>
        </div>
        <div className="perguntinhas">
          <h2>Preciso ter experiência para participar das ações?</h2>
        </div>
      </section>

      <section id="carrossel-fotos">
        <p>NO DIA A DIA</p>
        <h2>Um retrato de cada ação</h2>
      </section>

      <section id="contato">
        <p>SIGA DE PERTO</p>
        <h2>Acompanhe cada ação nas nossas redes</h2>
        <p>Fotos, bastidores e próximas datas em primeira mão.</p>
        <div className="redes-sociais">
          <img alt="icone instagram" />
          <p className="nome-redes">INSTAGRAM</p>
          <h2 className="id-redes">@projetosaudecps</h2>

          <img alt="icone arroba" />
          <p className="nome-redes">E-MAIL</p>
          <h2 className="id-redes">contato@saudecampinas.br</h2>
        </div>
      </section>

      <Footer
        navLinks={[
          { label: 'Sobre', href: '#sobre' },
          { label: 'Como ajudar', href: '#como-ajudar' },
          { label: 'Eventos', href: '#eventos' },
          { label: 'Área do voluntário', href: '/login' },
          { label: 'Contato', href: '#contato' },
        ]}
        email="contato@saudecampinas.org"
        whatsappLabel="(19) 99999-9999"
        instagramHandle="@saudecampinas"
        location="Campinas, SP"
      />
    </div>
  )
}