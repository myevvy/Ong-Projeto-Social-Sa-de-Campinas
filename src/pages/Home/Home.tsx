import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import img3 from "/src/assets/img3.jpg";
import img4 from "/src/assets/img4.jpg";
import img5 from "/src/assets/img5.jpg";
import insta from "/src/assets/insta.png";
import email from "/src/assets/email.png";

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
            <h1 className="font-serif text-[#211d1a] text-3xl md:text-[38px] font-bold leading-tight mb-6">
              Um olhar humanizado para cada pessoa que atendemos.
            </h1>
            <p className="text-[#3a3632] text-base md:text-[17px] leading-relaxed">
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

      <section className="bg-[#f5f2eb] py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between items-center text-center shadow-sm">
            <h2 className="font-serif text-[#211d1a] text-xl md:text-2xl font-bold leading-snug max-w-xs mb-6">
              Duas formas diretas de fazer parte. </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative w-full mb-6">
              <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-200 -translate-x-1/2" />
              <div className="flex flex-col items-center px-1">
                <img src="src/assets/pills.png" className="w-7 h-7 object-contain mb-2" alt="icone de remedio" />
                <h3 className="font-bold text-[#211d1a] text-xs mb-1">Doe medicamentos e insumos</h3>
                <p className="text-[#6b665f] text-[11px] leading-tight">
                  Remédios e amostras grátis parados no armário podem completar o estoque que levamos para as ações. </p>
              </div>
              <div className="flex flex-col items-center px-1">
                <img src="src/assets/hand.png" className="w-7 h-7 object-contain mb-2" alt="mao com coracao" />
                <h3 className="font-bold text-[#211d1a] text-xs mb-1">Seja voluntário nas ações</h3>
                <p className="text-[#6b665f] text-[11px] leading-tight">
                  Estudantes de medicina e de outras áreas da saúde encontram aqui um espaço para aprender cuidando.  </p>
              </div>
            </div>
            <button className="text-white bg-[#c97e39] hover:bg-[#b46e2d] px-6 py-2 rounded-full text-xs font-medium transition-colors" type="button">
              Quero ajudar </button>
          </div>
          <div className="w-full h-full max-h-[380px]">
            <img src="src/assets/img2.jpg" className="w-full h-full object-cover rounded-2xl" alt="foto da ong" />
          </div>
        </div>
      </section>

      <section className="bg-[#F2EDE5] py-20 px-6">
       <div className="max-w-[1100px] mx-auto">
         <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
           <div>
             <p className="text-xs tracking-widest text-[#D9A441] font-semibold uppercase mb-4"> Próximos eventos </p>
             <h1 className="font-serif text-[#211d1a] text-4xl md:text-5xl leading-tight mb-4 max-w-md"> Onde estaremos nas próximas semanas. </h1>
             <p className="text-[#5c5852] text-sm leading-relaxed max-w-sm"> Nossas ações acontecem direto na rua, sem endereço fixo. Confira as
             próximas datas e junte-se a nós. </p>
            </div>
         <button type="button" className="shrink-0 bg-transparent text-[#211d1a] text-sm font-medium px-6 py-3 rounded-full border border-[#2b241f] 
          hover:bg-[#e9e2d6] transition-colors -bottom-4 left-4"> Ver agenda completa </button>
    </div>

   
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      
      {[
        { data: "14 SET · MUTIRÃO", titulo: "Atendimento de rua", img: img3, },
        { data: "21 SET · CAMPANHA", titulo: "Coleta de medicamentos", img: img4, },
        { data: "05 OUT · CAPACITAÇÃO", titulo: "Roda de novos voluntários", img: img5, },
      ].map((evento) => (
        <div key={evento.titulo}>
          <p className="text-xs tracking-widest text-[#C98A3A] font-semibold uppercase mb-3">
            {evento.data}
          </p>
          <h5 className="font-serif text-[#211d1a] text-lg mb-4">
            {evento.titulo}
          </h5>

          <div className="relative">
            <img src={evento.img} alt={evento.titulo}
             className="w-full h-56 object-cover rounded-sm"/>
            <button type="button"className="absolute -bottom-4 left-4 bg-[#2b241f] text-white text-xs font-medium px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity">
            Quero participar </button>
          </div>
        </div>
      ))}
    </div>
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
                <span>—</span> Estoque em tempo real
              </li>
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <span>—</span> Alertas de validade
              </li>
              <li className="text-[#4a4a42] text-sm flex gap-2">
                <span>—</span> Histórico de alterações
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

        <section className="bg-[#F2EDE5] py-20 px-6 text-center">
  <p className="text-xs tracking-widest text-[#D9A441] font-semibold uppercase mb-5">SIGA DE PERTO</p>
  <h2 className="font-serif text-[#211d1a] text-3xl md:text-4xl font-bold mb-4">Acompanhe cada ação nas nossas redes</h2>
  <p className="text-[#5c5852] text-sm md:text-base mb-10">Fotos, bastidores e próximas datas em primeira mão.</p>

  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
    <div className="flex items-center gap-3 bg-[#2b241f] rounded-full pl-2 pr-6 py-2">
      <div className="w-9 h-9 rounded-full bg-[#D9A441] flex items-center justify-center shrink-0">
        <img src={insta} alt="icone instagram" className="w-4 h-4" />
      </div>
      <div className="text-left">
        <p className="nome-redes text-[10px] tracking-widest text-[#c9a876] font-semibold uppercase">INSTAGRAM</p>
        <h2 className="id-redes text-white text-sm font-semibold">@projetosaudecps</h2>
      </div>
    </div>

    <div className="flex items-center gap-3 bg-[#2b241f] rounded-full pl-2 pr-6 py-2">
      <div className="w-9 h-9 rounded-full bg-[#D9A441] flex items-center justify-center shrink-0">
        <img src={email} alt="icone arroba" className="w-4 h-4" />
      </div>
      <div className="text-left">
        <p className="nome-redes text-[10px] tracking-widest text-[#c9a876] font-semibold uppercase">E-MAIL</p>
        <h2 className="id-redes text-white text-sm font-semibold">contato@saudecampinas.br</h2>
      </div>
    </div>
  </div>
</section>

      <Footer
        navLinks={[
          { label: "Sobre", href: "/sobre" },
          { label: "Como ajudar", href: "/doacao" },
          { label: "Eventos", href: "/eventos" },
          { label: "Área do voluntário", href: "/voluntario" },
          { label: "Contato", href: "/contato" },
        ]}
        email="contato@saudecampinas.org"
        whatsappLabel="(19) 99999-9999"
        instagramHandle="@saudecampinas"
        location="Campinas, SP"
      />
    </div>
  );
}