import SolutionPage from '../../components/SolutionPage';

const WP_PDV_Android = () => (
  <SolutionPage
    title="WP PDV Android"
    emoji="📱"
    description="PDV mobile para Android. Pagamentos múltiplos e integração completa com hardware."
    tag="PDV"
    features={[
      "Rodando em tablets/celulares Android",
      "Múltiplos pagamentos simultâneos",
      "Integração com impressoras térmicas",
      "Leitores de cartão e QR Code",
      "Sincronização em tempo real com servidor",
      "Offline mode com reconciliação automática"
    ]}
  />
);

export default WP_PDV_Android;

