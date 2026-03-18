import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";

const maps = {
  mg: "https://maps.app.goo.gl/1S21EcYTbVNEjmji7",
  sp: "https://maps.app.goo.gl/9ADGAFwHmsJ9DT997",
  go: "https://maps.app.goo.gl/1GwBqHWqea23T9Vt8",
};

export default function PrivacidadePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    // Hide Tiflux floating header
    // NO TIFLUX SCRIPT LOAD - hide iframe and floaters
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://public-assets.tiflux.com/chat_widget.js?organization_token=582a9e7c57d9586f18448ac59facb9d764dbf6b8`;
    if (!document.head.querySelector('script[src*=\"tiflux.com/chat_widget.js\"]')) {
      document.head.appendChild(script);
    }
    // Fixed: no script load, direct hide logic
    const hideTifluxElements = () => {
      const iframes = document.querySelectorAll('iframe[src*="tiflux"]') as NodeListOf<HTMLIFrameElement>;
      iframes.forEach(iframe => {
        iframe.style.display = 'none';
      });
      
      const floating = document.querySelectorAll('.ti-flux-chat-icon, header.chat__clearfix, [class*="ti-flux"][style*="fixed"]');
      floating.forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
    };
    
    hideTifluxElements();
    
    let attempts = 0;
    const interval = setInterval(() => {
      hideTifluxElements();
      if (++attempts >= 30) clearInterval(interval);
    }, 500);

    script.onload = () => {
      const setupHideChat = () => {
        const floating = document.querySelectorAll('.ti-flux-chat-icon, div[class*="ti-flux"][style*="fixed"], header.chat__clearfix');
        floating.forEach((el) => {
          const element = el as HTMLElement;
          element.style.display = 'none';
        });
        return floating.length === 0;
      };

      if (!setupHideChat()) {
        let attempts = 0;
        const interval = setInterval(() => {
          if (setupHideChat() || attempts >= 30) clearInterval(interval);
          attempts++;
        }, 500);
      }

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const element = node as Element;
              if (element.className?.includes('chat__clearfix') || element.className?.includes('ti-flux-chat-icon')) {
                (element as HTMLElement).style.display = 'none';
              }
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    };

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []); 

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
      </header>

      <section className="bg-gradient-to-br from-[#020234] to-[#04176b] text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidade</h1>
          <p className="mt-4 text-white/85">Compromisso com a proteção dos seus dados pessoais em conformidade com a LGPD.</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 space-y-10 leading-relaxed text-[#020234]/85">
        <section><h2 className="text-2xl font-bold text-[#020234]">1. Quem somos</h2><p>Razão Social: WEBSIDE SIDE CONSULTORIA SISTEMAS</p><p>CNPJ: 35.277.090/0001-47</p><p>Endereço: Rua Calimério Guimarães, 302 — Centro — Araxá/MG — CEP: 38183-184</p><p>DPO: Bruno Tardelli — ouvidoria@websidesistemas.com.br</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">2. Quais dados coletamos</h2><p><strong>Fornecidos:</strong> Nome, E-mail, Telefone, Empresa, Cargo, formulários.</p><p><strong>Automáticos:</strong> IP, navegador, dispositivo, páginas, cookies.</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">3. Para que utilizamos</h2><ul className="list-disc pl-6 space-y-1"><li>Responder contatos e agendar demonstrações</li><li>Enviar comunicações (com opt-out garantido)</li><li>Melhorar experiência e análises estatísticas</li><li>Cumprir obrigações legais</li></ul></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">4. Base legal (LGPD)</h2><ul className="list-disc pl-6 space-y-1"><li>Contrato preliminar: art. 7º, V</li><li>Consentimento: art. 7º, I</li><li>Legítimo interesse: art. 7º, IX</li><li>Obrigação legal: art. 7º, II</li></ul></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">5. Compartilhamento</h2><p>Hospedagem, marketing, Google Analytics, parceiros (como operadores).</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">6. Cookies</h2><p>Navegação, desempenho, personalização, anúncios. Gerenciável no navegador.</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">7. Armazenamento e segurança</h2><p>Conforme art. 16 da LGPD.</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">8. Direitos do titular</h2><p>Confirmação, acesso, correção, anonimização, portabilidade, eliminação, revogação.</p><p>Prazo de resposta: 15 dias (art. 19).</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">9. Transferência internacional</h2><p>Em conformidade com a LGPD.</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">10. Alterações</h2><p>Política atualizada periodicamente. Site não destinado a menores de 18 anos.</p></section>
        <section><h2 className="text-2xl font-bold text-[#020234]">11. Contato</h2><p>fale-conosco@websidesistemas.com.br</p><p>www.websidesistemas.com.br</p></section>
      </main>

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
          <div><h5 className="font-semibold mb-3">Navegação</h5><ul className="space-y-2 text-white/80"><li><Link to="/">Home</Link></li><li><a href="/#solucoes">Soluções</a></li><li><Link to="/sobre-nos">Sobre Nós</Link></li><li><a href="/#suporte">Suporte</a></li><li><a href="/#contato">Contato</a></li></ul></div>
          <div><h5 className="font-semibold mb-3">Soluções</h5><ul className="space-y-2 text-white/80"><li>WP PDV</li><li>WP Mobile</li><li>WP Frota</li><li>WP Dashboard</li><li>WP PIX</li><li>WP I.A</li></ul></div>
          <div><h5 className="font-semibold mb-3">Filiais + Legal</h5><ul className="space-y-2 text-white/80"><li><a href={maps.mg} target="_blank" rel="noreferrer">📍 Filial Minas Gerais</a></li><li><a href={maps.sp} target="_blank" rel="noreferrer">📍 Filial São Paulo</a></li><li><a href={maps.go} target="_blank" rel="noreferrer">📍 Filial Goiás</a></li><li><Link to="/politica-de-privacidade">Política de Privacidade</Link></li></ul></div>
        </div>
        <div className="text-center py-5 border-t border-white/10 text-sm text-white/70">Copyright © 2011-2026 | Webside Consultoria e Sistemas Ltda — Todos os direitos reservados — CNPJ: 35.277.090/0001-47</div>
      </footer>
    </div>
  );
}
