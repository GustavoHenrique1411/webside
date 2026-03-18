import React, { useState } from 'react';
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, MessageCircle, Star, Users, Award, MapPin, Rocket, Handshake, Eye, Shield, TrendingUp, Target, X } from "lucide-react";

const maps = {
  mg: "https://maps.app.goo.gl/1S21EcYTbVNEjmji7",
  sp: "https://maps.app.goo.gl/9ADGAFwHmsJ9DT997",
  go: "https://maps.app.goo.gl/1GwBqHWqea23T9Vt8",
};

const historyContent = `A Webside Sistemas nasceu com o propósito de transformar a gestão de postos de combustíveis por meio da tecnologia. Atuamos para oferecer soluções eficazes, promover transparência e garantir controle completo, sempre com foco em proporcionar a melhor experiência ao revendedor.

Nosso CEO, Bruno Tardelli, iniciou sua trajetória na gestão de postos de combustíveis em Minas Gerais. Em 2009, foi convidado a atuar no setor de suporte a empresas, graças ao conhecimento adquirido no uso de ferramentas de gestão. Essa experiência revelou uma realidade importante: embora os sistemas estivessem disponíveis, muitas vezes a informação não chegava de forma clara ao operador de posto, que não conseguia aproveitar todo o potencial das soluções contratadas.

Dessa percepção nasceu a Webside Consultoria e Sistemas, com o sistema WEBPOSTO. A empresa foi criada para identificar necessidades reais e apresentar soluções práticas, desenvolvidas por quem entende o dia a dia do operador de posto e domina a tecnologia de gestão.

Com o tempo, reunimos uma equipe de especialistas altamente capacitados, que combinam conhecimento prático e técnico em implementação, treinamento, consultoria e suporte. Essa união de experiência e dedicação nos permite entregar soluções personalizadas, que impulsionam o crescimento e a inovação no setor de combustíveis.

Na Webside Sistemas, acreditamos que desafios são oportunidades. Nossa paixão pela tecnologia e pelo setor nos motiva a transformar obstáculos em conquistas, sempre com o objetivo de fortalecer o revendedor e elevar o padrão de gestão de postos de combustíveis no Brasil.

Vamos crescer juntos?`;

const whatsappComercial = "https://wa.me/5511988934345?text=Venho%20pelo%20site%2C%20quero%20saber%20mais%20e%20tenho%20um%20CUPOM%20DESCONTO%20WSSITE17031987";

export default function SobreNosPage() {
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#020234]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#020234] to-[#04176b] text-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#04A6F9]/20 flex items-center justify-center">
              <Star className="w-10 h-10 text-[#04A6F9]" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Sobre a Webside Sistemas</h1>
          <p className="mt-4 text-white/85 text-lg max-w-2xl mx-auto">Desde 2011 transformando a gestão de postos de combustíveis com tecnologia, consultoria e suporte especializado.</p>
<p className="mt-2 text-[#04A6F9] font-semibold">Software líder de mercado | +15 anos de experiência</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-10">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-[#020234] text-white p-6 text-center shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#04A6F9]/20 flex items-center justify-center">
                <Award className="w-7 h-7 text-[#04A6F9]" />
              </div>
              <p className="text-4xl font-bold text-[#04A6F9]">+14</p>
              <p className="text-white/80">Anos de experiência</p>
            </div>
            <div className="rounded-2xl bg-[#020234] text-white p-6 text-center shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#04A6F9]/20 flex items-center justify-center">
                <Award className="w-7 h-7 text-[#04A6F9]" />
              </div>
              <p className="text-4xl font-bold text-[#04A6F9]">+500</p>
              <p className="text-white/80">Cases de sucesso</p>
            </div>
            <div className="rounded-2xl bg-[#020234] text-white p-6 text-center shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#04A6F9]/20 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-[#04A6F9]" />
              </div>
              <p className="text-4xl font-bold text-[#04A6F9]">3</p>
              <p className="text-white/80">Filiais no Brasil</p>
            </div>
            <div className="rounded-2xl bg-[#020234] text-white p-6 text-center shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#04A6F9]/20 flex items-center justify-center">
                <Users className="w-7 h-7 text-[#04A6F9]" />
              </div>
              <p className="text-4xl font-bold text-[#04A6F9]">+500</p>
              <p className="text-white/80">Clientes atendidos</p>
            </div>
            <div className="rounded-2xl bg-[#020234] text-white p-6 text-center shadow-xl">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#04A6F9]/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-[#04A6F9]" />
              </div>
              <p className="text-4xl font-bold text-[#04A6F9]">20%</p>
              <p className="text-white/80">Postos usam WebPosto</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block rounded-full bg-[#04A6F9]/10 text-[#0284c7] px-3 py-1 text-sm font-medium">Sobre Nós</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">Quem é a Webside Sistemas?</h2>
            <p className="mt-4 text-[#020234]/75 text-lg">Desde 2011 atuando no setor de postos de combustíveis, somos especializados em oferecer a melhor experiência em tecnologia para otimizar a gestão, promovendo transparência, soluções eficazes e controle completo.</p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#04A6F9]" />
                </div>
                <span>Equipe altamente capacitada em implementação e treinamento</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-[#04A6F9]" />
                </div>
                <span>Consultoria especializada no setor de postos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#04A6F9]" />
                </div>
                <span>Soluções personalizadas com foco em resultados reais</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#04A6F9]/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#04A6F9]" />
                </div>
                <span>Parceiro oficial do WebPosto — software líder de mercado</span>
              </div>
            </div>

            <button onClick={() => setShowHistoryModal(true)} className="mt-8 inline-block rounded-full bg-[#020234] text-white px-6 py-3 font-semibold hover:bg-[#04A6F9] transition-colors">
              ✨Conheça Nossa História
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#f0f4f8] p-6 text-center">
              <Rocket className="w-10 h-10 mx-auto mb-2 text-[#04A6F9]" />
              <h3 className="font-bold text-lg">Implementação</h3>
              <p className="text-sm text-[#020234]/70 mt-1">Setup completo e personalizado</p>
            </div>
            <div className="rounded-2xl bg-[#f0f4f8] p-6 text-center">
              <Award className="w-10 h-10 mx-auto mb-2 text-[#04A6F9]" />
              <h3 className="font-bold text-lg">Treinamento</h3>
              <p className="text-sm text-[#020234]/70 mt-1">Capacitação completa</p>
            </div>
            <div className="rounded-2xl bg-[#f0f4f8] p-6 text-center">
              <Eye className="w-10 h-10 mx-auto mb-2 text-[#04A6F9]" />
              <h3 className="font-bold text-lg">Consultoria</h3>
              <p className="text-sm text-[#020234]/70 mt-1">Análise e estratégia</p>
            </div>
            <div className="rounded-2xl bg-[#f0f4f8] p-6 text-center">
              <Shield className="w-10 h-10 mx-auto mb-2 text-[#04A6F9]" />
              <h3 className="font-bold text-lg">Suporte</h3>
              <p className="text-sm text-[#020234]/70 mt-1">Assistência especializada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-[#f0f4f8]">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Nossa Trajetória</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#04A6F9] transform md:-translate-x-1/2"></div>
            
            <div className="relative pl-12 md:pl-0 md:w-1/2 md:ml-auto md:pr-8 mb-8">
              <div className="absolute left-2 md:left-auto md:right-auto md:left-[calc(50%-1rem)] w-4 h-4 rounded-full bg-[#04A6F9] border-4 border-white shadow"></div>
              <div className="bg-white rounded-xl p-5 shadow-lg">
                <span className="text-[#04A6F9] font-bold">2011</span>
                <h3 className="font-bold text-lg mt-1">Fundação</h3>
                <p className="text-sm text-[#020234]/70">Início da jornada com foco em tecnologia para postos</p>
              </div>
            </div>

            <div className="relative pl-12 md:pl-8 md:w-1/2 md:ml-0 mb-8">
              <div className="absolute left-2 md:left-[calc(50%-1rem)] w-4 h-4 rounded-full bg-[#04A6F9] border-4 border-white shadow"></div>
              <div className="bg-white rounded-xl p-5 shadow-lg">
                <span className="text-[#04A6F9] font-bold">2015-2018</span>
                <h3 className="font-bold text-lg mt-1">Expansão</h3>
                <p className="text-sm text-[#020234]/70">Abertura das filiais em MG, SP e GO</p>
              </div>
            </div>

            <div className="relative pl-12 md:pl-0 md:w-1/2 md:ml-auto md:pr-8 mb-8">
              <div className="absolute left-2 md:left-auto md:right-auto md:left-[calc(50%-1rem)] w-4 h-4 rounded-full bg-[#04A6F9] border-4 border-white shadow"></div>
              <div className="bg-white rounded-xl p-5 shadow-lg">
                <span className="text-[#04A6F9] font-bold">2019</span>
                <h3 className="font-bold text-lg mt-1">Parceria WebPosto</h3>
                <p className="text-sm text-[#020234]/70">Aliança estratégica com o software líder de mercado</p>
              </div>
            </div>

            <div className="relative pl-12 md:pl-8 md:w-1/2 md:ml-0">
              <div className="absolute left-2 md:left-[calc(50%-1rem)] w-4 h-4 rounded-full bg-[#04A6F9] border-4 border-white shadow"></div>
              <div className="bg-white rounded-xl p-5 shadow-lg">
                <span className="text-[#04A6F9] font-bold">2025</span>
                <h3 className="font-bold text-lg mt-1">Liderança</h3>
                <p className="text-sm text-[#020234]/70">20% dos postos do Brasil usam WebPosto</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Nossos Valores</h2>
          <p className="text-center text-[#020234]/70 mb-10 max-w-2xl mx-auto">Esses princípios guiam tudo o que fazemos para impactar positivamente o setor de combustíveis.</p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:border-[#04A6F9] transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mb-4 group-hover:bg-[#04A6F9] transition-colors">
                <Target className="w-7 h-7 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Foco em Resultado</h3>
              <p className="text-[#020234]/70 mt-2">Priorizamos soluções que geram impacto real no negócio dos nossos clientes.</p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:border-[#04A6F9] transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mb-4 group-hover:bg-[#04A6F9] transition-colors">
                <Handshake className="w-7 h-7 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Parceria Genuína</h3>
              <p className="text-[#020234]/70 mt-2">Construimos relações de longo prazo baseadas em confiança.</p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:border-[#04A6F9] transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mb-4 group-hover:bg-[#04A6F9] transition-colors">
                <Eye className="w-7 h-7 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Transparência</h3>
              <p className="text-[#020234]/70 mt-2">Praticamos comunicação clara e honesta em todas as etapas.</p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:border-[#04A6F9] transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mb-4 group-hover:bg-[#04A6F9] transition-colors">
                <Rocket className="w-7 h-7 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Inovação</h3>
              <p className="text-[#020234]/70 mt-2">Buscamos sempre as melhores tecnologias para nossos clientes.</p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:border-[#04A6F9] transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mb-4 group-hover:bg-[#04A6F9] transition-colors">
                <Award className="w-7 h-7 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Capacitação</h3>
              <p className="text-[#020234]/70 mt-2">Investimos em treinamento para garantir excelência.</p>
            </div>

            <div className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:border-[#04A6F9] transition-all hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mb-4 group-hover:bg-[#04A6F9] transition-colors">
                <Shield className="w-7 h-7 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Confiabilidade</h3>
              <p className="text-[#020234]/70 mt-2">Compromisso com a segurança e qualidade dos serviços.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filiais */}
      <section className="py-16 bg-[#f0f4f8]">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Filiais WEBSIDE em 3 estados - Clique para ver no mapa</h2>
          <p className="text-center text-[#020234]/70 mb-8">Atendimento presencial em 3 estados brasileiros</p>
          <div className="grid md:grid-cols-3 gap-6">
            <a href={maps.mg} target="_blank" rel="noreferrer" className="group rounded-2xl bg-white p-6 text-center hover:bg-[#020234] hover:text-white transition-all shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#04A6F9]/10 flex items-center justify-center group-hover:bg-white/20">
                <MapPin className="w-8 h-8 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Minas Gerais</h3>
              <p className="text-sm opacity-70 group-hover:text-white/80 mt-2">Matriz - Araxá</p>
              <p className="text-xs opacity-50 group-hover:text-white/60 mt-1">(034) 3199-9131</p>
              <span className="inline-block mt-4 text-[#04A6F9] group-hover:text-white font-medium">Ver no mapa →</span>
            </a>
            <a href={maps.sp} target="_blank" rel="noreferrer" className="group rounded-2xl bg-white p-6 text-center hover:bg-[#020234] hover:text-white transition-all shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#04A6F9]/10 flex items-center justify-center group-hover:bg-white/20">
                <MapPin className="w-8 h-8 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">São Paulo</h3>
              <p className="text-sm opacity-70 group-hover:text-white/80 mt-2">Filial - São Paulo</p>
              <p className="text-xs opacity-50 group-hover:text-white/60 mt-1">(011) 5199-6177</p>
              <span className="inline-block mt-4 text-[#04A6F9] group-hover:text-white font-medium">Ver no mapa →</span>
            </a>
            <a href={maps.go} target="_blank" rel="noreferrer" className="group rounded-2xl bg-white p-6 text-center hover:bg-[#020234] hover:text-white transition-all shadow-lg hover:shadow-xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#04A6F9]/10 flex items-center justify-center group-hover:bg-white/20">
                <MapPin className="w-8 h-8 text-[#04A6F9] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold">Goiás</h3>
              <p className="text-sm opacity-70 group-hover:text-white/80 mt-2">Filial - Goiânia</p>
              <p className="text-xs opacity-50 group-hover:text-white/60 mt-1">(062) 3602-2258</p>
              <span className="inline-block mt-4 text-[#04A6F9] group-hover:text-white font-medium">Ver no mapa →</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-[#020234] to-[#04176b]">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Vamos crescer juntos?</h2>
          <p className="text-white/80 text-lg mb-8">Entre em contato com nosso time comercial e tenha condições especiais!</p>
          <a 
            href={whatsappComercial} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-flex items-center gap-3 rounded-full bg-[#25d366] text-white px-8 py-4 font-semibold hover:bg-[#20bd5a] transition-colors text-lg"
          >
            <MessageCircle size={24} />
            Falar com Especialista
          </a>
          <p className="mt-6 text-sm text-white/60">Use o cupom: <span className="font-bold text-white text-lg">WSSITE17031987</span></p>
        </div>
      </section>

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
              <li><a href={maps.mg} target="_blank" rel="noreferrer">🗺️ Filial Minas Gerais</a></li>
              <li><a href={maps.sp} target="_blank" rel="noreferrer">🗺️ Filial São Paulo</a></li>
              <li><a href={maps.go} target="_blank" rel="noreferrer">🗺️ Filial Goiás</a></li>
              <li><Link to="/privacidade" target="_blank" rel="noreferrer">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center py-5 border-t border-white/10 text-sm text-white/70">
          Copyright © 2011-2026 | Webside Consultoria e Sistemas Ltda — Todos os direitos reservados — CNPJ: 35.277.090/0001-47
        </div>
      </footer>

      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#020234]">Nossa História</h2>
                <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-[#020234]" />
                </button>
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

