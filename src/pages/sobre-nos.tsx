import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const maps = {
  mg: "https://maps.app.goo.gl/1S21EcYTbVNEjmji7",
  sp: "https://maps.app.goo.gl/9ADGAFwHmsJ9DT997",
  go: "https://maps.app.goo.gl/1GwBqHWqea23T9Vt8",
};

export default function SobreNosPage() {
  const [mobileOpen, setMobileOpen] = useState(false);



  return (
    <div className="min-h-screen bg-white text-[#020234]">
      <header className="sticky top-0 z-50 bg-[#020234] text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/">
className="h-[2.75rem] w-auto scale-50 origin-left"
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/">Home</Link>
            <Link to="/parceiros">Parceiros e Integrações</Link>
            <Link to="/sobre-nos">Sobre nós</Link>
            <Link to="/blog">Blog</Link>
            <button className="bg-white text-[#020234] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all">Fale com especialista</button>
            <div className="relative">
              <button className="flex items-center gap-1 hover:text-[#04A6F9] transition-colors">
                Contatos
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}>{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="flex flex-col gap-2">
              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              <a href="/#solucoes" onClick={() => setMobileOpen(false)}>Soluções</a>
              <Link to="/sobre-nos" onClick={() => setMobileOpen(false)}>Sobre Nós</Link>
              <a href="/#suporte" onClick={() => setMobileOpen(false)}>Suporte</a>
            </div>
          </div>
        )}
      </header>

      <section className="bg-gradient-to-br from-[#020234] to-[#04176b] text-white py-16">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Sobre a Webside Sistemas</h1>
          <p className="mt-4 text-white/85">Desde 2011 transformando a gestão de postos com tecnologia, consultoria e suporte especializado.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-3 gap-6">
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-bold">🎯 Missão</h2>
            <p className="mt-3 text-[#020234]/75">Oferecer a melhor experiência em tecnologia para otimizar a gestão de postos, promovendo transparência e controle completo.</p>
          </article>
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-bold">🔭 Visão</h2>
            <p className="mt-3 text-[#020234]/75">Ser a mais confiável parceira tecnológica do setor de postos no Brasil.</p>
          </article>
          <article className="rounded-xl border p-6">
            <h2 className="text-2xl font-bold">💎 Valores</h2>
            <p className="mt-3 text-[#020234]/75">Transparência, excelência, inovação, comprometimento e respeito às pessoas.</p>
          </article>
        </div>
      </section>

      <section className="py-10 bg-[#f0f4f8]">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold mb-6">Trajetória</h2>
          <div className="space-y-4 border-l-2 border-[#04A6F9] pl-6">
            <div><strong>2011</strong> — Fundação da Webside Sistemas</div>
            <div><strong>🚀</strong> — Expansão com abertura das filiais MG, SP e GO</div>
            <div><strong>🤝</strong> — Parceria estratégica com o WebPosto</div>
            <div><strong>⭐</strong> — Mais de 14 anos e referência no setor</div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-[#020234] text-white p-6 text-center"><p className="text-3xl font-bold text-[#04A6F9]">+14</p><p>Anos de experiência</p></div>
          <div className="rounded-xl bg-[#020234] text-white p-6 text-center"><p className="text-3xl font-bold text-[#04A6F9]">3</p><p>Filiais no Brasil</p></div>
          <div className="rounded-xl bg-[#020234] text-white p-6 text-center"><p className="text-3xl font-bold text-[#04A6F9]">+20</p><p>Módulos WebPosto</p></div>
          <div className="rounded-xl bg-[#020234] text-white p-6 text-center"><p className="text-3xl font-bold text-[#04A6F9]">100%</p><p>Foco em resultados</p></div>
        </div>
      </section>

      <section className="py-10">
        <div className="mx-auto max-w-3xl px-4 text-center text-[#020234]/80 leading-relaxed">
          <p>
            Desde 2011 atuando no setor de postos de combustíveis, a Webside Sistemas se consolidou com o propósito de oferecer a melhor experiência em tecnologia para otimizar a gestão, promovendo transparência, soluções eficazes e controle completo.
          </p>
          <p className="mt-5">
            Contamos com uma equipe de especialistas altamente capacitados em implementação, treinamento, consultoria e suporte. Combinamos conhecimento técnico e habilidades avançadas para entregar soluções personalizadas ao revendedor de postos de combustíveis.
          </p>
          <p className="mt-5">
            Nossa paixão e dedicação transformam desafios em conquistas, impulsionando o crescimento e a inovação no setor.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#f0f4f8]">
        <div className="mx-auto max-w-7xl px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Valores da Empresa</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["🎯 Foco em Resultado", "🤝 Parceria Genuína", "🔍 Transparência", "💡 Inovação", "🎓 Capacitação", "🛡️ Confiabilidade"].map((v) => (
              <div key={v} className="rounded-xl border bg-white p-5 text-center hover:bg-[#020234] hover:text-white transition">{v}</div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/#contato" className="inline-block rounded-full bg-[#04A6F9] px-6 py-3 font-semibold text-white">Fale com um Especialista</Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#020234] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-2xl font-bold"><span>WEB</span><span className="text-[#04A6F9]">SIDE</span></h4>
            <p className="mt-3 text-white/80">Especialistas em tecnologia para postos de combustíveis.</p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/websidesistemas/" target="_blank" rel="noreferrer"><Instagram /></a>
              <a href="https://www.facebook.com/websidesistemas" target="_blank" rel="noreferrer"><Facebook /></a>
              <a href="https://www.linkedin.com/company/websidesistemas" target="_blank" rel="noreferrer"><Linkedin /></a>
              <a href="https://wa.me/5534992990408?text=Venho%20pelo%20site%2C%20quero%20saber%20mais" target="_blank" rel="noreferrer"><MessageCircle /></a>
            </div>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Navegação</h5>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/">Home</Link></li>
              <li><a href="/#solucoes">Soluções</a></li>
              <li><Link to="/sobre-nos">Sobre Nós</Link></li>
              <li><a href="/#suporte">Suporte</a></li>
              <li><a href="/#contato">Contato</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Soluções</h5>
            <ul className="space-y-2 text-white/80">
              <li>WP PDV</li><li>WP Mobile</li><li>WP Frota</li><li>WP Dashboard</li><li>WP PIX</li><li>WP I.A</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold mb-3">Filiais + Legal</h5>
            <ul className="space-y-2 text-white/80">
              <li><a href={maps.mg} target="_blank" rel="noreferrer">📍 Filial Minas Gerais</a></li>
              <li><a href={maps.sp} target="_blank" rel="noreferrer">📍 Filial São Paulo</a></li>
              <li><a href={maps.go} target="_blank" rel="noreferrer">📍 Filial Goiás</a></li>
              <li><Link to="/politica-de-privacidade">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center py-5 border-t border-white/10 text-sm text-white/70">
          Copyright © 2011-2026 | Webside Consultoria e Sistemas Ltda — Todos os direitos reservados — CNPJ: 35.277.090/0001-47
        </div>
      </footer>
    </div>
  );
}
