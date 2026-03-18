import { Facebook, Instagram, Linkedin, Menu, MessageCircle, X, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const maps = {
  mg: "https://maps.app.goo.gl/1S21EcYTbVNEjmji7",
  sp: "https://maps.app.goo.gl/9ADGAFwHmsJ9DT997",
  go: "https://maps.app.goo.gl/1GwBqHWqea23T9Vt8",
};

const whatsappSuporte = "https://wa.me/5534992990408?text=Venho%20pelo%20site%2C%20preciso%20de%20ajuda";

const phones = {
  mg: "(034) 3199-9131",
  sp: "(011) 5199-6177",
  go: "(062) 3602-2258",
  whatsapp: "(34) 99299-0408",
};

export default function ContatosSuporte() {
  const [mobileOpen, setMobileOpen] = useState(false);

// Function to open chat - Opens helpdesk page in new tab



  return (
    <div className="min-h-screen text-[#020234] bg-white">
      <header className="sticky top-0 z-50 shadow-sm bg-[#020234]">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" aria-label="Ir para Home">
            <img src="/webside-logo-cabecalho.png" alt="Logo Webside Sistemas" className="h-6 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-white">
            <Link to="/" className="hover:text-[#04A6F9]">Home</Link>
            <Link to="/#solucoes" className="hover:text-[#04A6F9]">Soluções</Link>
            <Link to="/sobre-nos" className="hover:text-[#04A6F9]">Sobre Nós</Link>
            <Link to="/contatos-suporte" className="text-[#04A6F9] font-semibold">Suporte</Link>
            <Link to="/#contato" className="rounded-full bg-[#04A6F9] px-5 py-2 hover:bg-[#0284c7]">Fale com Especialista</Link>
          </nav>
          <button className="md:hidden text-white p-2" onClick={() => setMobileOpen((v) => !v)} aria-label="Abrir menu">
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 text-white bg-[#020234] border-t border-white/10">
            <div className="flex flex-col gap-2 pt-3">
              <Link to="/" onClick={() => setMobileOpen(false)} className="text-left py-2">Home</Link>
              <Link to="/#solucoes" onClick={() => setMobileOpen(false)} className="text-left py-2">Soluções</Link>
              <Link to="/sobre-nos" onClick={() => setMobileOpen(false)} className="text-left py-2">Sobre Nós</Link>
              <Link to="/contatos-suporte" onClick={() => setMobileOpen(false)} className="text-left py-2 text-[#04A6F9]">Suporte</Link>
              <Link to="/#contato" onClick={() => setMobileOpen(false)} className="rounded-full bg-[#04A6F9] px-4 py-2 mt-2">Fale com Especialista</Link>
            </div>
          </div>
        )}
      </header>

      <main className="py-16 bg-gradient-to-br from-[#020234] to-[#04176b] min-h-[calc(100vh-80px)]">
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-block rounded-full border border-[#04A6F9] px-4 py-1 text-sm text-white">Suporte Webside</span>
            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold text-white">Contatos de Suporte</h1>
            <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
              Entre em contato conosco através dos canais abaixo. Nossa equipe está pronta para atendê-lo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* WhatsApp */}
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

            {/* Chat Online */}
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

          {/* Telefones Fixos */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Telefones Fixos</h2>
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

          {/* Filiais */}
          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Filiais WEBSIDE em 3 estados - Clique para ver no mapa</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <a 
                href={maps.mg}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl bg-white p-5 text-[#020234] hover:bg-[#f0f4f8] transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={24} className="text-[#04A6F9]" />
                  <div>
                    <h3 className="font-bold">Minas Gerais</h3>
                    <p className="text-sm text-[#020234]/70">Ver no mapa</p>
                  </div>
                </div>
              </a>
              <a 
                href={maps.sp}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl bg-white p-5 text-[#020234] hover:bg-[#f0f4f8] transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={24} className="text-[#04A6F9]" />
                  <div>
                    <h3 className="font-bold">São Paulo</h3>
                    <p className="text-sm text-[#020234]/70">Ver no mapa</p>
                  </div>
                </div>
              </a>
              <a 
                href={maps.go}
                target="_blank"
                rel="noreferrer"
                className="group rounded-xl bg-white p-5 text-[#020234] hover:bg-[#f0f4f8] transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <MapPin size={24} className="text-[#04A6F9]" />
                  <div>
                    <h3 className="font-bold">Goiás</h3>
                    <p className="text-sm text-[#020234]/70">Ver no mapa</p>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link 
              to="/"
              className="inline-block rounded-full border border-white/30 text-white px-6 py-3 hover:bg-white/10 transition-colors"
            >
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-[#020234] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 grid md:grid-cols-4 gap-8">
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
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#solucoes">Soluções</Link></li>
              <li><Link to="/sobre-nos">Sobre Nós</Link></li>
              <li><Link to="/contatos-suporte">Suporte</Link></li>
              <li><Link to="/#contato">Contato</Link></li>
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
            <h5 className="font-semibold mb-3">Filiais</h5>
            <ul className="space-y-2 text-white/85">
              <li><a target="_blank" rel="noreferrer" href={maps.mg}>📍 Filial Minas Gerais</a></li>
              <li><a target="_blank" rel="noreferrer" href={maps.sp}>📍 Filial São Paulo</a></li>
              <li><a target="_blank" rel="noreferrer" href={maps.go}>📍 Filial Goiás</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center py-5 border-t border-white/10 text-sm text-white/70">
          Copyright © 2011-2026 | Webside Consultoria e Sistemas Ltda — Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}

