import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

interface SolutionPageProps {
  title: string;
  emoji: string;
  subtitle?: string;
  description: string;
  benefits?: string[];
  features: string[];
  stats?: Array<{number: string; label: string}>;
  diferenciais?: Array<{title: string; desc: string}>;
  videoId?: string;
  tag: string;
}

const SolutionPage: React.FC<SolutionPageProps> = ({ title, emoji, description, features, tag }: SolutionPageProps) => {
  return (
    <div className="min-h-screen bg-white text-[#020234]">
      <Header />
      <section className="py-20 bg-gradient-to-br from-[#020234] to-[#04176b] text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full border border-white px-4 py-1 text-sm opacity-90">{tag}</span>
            <div className="mt-6 text-6xl">{emoji}</div>
            <h1 className="mt-8 text-4xl md:text-5xl font-black leading-tight">{title}</h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">{description}</p>
            <Link to="/#contato" className="mt-10 inline-block rounded-full bg-white text-[#020234] px-8 py-4 font-bold text-lg hover:bg-[#f0f4f8] transition-all">Solicite Demonstração</Link>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-20">Principais Funcionalidades</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="group flex items-start gap-4 p-6 rounded-2xl bg-[#f8f9ff] hover:bg-[#e8ecff] transition-all border border-[#e0e7ff]">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#04A6F9]/10 flex items-center justify-center mt-1">
                  <span className="text-2xl font-bold text-[#04A6F9]">{index + 1}</span>
                </div>
                <p className="text-lg leading-relaxed group-hover:text-[#0284c7]">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f0f4f8]">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para transformar seu posto?</h2>
          <p className="text-lg text-[#020234]/70 mb-10 max-w-2xl mx-auto">Fale com nossos especialistas e veja o WebPosto {title} em ação.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" className="rounded-full bg-[#04A6F9] text-white px-8 py-4 font-bold hover:bg-[#0284c7] transition-all flex items-center justify-center gap-2">
              💬 Chat ao Vivo
            </Link>
            <Link to="/#contato" className="rounded-full border-2 border-[#04A6F9] text-[#04A6F9] px-8 py-4 font-bold hover:bg-[#04A6F9] hover:text-white transition-all">
              Solicitar Contato
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionPage;
