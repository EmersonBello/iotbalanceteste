# IoT Balance - Sistema de Gestão para Bar

## Breve Descrição
O **IoT Balance** é um sistema web inovador desenvolvido para monitoramento inteligente e gestão de estoque em tempo real, focado nas necessidades de estabelecimentos do tipo "Bar". A solução permite o controle preciso de volumes de bebidas (barris, garrafas) através de sensores IoT, garantindo eficiência operacional e redução de desperdícios.

## Objetivo do Projeto
### Finalidade do Sistema
Prover uma interface centralizada e intuitiva para o monitoramento de ativos (bebidas), gestão de dispositivos de pesagem e automação de alertas de reposição.

### Problema que ele resolve
Elimina a necessidade de verificação manual de estoque, previne a falta de produtos em momentos críticos e fornece dados precisos sobre o consumo real, mitigando perdas e fraudes.

## Público-Alvo
- **Desenvolvedores de T.I:** Para manutenção, escalabilidade e integração com novos dispositivos IoT.
- **Equipe de manutenção:** Responsável pela instalação física dos sensores e calibração das balanças.
- **Cliente (Bar):** Gerentes e proprietários que utilizam os relatórios e o dashboard para tomada de decisão.

## Tecnologias Utilizadas
### Linguagens
- **TypeScript:** Tipagem estática para maior segurança e produtividade.
- **JavaScript (ES6+):** Lógica de script auxiliar.
- **HTML5 & CSS3:** Estruturação e estilização moderna.

### Frameworks & Bibliotecas
- **React:** Biblioteca principal para construção da interface de usuário.
- **Vite:** Build tool de próxima geração, garantindo performance e HMR (Hot Module Replacement) rápido.
- **Shadcn UI:** Componentes de interface reutilizáveis e acessíveis.
- **Tailwind CSS:** Framework de utilitários CSS para estilização ágil.
- **TanStack Query (React Query):** Gerenciamento de estado e requisições assíncronas.
- **React Router DOM:** Gerenciamento de rotas da aplicação.
- **Recharts:** Biblioteca para construção de gráficos e relatórios visuais.

### Ferramentas
- **Node.js:** Ambiente de execução JavaScript server-side (utilizado para build e desenvolvimento).
- **npm:** Gerenciador de pacotes.

## Requisitos para Execução
Para rodar este projeto localmente, é necessário ter instalado:
- **Node.js** (Versão 18 ou superior recomendada)
Link para download: https://nodejs.org/pt-br/download
- **npm** (Normalmente instalado junto com o Node.js)

## Instalação e Execução

### 1. Clone do repositório
```bash
git https://github.com/EmersonBello/iotbalanceteste.git
cd iotbalanceteste
```

### 2. Instalação das dependências
Execute o comando abaixo para instalar todas as bibliotecas necessárias listadas no `package.json`:
```bash
npm install
```

### 3. Comando para rodar o projeto
Para iniciar o servidor de desenvolvimento:
```bash
npm run dev
```
Logo após, o comado escolhe H + enter, depois O + enter, e finalmete irá abrir automaticamente no seu navegador padrão.
O console exibirá o endereço local (geralmente `http://localhost:8082`) para acesso ao sistema.

## Arquitetura do Sistema
### Descrição da arquitetura adotada
O sistema segue uma arquitetura **Single Page Application (SPA)** baseada em componentes funcionais do React. A comunicação com o backend (IoT/Dados) é gerenciada via APIs RESTful/WebSockets, abstraída pelo TanStack Query para garantir cache e sincronização eficiente.

### Separação de responsabilidades
- **Components (`/src/components`):** Elementos visuais reutilizáveis (botões, cards, layouts).
- **Pages (`/src/pages`):** Vistas principais da aplicação (Dashboard, Clientes, Produtos).
- **Hooks (`/src/hooks`):** Lógica de negócios encapsulada e reutilizável.
- **Types (`/src/types`):** Definições de tipos TypeScript para consistência de dados.
- **Lib (`/src/lib`):** Utilitários e configurações globais.

### Boas práticas aplicadas
- **Componentização:** Interface modular e de fácil manutenção.
- **Clean Code:** Nomenclatura clara e funções com responsabilidade única.
- **Tipagem Estrita:** Uso intensivo de TypeScript para evitar erros em tempo de execução.
- **Design Responsivo:** Layout adaptável para dispositivos móveis e desktop.

## Estrutura de Pastas
```text
iotbalanceteste/
├── public/              # Arquivos estáticos públicos
├── src/
│   ├── components/      # Componentes de UI (Layout, Common, Shadcn)
│   ├── hooks/           # Custom React Hooks
│   ├── lib/             # Funções utilitárias e configurações
│   ├── pages/           # Páginas da aplicação (Rotas)
│   │   ├── Dashboard/
│   │   ├── Devices/
│   │   ├── Products/
│   │   └── ...
│   ├── types/           # Interfaces e tipos TypeScript
│   ├── App.tsx          # Componente raiz
│   └── main.tsx         # Ponto de entrada da aplicação
├── package.json         # Dependências e scripts do projeto
├── tsconfig.json        # Configurações do TypeScript
├── vite.config.ts       # Configurações do Vite
└── README.md            # Documentação do projeto
```

## Funcionalidades do Sistema
- **Dashboard em Tempo Real:** Visão geral do status de todos os borrachas e dispositivos.
- **Gestão de Dispositivos:** Cadastro, edição e monitoramento de dispositivos IoT.
- **Gestão de Produtos:** Catálogo de bebidas e insumos monitorados.
- **Sistema de Alertas:** Notificações visuais para níveis críticos de estoque.
- **Relatórios:** Gráficos históricos de consumo e reposição.
- **Gestão de Localizações:** Organização de dispositivos por zonas e locais físicos no bar.

## Requisitos Funcionais
- O sistema deve permitir o cadastro de novos dispositivos de pesagem.
- O sistema deve exibir o peso/nível atual de cada borracha conectada.
- O sistema deve alertar o usuário quando o nível de um produto estiver abaixo do mínimo configurado.
- O sistema deve gerar relatórios de consumo por período.

## Requisitos Não Funcionais
### Desempenho
- O dashboard deve carregar em menos de 2 segundos.
- As atualizações de peso devem refletir na tela com latência mínima (real-time).

### Segurança
- Acesso restrito via autenticação (login/senha).
- Comunicação segura com os dispositivos IoT.

### Manutenibilidade
- Código modular e tipado para facilitar atualizações e correções.
- Documentação clara das APIs e componentes.

## Relatório de Desenvolvimento
### Etapas já desenvolvidas
- [x] Configuração inicial do ambiente e arquitetura.
- [x] Implementação dos componentes base (UI Kit).
- [x] Desenvolvimento do Dashboard principal.
- [x] Telas de gestão de Clientes, Produtos e Dispositivos.

### Estado atual do projeto
O projeto encontra-se em estágio avançado de **Desenvolvimento/Testes**, com as principais funcionalidades de monitoramento já implementadas e funcionais. O foco atual é refinamento de interface e otimização de performance.

### Pontos de melhoria futuros
- Implementação de testes automatizados.
- Dashboard preditivo utilizando Machine Learning para estimar fim do estoque.