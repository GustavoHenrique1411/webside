import SolutionPage from '../../components/SolutionPage';

const WP_PDV = () => (
  <SolutionPage
    title="WP PDV"
    emoji="⛽"
    description="O PDV definitivo para postos de combustíveis. Integração total com bombas, cofres, carteiras digitais, fidelidade e múltiplos pagamentos."
    tag="PDV Premium"
    features={[
      "Integração direta com bombas metrais e eletrônicas",
      "Controle de cofres (abertura automática por abastecimento)",
      "Suporte a carteiras digitais (PicPay, Mercado Pago, etc.)",
      "Programa de fidelidade integrado com pontos e descontos",
      "Cupom fiscal e NF-e em poucos cliques",
      "Múltiplos meios de pagamento simultâneos"
    ]}
  />
);

export default WP_PDV;

