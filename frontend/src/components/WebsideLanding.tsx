import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { ChevronUp, Facebook, Instagram, Linkedin, MessageCircle, Check, Phone, MapPin, X } from "lucide-react";

const historyContent = `A Webside Sistemas nasceu com o propósito de transformar a gestão de postos de combustíveis por meio da tecnologia. Atuamos para oferecer soluções eficazes, promover transparência e garantir controle completo, sempre com foco em proporcionar a melhor experiência ao revendedor.

Nosso CEO, Bruno Tardelli, iniciou sua trajetória na gestão de postes de combustíveis em Minas Gerais. Em 2009, foi convidado a atuar no setor de suporte a empresas, graças ao conhecimento adquirido no uso de ferramentas de gestão. Essa experiência revelou uma realidade importante: embora os sistemas estivessem disponíveis, muitas vezes a informação não chegava de forma clara ao operador de posto, que não conseguia aproveitar todo o potencial das soluções contratadas.

Dessa percepção nasceu a Webside Consultoria e Sistemas, com o sistema WEBPOSTO. A empresa foi criada para identificar necessidades reais e apresentar soluções práticas, desenvolvidas por quem entende o dia a dia do operador de posto e domina a tecnologia de gestão.

Com o tempo, reunimos uma equipe de especialistas altamente capacitados, que combinam conhecimento prático e técnico em implementação, treinamento, consultoria e suporte. Essa união de experiência e dedicação nos permite entregar soluções personalizadas, que impulsionam o crescimento e a inovação no setor de combustíveis.

Na Webside Sistemas, acreditamos que desafios são oportunidades. Nossa paixão pela tecnologia e pelo setor nos motiva a transformar obstáculos em conquistas, sempre com o objetivo de fortalecer o revendedor e elevar o padrão de gestão de postos de combustíveis no Brasil.

Vamos crescer juntos?`;

type SolutionItem = { emoji: string; title: string; desc: string; tag: string };

const solutions: SolutionItem[] = [
  { emoji: "📊", title: "WP Gerencial", desc: "Controle total com relatórios gerenciais e visão estratégica.", tag: "Gestão" },
  { emoji: "📋", title: "WP Comanda", desc: "Atendimento rápido na mesa, integração com cozinha e caixas.", tag: "Restaurante" },
  { emoji: "🍽️", title: "WP Restaurante", desc: "Pedidos automatizados, combos e promoções.", tag: "Food" },
  { emoji: "🛒", title: "WP Conveniência", desc: "Tela intuitiva, cupom fiscal e controle de estoque pelo celular.", tag: "PDV" },
  { emoji: "📦", title: "WP Contagem", desc: "Inventário ágil com câmera do celular e impressão de etiquetas.", tag: "Estoque" },
  { emoji: "📺", title: "WP Display", desc: "Tela espelho, ofertas, QR Code e pesquisa de satisfação.", tag: "Marketing" },
  { emoji: "🔧", title: "WP Oil", desc: "Troca de óleo com informações técnicas e ordens de serviço.", tag: "Serviços" },
  { emoji: "📱", title: "WP PDV Android", desc: "Múltiplos pagamentos e integração com impressoras/leitores.", tag: "PDV" },
  { emoji: "🚛", title: "WP Frota", desc: "Gestão completa de frotas, relatórios e controle de motoristas.", tag: "Frota" },
  { emoji: "📈", title: "WP Dashboard & BI", desc: "Gráficos em tempo real e análises personalizadas.", tag: "Analytics" },
  { emoji: "🧊", title: "WP Freezer", desc: "Geladeira inteligente com débito automático no cartão.", tag: "Inovação" },
  { emoji: "⚡", title: "WP PIX", desc: "Pagamentos instantâneos e seguros via PIX.", tag: "Pagamento" },
  { emoji: "📄", title: "WP Faturamento", desc: "Emissão de boletos e NF-e em poucos passos.", tag: "Fiscal" },
  { emoji: "🔄", title: "WP Conciliação", desc: "Processos automáticos via EDI e OFX (cartão e bancária).", tag: "Financeiro" },
  { emoji: "📚", title: "WP Portal Contábil", desc: "Acesso facilitado para contadores.", tag: "Contabilidade" },
  { emoji: "⛽", title: "WP PDV", desc: "Integração com bombas, cofres, carteiras digitais e fidelidade.", tag: "PDV Premium" },
  { emoji: "🏎️", title: "WP PAY", desc: "Mobilidade na pista, emissão de notas e cupons.", tag: "Pagamento" },
  { emoji: "🤖", title: "WP Autoatendimento", desc: "Pagamento direto pelo cliente, sem filas.", tag: "Self-Service" },
  { emoji: "📲", title: "WP Mobile", desc: "Gestão na palma da mão, indicadores e controle financeiro.", tag: "Mobile" },
  { emoji: "🔔", title: "WP Gerente Eletrônico", desc: "Alertas inteligentes para gestão eficiente.", tag: "Alertas" },
  { emoji: "🔍", title: "WP ID", desc: "Identifica placa, reconhece combustível correto, bloqueia erros.", tag: "Segurança" },
  { emoji: "🧠", title: "WP I.A", desc: "IA integrada: pergunte e obtenha respostas sobre o WebPosto.", tag: "IA" },
];

const maps = {
  mg: "https://maps.app.goo.gl/1S21EcYTbVNEjmji7",
  sp: "https://maps.app.goo.gl/9ADGAFwHmsJ9DT997",
  go: "https://maps.app.goo.gl/1GwBqHWqea23T9Vt8",
};

const whatsappLink = "https://wa.me/5511988934345?text=Venho%20pelo%20site%2C%20quero%20saber%20mais%20e%20tenho%20um%20CUPOM%20DESCONTO%20WSSITE17031987";
const whatsappSuporte = "https://wa.me/5534992990408?text=Venho%20pelo%20site%20%2C%20preciso%20de%20ajuda";

const phones = {
  mg: "(034) 3199-9131",
  sp: "(011) 5199-6177",
  go: "(062) 3602-2258",
  whatsapp: "(34) 99299-0408",
};

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}
function maskCnpj(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export default function WebsideLanding() {
  const navigate = useNavigate();
  const [showTopButton, setShowTopButton] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cnpj: "", cidade: "", ideia: "", origem: "Site", accepted: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    const onScroll = () => {
      const y = window.scrollY;
      setShowTopButton(y > 400);
      setHeaderScrolled(y > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const footerYearText = useMemo(
    () => "Copyright © 2011-2026 | Webside Consultoria e Sistemas Ltda — Todos os direitos reservados — CNPJ: 35.277.090/0001-47",
    []
  );

  const handleAnchorClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Informe o nome completo.";
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Informe um e-mail válido.";
    if (form.telefone.replace(/\D/g, "").length !== 11) e.telefone = "Informe um telefone válido com DDD.";
    if (form.cnpj && form.cnpj.replace(/\D/g, "").length !== 14) e.cnpj = "CNPJ inválido.";
    if (!form.cidade.trim()) e.cidade = "Informe a cidade.";
    if (!form.accepted) e.accepted = "É necessário aceitar a Política de Privacidade.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateForm()) return;
    setSubmitted(true);
  };

  // Function to open chat - Opens helpdesk page in new tab
  const openChat = () => {
    window.open('https://helpdesk.websidesistemas.com.br/', '_blank', 'width=500,height=600,scrollbars=yes');
  };

  return (
    <div className="min-h-screen text-[#020234] bg-white">
      <Header scrolled={headerScrolled} onAnchorClick={handleAnchorClick} />

      <section id="home" className="min-h-[92vh] bg-gradient-to-br from-[#020234] to-[#04176b] text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block rounded-full border border-[#04A6F9] px-4 py-1 text-sm">Software Líder de Mercado</span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#4ffff]">WebPosto</h1>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-[#04A6F9]">Tecnologia que leva seu posto ao futuro.</h1>
            <p className="mt-4 text-lg leading-relaxed">Desenvolvido por especialistas para impulsionar seu controle e produtividade com o WebPosto. A Webside Sistemas é o seu parceiro completo em implementação, treinamento e consultoria.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={() => handleAnchorClick("#contato")} className="rounded-full bg-[#04A6F9] px-6 py-3 font-semibold">Fale com Especialista</button>
              <button onClick={() => handleAnchorClick("#solucoes")} className="rounded-full border border-[#04A6F9] px-6 py-3 font-semibold">Conhecer Soluções</button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
              <div><p className="text-2xl font-bold">+20%</p><p className="text-white/80">dos postos operam com WebPosto</p></div>
              <div><p className="text-2xl font-bold">+9 mil</p><p className="text-white/80"> clientes no Brasil</p></div>
              <div><p className="text-2xl font-bold">+7</p><p className="text-white/80"> Postos por dia começam com WebPosto</p></div>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/telas-webposto-home.png" alt="Telas do sistema WebPosto em múltiplos dispositivos" className="max-w-full md:max-w-[600px] lg:max-w-[700px] w-full h-auto rounded-2xl shadow-2xl ring-4 ring-white/20" onError={() => setImgError(true)} />
          </div>
        </div>
      </section>

      <section id="solucoes" className="bg-[#f0f4f8] py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold">Conheça as Soluções WebPosto</h2>
          <p className="mt-3 text-[#020234]/75 max-w-3xl">Um ecossistema completo de módulos integrados para otimizar cada processo do seu posto de combustíveis.</p>
          <div className="mt-8 grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
            {solutions.map((item) => (
              <article key={item.title} className="group rounded-xl bg-white p-5 shadow-sm hover:shadow-xl transition-all border border-[#e7ebef] relative overflow-hidden">
                <div className="absolute left-0 top-0 h-1 w-0 bg-[#04A6F9] transition-all duration-300 group-hover:w-full" />
                <div className="text-3xl">{item.emoji}</div><h3 className="mt-3 font-bold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-[#020234]/70">{item.desc}</p><span className="inline-block mt-3 rounded-full bg-[#04A6F9]/10 text-[#0284c7] text-xs px-3 py-1">{item.tag}</span>
              </article>
            ))}
            <article className="rounded-xl bg-[#020234] p-6 border border-[#04A6F9] text-white flex flex-col justify-between">
              <div><div className="text-2xl">✨</div><h3 className="mt-3 text-xl font-bold">Tem muito mais! Você precisa conhecer.</h3></div>
              <button onClick={() => handleAnchorClick("#contato")} className="mt-6 rounded-full bg-[#04A6F9] px-5 py-2 font-semibold">Quero conhecer</button>
            </article>
          </div>
        </div>
      </section>

      <section id="sobre" className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10">
          <div className="rounded-2xl bg-[#020234] p-8 text-white">
            <div className="grid grid-cols-2 gap-8 text-center">
              <div>
                <p className="text-6xl font-black tracking-tight text-[#04A6F9]">+15</p>
                <p className="mt-2 text-lg">Anos de Excelência</p>
              </div>
              <div>
                <p className="text-6xl font-black tracking-tight text-[#04A6F9]">+500</p>
                <p className="mt-2 text-lg">Cases de Sucesso</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-base">
              {["🚀 Implementação","🎓 Treinamento","💡 Consultoria","🛡️ Suporte"].map(i => (
                <div key={i} className="rounded-lg border border-white/15 p-5 bg-white/5 text-lg font-medium">{i}</div>
              ))}
            </div>
          </div>
          <div>
            <span className="inline-block rounded-full bg-[#04A6F9]/10 text-[#0284c7] px-3 py-1 text-sm">Sobre Nós</span>
            <h3 className="mt-4 text-3xl font-bold">Quem é a Webside Sistemas?</h3>
            <p className="mt-4 text-[#020234]/75">Desde 2011 atuando no setor de postos de combustíveis...</p>
            <ul className="mt-4 space-y-2 text-[#020234]/85">
              <li>✓ Equipe altamente capacitada em implementação e treinamento</li>
              <li>✓ Consultoria especializada no setor de postos de combustíveis</li>
              <li>✓ Soluções personalizadas com foco em resultados reais</li>
              <li>✓ Parceiro oficial do WebPosto — software líder de mercado</li>
              <li>✓ Filiais em MG, SP e GO para atendimento regional ágil</li>
            </ul>
            <div className="flex flex-wrap gap-4 mt-6">
              <button onClick={() => setShowHistoryModal(true)} className="inline-block mt-6 rounded-full bg-[#020234] text-white px-5 py-3">Conheça Nossa História</button>
              <button onClick={() => window.open('/sobre-nos', '_blank')} className="inline-block mt-6 rounded-full bg-[#020234] text-white px-5 py-3">Conheça mais a Webside</button>
            </div>
          </div>
        </div>
      </section>

      <section id="suporte" className="py-16 bg-gradient-to-br from-[#020234] to-[#04176b] text-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full border border-[#04A6F9] px-4 py-1 text-sm text-white">Suporte Webside</span>
            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-white tracking-tight">Contatos de Suporte</h1>
            <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
              Entre em contato conosco através dos canais abaixo. Nossa equipe está pronta para atendê-lo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a 
              href={whatsappSuporte}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl bg-[#25d366] p-8 text-white hover:bg-[#20bd5a] transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">WhatsApp Suporte</h3>
                  <p className="text-white/90">{phones.whatsapp}</p>
                </div>
              </div>
              <p className="mt-4 text-white/80 text-sm">Clique para iniciar uma conversa</p>
            </a>

<a 
              href="/chat"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl bg-[#04A6F9] p-8 text-white hover:bg-[#0284c7] transition-all hover:scale-[1.02] hover:shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Chat Online</h3>
                  <p className="text-white/90">Clique para iniciar</p>
                </div>
              </div>
              <p className="mt-4 text-white/80 text-sm">Atendimento em tempo real</p>
            </a>


          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight">Telefones Fixos</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-white/10 p-6 text-white border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-[#04A6F9]" />
                  <span className="font-semibold">Minas Gerais</span>
                </div>
                <p className="text-xl font-bold">{phones.mg}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-6 text-white border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-[#04A6F9]" />
                  <span className="font-semibold">São Paulo</span>
                </div>
                <p className="text-xl font-bold">{phones.sp}</p>
              </div>
              <div className="rounded-xl bg-white/10 p-6 text-white border border-white/20">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={20} className="text-[#04A6F9]" />
                  <span className="font-semibold">Goiás</span>
                </div>
                <p className="text-xl font-bold">{phones.go}</p>
              </div>
            </div>
          </div>


        </div>
      </section>

      <section id="contato" className="py-16 bg-[#f0f4f8]">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-3xl font-bold">Vamos crescer juntos?</h3>
            <p className="mt-3 text-[#020234]/75">Deixe seus dados e em breve um especialista entrará em contato.</p>
            <div className="mt-6 rounded-xl bg-[#25d366] p-5 text-white">
              <p>Você pode também entrar em contato e falar com nosso time de especialistas.</p>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-4 rounded-full bg-white text-[#128c7e] px-5 py-2 font-semibold hover:bg-[#f0f0f0] transition-colors">
                <MessageCircle size={20} />
                Iniciar conversa no WhatsApp
              </a>
            </div>
            <h3 className="text-2xl font-bold mb-8 text-center pt-8">Nossas Filiais</h3>
            <div className="flex flex-col gap-4">
              <a target="_blank" rel="noreferrer" href={maps.mg} className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-lg hover:bg-[#f8fafc] hover:shadow-xl transition-all text-[#020234]">
                <MapPin size={20} className="text-[#04A6F9] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Minas Gerais</h4>
                  <p className="text-sm text-gray-600">Clique para ver no mapa</p>
                </div>
              </a>
              <a target="_blank" rel="noreferrer" href={maps.sp} className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-lg hover:bg-[#f8fafc] hover:shadow-xl transition-all text-[#020234]">
                <MapPin size={20} className="text-[#04A6F9] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">São Paulo</h4>
                  <p className="text-sm text-gray-600">Clique para ver no mapa</p>
                </div>
              </a>
              <a target="_blank" rel="noreferrer" href={maps.go} className="flex items-center gap-4 p-6 rounded-xl bg-white shadow-lg hover:bg-[#f8fafc] hover:shadow-xl transition-all text-[#020234]">
                <MapPin size={20} className="text-[#04A6F9] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-lg">Goiás</h4>
                  <p className="text-sm text-gray-600">Clique para ver no mapa</p>
                </div>
              </a>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-md">
            {!submitted ? (
              <form onSubmit={onSubmit} className="space-y-4">
<input type="hidden" name="origem" value="Site" />
                <div>
                  <label className="block text-sm mb-1">Nome completo *</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.nome} onChange={(e) => setForm((p) => ({ ...p, nome: e.target.value }))} />
                  {errors.nome && <p className="text-red-600 text-xs mt-1">{errors.nome}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">E-mail *</label>
                  <input type="email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
                  {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Telefone/WhatsApp *</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.telefone} onChange={(e) => setForm((p) => ({ ...p, telefone: maskPhone(e.target.value) }))} />
                  {errors.telefone && <p className="text-red-600 text-xs mt-1">{errors.telefone}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">CNPJ da empresa</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.cnpj} onChange={(e) => setForm((p) => ({ ...p, cnpj: maskCnpj(e.target.value) }))} />
                  {errors.cnpj && <p className="text-red-600 text-xs mt-1">{errors.cnpj}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Cidade *</label>
                  <input className="w-full border rounded-lg px-3 py-2" value={form.cidade} onChange={(e) => setForm((p) => ({ ...p, cidade: e.target.value }))} />
                  {errors.cidade && <p className="text-red-600 text-xs mt-1">{errors.cidade}</p>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Qual sua ideia ou necessidade? (breve)</label>
                  <textarea 
                    className="w-full border rounded-lg px-3 py-2 h-24 resize-vertical" 
                    placeholder="Ex: Quero saber sobre WP PDV para meu posto em Uberlândia..."
                    value={form.ideia} 
                    onChange={(e) => setForm((p) => ({ ...p, ideia: e.target.value }))} 
                  />
                </div>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" checked={form.accepted} onChange={(e) => setForm((p) => ({ ...p, accepted: e.target.checked }))} />
<span>Ao informar meus dados, eu concordo com a <a href="/privacidade" target="_blank" rel="noreferrer" className="underline">Política de Privacidade</a>.</span>
                </label>
                {errors.accepted && <p className="text-red-600 text-xs -mt-2">{errors.accepted}</p>}
                <button className="w-full rounded-lg bg-[#020234] text-white py-3 hover:bg-[#04A6F9]">Enviar Solicitação</button>
              </form>
            ) : (
              <div className="rounded-xl bg-[#ecfeff] border border-[#67e8f9] p-5">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Check size={18} />Solicitação enviada com sucesso!
                </h4>
                <p className="mt-2 text-[#164e63]">Obrigado pelo contato. Um especialista falará com você em breve.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-[#020234] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <img src="/webside-logo-rodape.png" alt="Webside Sistemas" className="h-11 w-auto" />
            <p className="mt-3 text-white/80">Especialistas em tecnologia para postos de combustíveis.</p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/websidesistemas/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/websidesistemas" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="https://www.linkedin.com/company/websidesistemas" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="https://wa.me/5534992990408?text=Venho%20pelo%20site%2C%20quero%20saber%20mais" target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle size={20} /></a>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Navegação</h5>
            <ul className="space-y-2 text-white/85">
              <li><button onClick={() => handleAnchorClick("#home")}>Home</button></li>
              <li><button onClick={() => handleAnchorClick("#solucoes")}>Soluções</button></li>
              <li><Link to="/sobre-nos">Sobre Nós</Link></li>
              <li><button onClick={() => handleAnchorClick("#suporte")}>Suporte</button></li>
              <li><button onClick={() => handleAnchorClick("#contato")}>Contato</button></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Soluções</h5>
            <ul className="space-y-2 text-white/85">
              <li>WP PDV</li>
              <li>WP Mobile</li>
              <li>WP Frota</li>
              <li>WP Dashboard</li>
              <li>WP PIX</li>
              <li>WP I.A</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Filiais + Legal</h5>
            <ul className="space-y-2 text-white/85">
              <li><a target="_blank" rel="noreferrer" href={maps.mg}>🗺️ Filial Minas Gerais</a></li>
              <li><a target="_blank" rel="noreferrer" href={maps.sp}>🗺️ Filial São Paulo</a></li>
              <li><a target="_blank" rel="noreferrer" href={maps.go}>🗺️ Filial Goiás</a></li>
              <li><a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center py-5 border-t border-white/10 text-sm text-white/70">{footerYearText}</div>
      </footer>

      {showTopButton && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 h-11 w-11 rounded-full bg-[#04A6F9] text-white shadow-lg flex items-center justify-center" aria-label="Voltar ao topo">
          <ChevronUp size={20} />
        </button>
      )}

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#020234]">Nossa História</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} className="text-[#020234]" />
                  </button>
                </div>
              </div>
              <div className="prose prose-sm max-w-none text-[#020234]/80 whitespace-pre-line">
                {historyContent}
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="mt-6 w-full rounded-lg bg-[#020234] text-white py-3 hover:bg-[#04A6F9] transition-colors">
                Voltar ao site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

