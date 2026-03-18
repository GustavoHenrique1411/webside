import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Menu, MessageCircle, X, Shield, Database, Mail, FileText, Cookie, Lock, UserCheck, Globe, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const maps = {
  mg: "https://maps.app.goo.gl/1S21EcYTbVNEjmji7",
  sp: "https://maps.app.goo.gl/9ADGAFwHmsJ9DT997",
  go: "https://maps.app.goo.gl/1GwBqHWqea23T9Vt8",
};

const whatsappLink = "https://wa.me/5534992990408?text=Venho%20pelo%20site%2C%20tenho%20uma%20dúvida%20sobre%20privacidade";

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

  return (
    <div className="min-h-screen bg-white text-[#020234]">
      <header className="sticky top-0 z-50 bg-[#020234] text-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/">
            <img src="/webside-logo-cabecalho.png" alt="Webside Sistemas" className="h-6 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/">Home</Link>
            <Link to="/#solucoes">Soluções</Link>
            <Link to="/sobre-nos">Sobre Nós</Link>
            <Link to="/#suporte">Suporte</Link>
            <Link to="/#contato" className="rounded-full bg-[#04A6F9] px-5 py-2">Fale com Especialista</Link>
          </nav>
          <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}>{mobileOpen ? <X /> : <Menu />}</button>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-4 pb-4 bg-[#020234] border-t border-white/10">
            <div className="flex flex-col gap-2 pt-3">
              <Link to="/" className="py-2">Home</Link>
              <Link to="/#solucoes" className="py-2">Soluções</Link>
              <Link to="/sobre-nos" className="py-2">Sobre Nós</Link>
              <Link to="/#suporte" className="py-2">Suporte</Link>
              <Link to="/#contato" className="py-2 text-[#04A6F9]">Contato</Link>
            </div>
          </div>
        )}
      </header>

      <section className="bg-gradient-to-br from-[#020234] to-[#04176b] text-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-[#04A6F9]" />
          <h1 className="text-4xl md:text-5xl font-bold">Política de Privacidade</h1>
          <p className="mt-4 text-white/85 text-lg">Compromisso com a proteção dos seus dados pessoais em conformidade com a LGPD.</p>
          <p className="mt-2 text-white/60 text-sm">Última atualização: Janeiro de 2025</p>
        </div>
      </section>

      <main className="mx-auto max-w-4xl px-4 py-12 space-y-6">
        {/* Seção 1: Quem Somos */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">1. Quem somos</h2>
          </div>
          <div className="space-y-2 text-[#020234]/80">
            <p><strong>Razão Social:</strong> WEBSIDE CONSULTORIA E SISTEMAS LTDA</p>
            <p><strong>CNPJ:</strong> 35.277.090/0001-47</p>
            <p><strong>Endereço:</strong> Rua Calimério Guimarães, 302 — Centro — Araxá/MG — CEP: 38183-184</p>
            <p><strong>DPO (Encarregado de Dados):</strong> Bruno Tardelli</p>
            <p><strong>E-mail:</strong> ouvidoria@websidesistemas.com.br</p>
          </div>
        </section>

        {/* Seção 2: Dados Coletados */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">2. Quais dados coletamos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#f0f4f8] rounded-xl p-4">
              <h3 className="font-semibold text-[#020234] mb-2">📝 Fornecidos por você</h3>
              <ul className="space-y-1 text-[#020234]/75 text-sm">
                <li>• Nome completo</li>
                <li>• Endereço de e-mail</li>
                <li>• Telefone/WhatsApp</li>
                <li>• Nome da empresa</li>
                <li>• Cargo</li>
                <li>• Dados de formulários</li>
              </ul>
            </div>
            <div className="bg-[#f0f4f8] rounded-xl p-4">
              <h3 className="font-semibold text-[#020234] mb-2">🤖 Coletados automaticamente</h3>
              <ul className="space-y-1 text-[#020234]/75 text-sm">
                <li>• Endereço IP</li>
                <li>• Tipo de navegador</li>
                <li>• Dispositivo utilizado</li>
                <li>• Páginas visitadas</li>
                <li>• Cookies e tecnologias similares</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Seção 3: Para que utilizamos */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">3. Para que utilizamos</h2>
          </div>
          <ul className="space-y-3 text-[#020234]/80">
            <li className="flex items-start gap-2">
              <span className="text-[#04A6F9] font-bold">✓</span>
              <span>Responder contatos e agendar demonstrações</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#04A6F9] font-bold">✓</span>
              <span>Enviar comunicações (com opt-out garantido)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#04A6F9] font-bold">✓</span>
              <span>Melhorar experiência e análises estatísticas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#04A6F9] font-bold">✓</span>
              <span>Cumprir obrigações legais</span>
            </li>
          </ul>
        </section>

        {/* Seção 4: Base Legal */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">4. Base legal (LGPD)</h2>
          </div>
          <p className="text-[#020234]/75 mb-4">Processamos seus dados com base nas seguintes hipóteses legais previstas na Lei Geral de Proteção de Dados (Lei nº 13.709/2018):</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">
              <strong>Art. 7º, V</strong> — Contrato preliminar
            </div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">
              <strong>Art. 7º, I</strong> — Consentimento do titular
            </div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">
              <strong>Art. 7º, IX</strong> — Legítimo interesse
            </div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">
              <strong>Art. 7º, II</strong> — Obrigação legal
            </div>
          </div>
        </section>

        {/* Seção 5: Compartilhamento */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">5. Compartilhamento</h2>
          </div>
          <p className="text-[#020234]/80 mb-3">Seus dados poderão ser compartilhados com:</p>
          <ul className="space-y-2 text-[#020234]/75">
            <li className="flex items-center gap-2">🏢 <strong>Hospedagem</strong> — infraestrutura do site</li>
            <li className="flex items-center gap-2">📊 <strong>Google Analytics</strong> — análise de acesso</li>
            <li className="flex items-center gap-2">📱 <strong>Parceiros</strong> — como operadores de postos</li>
            <li className="flex items-center gap-2">📧 <strong>Marketing</strong> — ferramentas de comunicação</li>
          </ul>
        </section>

        {/* Seção 6: Cookies */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Cookie className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">6. Cookies</h2>
          </div>
          <p className="text-[#020234]/80 mb-4">Utilizamos cookies para melhorar sua experiência de navegação. Você pode gerenciar ou desativar os cookies nas configurações do seu navegador.</p>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-center">
              <strong className="block text-[#04A6F9]">🍪 Necessários</strong>
              <span className="text-xs text-[#020234]/60">Funcionamento básico</span>
            </div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-center">
              <strong className="block text-[#04A6F9]">📈 Desempenho</strong>
              <span className="text-xs text-[#020234]/60">Análise de acesso</span>
            </div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-center">
              <strong className="block text-[#04A6F9]">🎯 Personalização</strong>
              <span className="text-xs text-[#020234]/60">Conteúdo adequado</span>
            </div>
          </div>
        </section>

        {/* Seção 7: Armazenamento */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">7. Armazenamento e segurança</h2>
          </div>
          <p className="text-[#020234]/80">
            Os dados são armazenados em conformidade com o <strong>Art. 16 da LGPD</strong>, pelo período necessário para cumprir as finalidades descritas nesta política. 
            Implementamos medidas de segurança técnicas e administrativas para proteger seus dados contra acesso não autorizado.
          </p>
        </section>

        {/* Seção 8: Direitos do Titular */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">8. Direitos do titular</h2>
          </div>
          <p className="text-[#020234]/80 mb-4">Você tem os seguintes direitos garantidos pela LGPD:</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Confirmação de tratamento</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Acesso aos dados</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Correção de dados</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Anonimização</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Portabilidade</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Eliminação</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Revogação do consentimento</div>
            <div className="bg-[#f0f4f8] rounded-lg p-3 text-sm">✓ Informação sobre compartilhamento</div>
          </div>
          <div className="mt-4 bg-[#04A6F9]/10 rounded-lg p-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#04A6F9]" />
            <span className="text-[#020234]/80"><strong>Prazo de resposta:</strong> até 15 dias (conforme Art. 19 da LGPD)</span>
          </div>
        </section>

        {/* Seção 9: Transferência Internacional */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">9. Transferência internacional</h2>
          </div>
          <p className="text-[#020234]/80">
            Eventualmente, seus dados podem ser transferidos para servidores fora do Brasil. 
            Nesse caso, garantimos que a transferência ocorre em conformidade com a LGPD, 
            utilizando cláusulas contratuais padrão ou outros mecanismos de transferência previstos em lei.
          </p>
        </section>

        {/* Seção 10: Alterações */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#04A6F9]" />
            </div>
            <h2 className="text-2xl font-bold text-[#020234]">10. Alterações</h2>
          </div>
          <p className="text-[#020234]/80">
            Política atualizada periodicamente. Recomendamos que você revise esta política regularmente.
          </p>
          <div className="mt-4 bg-[#f0f4f8] rounded-lg p-3 text-sm">
            ⚠️ <strong>Nota:</strong> Este site não é destinado a menores de 18 anos.
          </div>
        </section>

        {/* Seção 11: Contato */}
        <section className="bg-gradient-to-br from-[#020234] to-[#04176b] rounded-2xl p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">11. Contato</h2>
          </div>
          <p className="text-white/80 mb-6">Tem dúvidas sobre como tratamos seus dados? Entre em contato conosco:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <Mail className="w-6 h-6 text-[#04A6F9] mb-2" />
              <p className="font-semibold">E-mail</p>
              <p className="text-white/80">fale-conosco@websidesistemas.com.br</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <Globe className="w-6 h-6 text-[#04A6F9] mb-2" />
              <p className="font-semibold">Website</p>
              <p className="text-white/80">www.websidesistemas.com.br</p>
            </div>
          </div>
          <div className="mt-6">
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25d366] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-[#020234] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-8">
          <div>
            <img src="/webside-logo-rodape.png" alt="Webside Sistemas" className="h-11 w-auto" />
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
<li><a href="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</a></li>
        </div>
        <div className="text-center py-5 border-t border-white/10 text-sm text-white/70">Copyright © 2011-2026 | Webside Consultoria e Sistemas Ltda — Todos os direitos reservados — CNPJ: 35.277.090/0001-47</div>
      </footer>
    </div>
  );
}

