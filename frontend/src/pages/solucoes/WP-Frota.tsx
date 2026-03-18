import SolutionPage from '../../components/SolutionPage';

const WP_Frota = () => (
  <SolutionPage
    title="WP Frota"
    emoji="🚛"
    description="Gestão completa de frotas corporativas com relatórios detalhados."
    tag="Frota"
    features={[
      "Cadastro de veículos e motoristas",
      "Controle de abastecimentos por placa",
      "Relatórios de consumo/km por veículo",
      "Alertas de manutenção preventiva",
      "Integração com WP ID para abastecimento",
      "Análises de custo por frota/setor"
    ]}
  />
);

export default WP_Frota;

