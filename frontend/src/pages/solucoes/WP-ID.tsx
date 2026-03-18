import SolutionPage from '../../components/SolutionPage';

const WP_ID = () => (
  <SolutionPage
    title="WP ID"
    emoji="🔍"
    description="Segurança e inteligência. Identifica placas, reconhece combustível correto e bloqueia erros de abastecimento."
    tag="Segurança"
    features={[
      "Reconhecimento automático de placas de veículos",
      "Identificação do combustível correto por modelo",
      "Bloqueio automático de abastecimentos incorretos",
      "Redução de erros e perdas por abastecimento errado",
      "Relatórios de padrões de abastecimento por placa",
      "Integração com câmeras e sistemas de controle"
    ]}
  />
);

export default WP_ID;

