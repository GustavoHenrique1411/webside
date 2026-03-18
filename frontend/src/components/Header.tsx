import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, MessageCircle, Phone } from "lucide-react";

interface HeaderProps {
  scrolled?: boolean;
  onAnchorClick?: (href: string) => void;
}

export default function Header({ scrolled = false, onAnchorClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [solucoesOpen, setSolucoesOpen] = useState(false);
  const [showSupportCard, setShowSupportCard] = useState(false);

  const mobileRef = useRef<HTMLDivElement>(null);
  const solucoesRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (mobileOpen && mobileRef.current && !mobileRef.current.contains(event.target as Node)) {
      setMobileOpen(false);
    }
    if (solucoesOpen && solucoesRef.current && !solucoesRef.current.contains(event.target as Node)) {
      setSolucoesOpen(false);
    }
    if (showSupportCard && supportRef.current && !supportRef.current.contains(event.target as Node)) {
      setShowSupportCard(false);
    }
  }, [mobileOpen, solucoesOpen, showSupportCard]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleAnchorClick = (href: string) => {
    onAnchorClick?.(href);
    setMobileOpen(false);
  };

  const whatsappSuporte = "https://wa.me/5534992990408?text=Venho%20pelo%20site%2C%20preciso%20de%20ajuda";

  const handleSolutionClick = (path: string) => {
    window.location.href = path;
    setSolucoesOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 bg-[#020234] ${scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.35)]" : "shadow-sm"}`}>
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <Link to="/" aria-label="Ir para Home">
          <img src="/webside-logo-cabecalho.png" alt="Logo Webside Sistemas" className="h-6 w-auto object-contain" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-white">
          <button className="hover:underline" onClick={() => window.location.href = '/'}>Home</button>
          <div className="relative">
            <button 
              className="flex items-center gap-1 hover:underline cursor-pointer" 
              onClick={() => setSolucoesOpen(!solucoesOpen)}
            >
              Soluções webPosto
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${solucoesOpen ? 'rotate-180' : ''}`} />
            </button>
            {solucoesOpen && (
              <div ref={solucoesRef} className="absolute top-full left-0 mt-2 w-screen max-w-6xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-50 overflow-hidden ml-[-50%] left-1/2 -translate-x-1/2 animate-in fade-in zoom-in duration-200 slide-in-from-top-2">
                <div className="p-8 grid md:grid-cols-4 gap-8 max-h-96 overflow-y-auto">

                  <div className="group md:col-span-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-blue-500">Pista</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer text-gray-800 group-hover:-translate-y-1">
                        <button onClick={() => handleSolutionClick('/wp-pdv')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">⛽</span>
                          <span>WP PDV</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-pay')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🏎️</span>
                          <span>WP PAY</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-autoatendimento')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🤖</span>
                          <span>WP Autoatendimento</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-id')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🔍</span>
                          <span>WP ID</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="group md:col-span-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-emerald-500">Conveniência</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-conveniencia')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🛒</span>
                          <span>WP Conveniência</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-contagem')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">📦</span>
                          <span>WP Contagem</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-pdv-android')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">📱</span>
                          <span>WP PDV Android</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-freezer')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🧊</span>
                          <span>WP Freezer</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="group md:col-span-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-purple-500">Gestão</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-gerencial')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">📊</span>
                          <span>WP Gerencial</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-dashboard-bi')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">📈</span>
                          <span>WP Dashboard & BI</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-frota')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🚛</span>
                          <span>WP Frota</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-faturamento')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">📄</span>
                          <span>WP Faturamento</span>
                        </button>
                      </li>
                      <li className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 transition-all duration-200 cursor-pointer text-gray-800">
                        <button onClick={() => handleSolutionClick('/wp-conciliacao')} className="flex items-center gap-3 w-full h-full p-0 border-none bg-transparent text-left">
                          <span className="text-2xl flex-shrink-0">🔄</span>
                          <span>WP Conciliação</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div className="md:col-span-1 bg-gradient-to-br from-[#020234] to-[#04176b] rounded-2xl p-6 border border-[#04A6F9] text-white">
                    <div className="text-3xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold mb-3">Lançamento: WP ID</h3>
                    <p className="text-sm mb-4 opacity-90">Identifica placa, reconhece combustível correto, bloqueia erros. Nosso novo destaque!</p>
                    <button onClick={() => handleSolutionClick('/wp-id')} className="w-full rounded-lg bg-[#04A6F9] text-white py-2 font-semibold hover:bg-[#0284c7]">
                      Saiba Mais
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="hover:underline" onClick={() => handleAnchorClick("#sobre")}>Sobre Nós</button>
          <div className="relative ml-auto">
            <button 
              className="flex items-center gap-1 hover:underline cursor-pointer" 
              onClick={() => setShowSupportCard(!showSupportCard)}
            >
              Contatos
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showSupportCard ? 'rotate-180' : ''}`} />
            </button>
            {showSupportCard && (
              <div ref={supportRef} className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl p-4 text-[#020234]">
                <div className="space-y-3">
                  <a href={whatsappSuporte} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-[#25d366] text-white hover:bg-[#20bd5a] transition-colors">
                    <MessageCircle size={20} />
                    <div>
                      <p className="font-semibold">WhatsApp Suporte</p>
                      <p className="text-sm opacity-90">(34) 99299-0408</p>
                    </div>
                  </a>
                  <button 
                    onClick={() => { setShowSupportCard(false); handleAnchorClick("#suporte"); }} 
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#04A6F9] text-white hover:bg-[#0284c7] transition-colors"
                  >
                    <Phone size={20} />
                    <div className="text-left">
                      <p className="font-semibold">Mais contatos</p>
                      <p className="text-sm opacity-90">Suporte, telefones e chat</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => handleAnchorClick("#contato")}
            className="rounded-full bg-[#04A6F9] px-5 py-2 ml-2 hover:bg-[#0284c7] transition-colors"
          >
            Fale com Especialista
          </button>
        </nav>
        <button className="md:hidden text-white p-2" onClick={() => setMobileOpen((v) => !v)} aria-label="Abrir menu">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {mobileOpen && (
        <div ref={mobileRef} className="md:hidden px-4 pb-4 text-white bg-[#020234] border-t border-white/10">
          <div className="flex flex-col gap-2 pt-3">
            <button className="text-left py-2" onClick={() => window.location.href = '/'}>Home</button>
            <button onClick={() => handleAnchorClick("#solucoes")} className="py-2">Soluções webPosto</button>
            <button className="py-2" onClick={() => handleAnchorClick("#sobre")}>Sobre Nós</button>
            <button onClick={() => handleAnchorClick("#suporte")} className="text-left py-2">Suporte</button>
            <button onClick={() => handleAnchorClick("#suporte")} className="py-2 text-[#04A6F9]">Contatos Suporte</button>
            <button onClick={() => handleAnchorClick("#contato")} className="rounded-full bg-[#04A6F9] px-4 py-2 mt-2">Fale com Especialista</button>
          </div>
        </div>
      )}
    </header>
  );
}

