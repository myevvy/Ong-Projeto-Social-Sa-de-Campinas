import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'

export default function Home() {
  return (
    <div>
      <Header
        logoUrl="/favicon.svg"
        navLinks={[
          { label: 'Sobre', href: '/sobre' },
          { label: 'Como ajudar', href: '/como-ajudar' },
          { label: 'Eventos', href: '/eventos' },
          { label: 'Área do voluntário', href: '/login' },
          { label: 'Contato', href: 'DashboardAdmin/DashboardAdmin.tsx' },
        ]}
      />

      <section className="principal bg-[#F2EDE5] py-20 px-6 text-center">
        <p className="text-xs md:text-sm tracking-[0.25em] text-[#C98A3A] font-semibold uppercase mb-5">
          PROJETO SOCIAL SAÚDE CAMPINAS
        </p>

       <h1 className="font-serif text-[#211d1a] text-4xl md:text-5xl leading-tight max-w-[680px] mx-auto mb-6">
          Cuidado que pousa onde é preciso.
        </h1>

        <p className="text-[#5c5852] text-base md:text-[17px] leading-relaxed max-w-[620px] mx-auto mb-9">
          Levamos atendimento de saúde, escuta e acolhimento para pessoas em
          situação de rua e vulnerabilidade em Campinas - conduzido por estudantes
          de medicina e da área da saúde, há 6 anos.
        </p>

        <button
          className="inline-flex items-center justify-center bg-[#2b241f] text-white text-sm font-medium px-6 py-3 rounded-full mr-4 mb-5 hover:opacity-90 transition-opacity"
          type="button"
        >
          Quero ser voluntário
        </button>
        <button
          className="inline-flex items-center justify-center bg-white text-[#2b241f] text-sm font-medium px-6 py-3 rounded-full border border-[#e2ddd3] mb-5 hover:bg-[#faf8f4] transition-colors"
          type="button"
        >
          Doar medicamentos
        </button>
        <a href="/dashboard/admin" className="block mb-2">
          <button className="text-sm text-[#2b241f] underline underline-offset-4 hover:opacity-70" type="button">
            Ir para Admin
          </button>
        </a>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-[720px] mx-auto text-left mt-10">
          <div className="border-l-2 border-[#D9A441] pl-4">
            <h5 className="text-[#D9A441] font-semibold text-lg mb-1">6 anos</h5>
            <p className="text-[#6b665f] text-[13px] leading-snug">de atuação contínua em Campinas</p>
          </div>
          <div className="border-l-2 border-[#D9A441] pl-4">
            <h5 className="text-[#D9A441] font-semibold text-lg mb-1">100%</h5>
            <p className="text-[#6b665f] text-[13px] leading-snug">Conduzido por estudantes da área da saúde</p>
          </div>
          <div className="border-l-2 border-[#D9A441] pl-4">
            <h5 className="text-[#D9A441] font-semibold text-lg mb-1">Rua a rua</h5>
            <p className="text-[#6b665f] text-[13px] leading-snug">Atuação itinerante, sem sede fixa</p>
          </div>
        </section>
      </section>

      <section className="text-black bg-white">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <img src="src/assets/img1.jpg" alt="voluntário atendendo pessoa em situação de rua"
            className="w-full max-w-[420px] h-72 object-cover rounded-md mx-auto md:mx-0" />

          <div>
            <h1 className="font-serif text-[#211d1a] text-2xl md:text-3xl leading-snug mb-4">
              Um olhar humanizado para cada pessoa que atendemos.
            </h1>
            <p className="text-[#5c5852] text-[15px] leading-relaxed">
              "Levar atendimento de saúde para pessoas em vulnerabilidade
              socioeconômica, prestando um serviço social humanizado, com olhar
              holístico e empático sobre cada indivíduo."
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center flex flex-col items-center">
          <img src="src/assets/person.png" className="fotos" alt="icone de pessoinha" />
          <h2 className="font-serif text-lg text-[#211d1a] mb-2">Humanização</h2>
          <p className="text-sm text-[#6b665f] leading-relaxed">Cada atendimento parte da conversa, antes de qualquer procedimento.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center flex flex-col items-center">
          <img src="src/assets/circle.png" className="fotos" alt="icone circulo" />
          <h2 className="font-serif text-lg text-[#211d1a] mb-2">Respeito</h2>
          <p className="text-sm text-[#6b665f] leading-relaxed">Reconhecemos a história e a autonomia de cada pessoa atendida.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center flex flex-col items-center">
          <img src="src/assets/people.png" className="fotos" alt="icone de 3 pessoas" />
          <h2 className="font-serif text-lg text-[#211d1a] mb-2">Altruísmo</h2>
          <p className="text-sm text-[#6b665f] leading-relaxed">Voluntários que doam tempo e conhecimento sem esperar retorno.</p>
        </div>
      </section>

      <section className="como-ajudar">
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
        <div className="bg-white rounded-[10px]">
          <img className="fotos" alt="mao com coracao" />
          <h5>Seja voluntário nas ações</h5>
          <p>
            Estudantes de medicina e de outras áreas da saúde encontram aqui um
            espaço para aprender cuidando.
          </p>
          <button className="text-white bg-[rgb(201,126,57)]" type="button">Quero ajudar</button>
        </div>
      </section>

      <section className="bg-[#F2EDE5] py-20 px-6">
        <h3 className="text-[#D9A441]">Próximos eventos</h3>
        <h1 className="text-[#5c5852] text-[15px] leading-relaxed">Onde estaremos nas próximas semanas.</h1>
        <p>
          Nossas ações acontecem direto na rua, sem endereço fixo. Confira as
          próximas datas e junte-se a nós.
        </p>
        <button className="shrink-0 bg-transparent text-[#211d1a] text-sm font-medium px-6 py-3 rounded-full border border-[#2b241f] hover:bg-[#e9e2d6] transition-colors">Ver agenda completa</button>

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <p className="text-xs tracking-widest text-[#C98A3A] font-semibold uppercase mb-3">14 DE SETEMBRO - MUTIRÃO</p>
          <h5 className="font-serif text-[#211d1a] text-lg mb-4">Atendimento de rua</h5>
          <img alt="foto de exemplo" />
          <button className="quero-participar" type="button">Quero participar</button>
        </div>

        <div className="calendario-2">
          <p className="text-xs tracking-widest text-[#C98A3A] font-semibold uppercase mb-3">21 DE SETEMBRO - CAPACITAÇÃO</p>
          <h5 className="font-serif text-[#211d1a] text-lg mb-4">Coleta de medicamentos</h5>
          <img className="w-full h-56 object-cover rounded-sm" alt="foto de exemplo" />
          <button  className="quero-participar absolute -bottom-4 left-4 bg-[#2b241f] text-white text-xs font-medium px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity" type="button">Quero participar</button>
        </div>

        <div className="pb-8">
          <p className="text-xs tracking-widest text-[#C98A3A] font-semibold uppercase mb-3">5 DE OUTUBRO - CAPACITAÇÃO</p>
          <h5 className="font-serif text-[#211d1a] text-lg mb-4">Doação de alimentos</h5>
          <img alt="foto de exemplo" />
          <button className="text-white bg-black rounded-[7px]" type="button">Quero participar</button>
        </div>
      </section>

      <section className="bg-[#F2EDE5] px-6 pt-16 pb-20">
        <h1 className="font-serif text-[#211d1a] text-3xl md:text-[34px] text-center mb-10">
          Um espaço pra quem já faz parte do cuidado.
        </h1>

        <div className="max-w-[1050px] mx-auto grid grid-cols-1 md:grid-cols-2 rounded-md overflow-hidden">
          <div className="bg-[#E4EAD9] p-10 md:p-12">
            <span className="inline-block bg-[#6B7A52] text-white text-[11px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full mb-5">
              Área do voluntário
            </span>
            <h2 className="font-serif text-[#211d1a] text-2xl mb-4">Acompanhe sua inscrição</h2>
            <ul className="mb-10 space-y-2">
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <span>—</span> Confirme presença nos mutirões
              </li>
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <span>—</span> Veja a agenda atualizada
              </li>
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <span>—</span> Fale direto com a equipe
              </li>
            </ul>
            <button
              type="button"
              className="bg-[#2b241f] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Entrar
            </button>
          </div>

          <div className="bg-[#DDE4EC] p-10 md:p-12">
            <span className="inline-block bg-[#3F5877] text-white text-[11px] tracking-widest font-semibold uppercase px-3 py-1 rounded-full mb-5">
              Painel da equipe
            </span>
            <h2 className="font-serif text-[#211d1a] text-2xl mb-4">Gestão de estoque e eventos</h2>
            <ul className="mb-10 space-y-2">
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <p> Estoque em tempo real</p>
              </li>
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <p> Alertas de validade</p>
              </li>
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <p>Histórico de alterações</p>
              </li>
            </ul>
            <button type="button"
             className="bg-[#2b241f] text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
              Entrar
             </button>
          </div>
        </div>
      </section>

      <section className="max-w-[730px] mx-auto space-y-4">
        <h1 className="font-serif text-[#211d1a] text-3xl md:text-[34px] text-center mb-10">Perguntas frequentes</h1>
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

      <section className="carrossel-fotos">
        <p>NO DIA A DIA</p>
        <h2>Um retrato de cada ação</h2>
      </section>

      <section className="contato">
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
          { label: 'Sobre', href: '/sobre' },
          { label: 'Como ajudar', href: '/como-ajudar' },
          { label: 'Eventos', href: '/eventos' },
          { label: 'Área do voluntário', href: '/login' },
          { label: 'Contato', href: '/contato' },
        ]}
        email="contato@saudecampinas.org"
        whatsappLabel="(19) 99999-9999"
        instagramHandle="@saudecampinas"
        location="Campinas, SP"
      />
    </div>
  )
}