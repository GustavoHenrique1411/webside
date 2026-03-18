import SolutionPage from '../../components/SolutionPage';

const WP_Autoatendimento = () => (
  <SolutionPage
    title="WP Autoatendimento"
    emoji="🤖"
    description="Self-service revolucionário. Cliente paga diretamente, sem filas, sem espera."
    tag="Self-Service"
    features={[
      "Terminal de autoatendimento na pista ou caixa",
      "Pagamento 100% digital (cartão, PIX, carteira)",
      "Seleção de bomba e valor via touchscreen",
      "Autorização automática de bomba após pagamento",
      "Relatórios completos de transações self-service",
      "Integração total com sistema principal"
    ]}
  />
);

export default WP_Autoatendimento;

