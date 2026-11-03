**VitaFlow**

Seu cuidado em movimento.

Sobre o projeto

Este projeto está sendo desenvolvido como parte do FMU Tech Inovação, alinhado ao Objetivo de Desenvolvimento Sustentável (ODS) 3 — Saúde e Bem-Estar, com o propósito de contribuir para a continuidade dos tratamentos médicos e incentivar a adoção de hábitos saudáveis.

A proposta surgiu da percepção de uma dificuldade na área da saúde: nem sempre receber uma prescrição médica significa conseguir segui-la adequadamente no dia a dia. Esquecimentos, dificuldades de acesso a medicamentos e obstáculos na organização da rotina podem comprometer a continuidade de um tratamento.

Pensando nisso, buscamos desenvolver uma aplicação que aproxime as orientações recebidas durante o atendimento médico da realidade cotidiana do paciente. A plataforma permitirá organizar prescrições em tarefas, acompanhar sua realização, registrar dificuldades e visualizar o progresso ao longo do tratamento.

Além disso, o projeto contempla o acompanhamento de hábitos saudáveis, permitindo que os usuários estabeleçam metas pessoais e tenham acesso a orientações educativas validadas. Quando considerado apropriado pelo profissional de saúde, recomendações individualizadas também poderão ser incorporadas à rotina do paciente.

Nossa proposta é construir uma solução simples, acessível e intuitiva, mas com uma estrutura que possibilite sua futura integração aos sistemas de instituições de saúde, tanto públicas quanto privadas.

Mais do que lembrar o paciente de tomar um medicamento, queremos oferecer uma ferramenta que facilite a organização do cuidado e ajude a transformar orientações de saúde em ações possíveis no cotidiano.

O VitaFlow não substitui o profissional de saúde, não realiza diagnósticos e não toma decisões clínicas. Sua função é apoiar o paciente na execução e no acompanhamento das orientações recebidas.

O projeto encontra-se em desenvolvimento acadêmico, com foco inicial na construção de um protótipo funcional utilizando dados simulados, preservando a possibilidade de expansão e integração com sistemas reais no futuro.

Integrantes
Nome	RA
Ricardo Soares Hernandes	3172147
Lucas Ribeiro Salomão	3214852
Bruna Borges Souza	3200750
Eziel Cavalcante	3028492
Fonte de dados

Os dados utilizados no projeto serão simulações de dados públicos, pois dados de saúde são sensíveis e protegidos por lei, especialmente pela Lei Geral de Proteção de Dados (LGPD). Essa abordagem já foi discutida com o professor.

Usuários, tratamentos, prescrições, tarefas, registros e metas de hábitos serão fictícios. O protótipo não utilizará prontuários nem informações reais de pacientes.

As fontes públicas identificadas como referência para o projeto são:

PNAUM: acesso, utilização e promoção do uso racional de medicamentos.
Pesquisa Nacional de Saúde (PNS 2019): doenças crônicas, utilização de serviços e acesso a medicamentos.
Vigitel: fatores de risco e proteção para doenças crônicas.
DATASUS e OpenDataSUS: estatísticas e conjuntos de dados públicos de saúde.
INCA: informações epidemiológicas e estimativas sobre câncer.
Anvisa: informações oficiais sobre medicamentos, incluindo bulas.
Ministério da Saúde: Guia Alimentar para a População Brasileira, Guia de Atividade Física para a População Brasileira e materiais sobre doenças crônicas e assistência farmacêutica.
Recursos, tecnologias e linguagem

O VitaFlow será um aplicativo mobile com back-end próprio e banco de dados relacional. A linguagem principal será JavaScript, usada tanto no aplicativo quanto no servidor.

Camada	Tecnologia	Finalidade
Aplicativo	React Native + Expo	Desenvolvimento da interface mobile
API	Node.js + Express	API REST e regras de negócio
Acesso aos dados	Prisma	Comunicação entre o back-end e o banco
Banco de dados	PostgreSQL	Armazenamento persistente das informações

Fluxo da arquitetura: Aplicativo React Native + Expo → API REST em Node.js + Express → Prisma → PostgreSQL.

Ferramentas de apoio: Visual Studio Code, Git, GitHub, Figma, Expo Go, Postman ou Insomnia e ferramentas de gerenciamento do PostgreSQL.

Identidade visual

O nome VitaFlow une "vita" (vida, vitalidade e saúde) e "flow" (fluxo, movimento e continuidade). A identidade busca transmitir saúde, organização, simplicidade, confiança, acessibilidade e humanização, sem a complexidade visual de um sistema hospitalar tradicional.

Paleta de referência
Uso	Cor
Verde principal	
#A7F57B
Verde-claro	
#CFF7A7
Fundo verde muito suave	
#EFFFDE
Azul/lilás complementar	
#A8B6F0
Fundo neutro	
#F5FAF7
Verde-escuro para textos	aproximadamente 
#064B38

Esses códigos são referências iniciais e poderão ser ajustados para garantir contraste, legibilidade e acessibilidade.

Diretrizes visuais
Tipografia: Poppins, fonte sem serifa, geométrica, moderna e amigável.
Elementos gráficos: círculos sobrepostos, grade quadriculada, cantos arredondados, cruzes médicas arredondadas e superfícies claras.
Símbolo: quadrado de cantos arredondados, com faixa superior verde-clara, grade quadriculada e duas cruzes verdes, lembrando uma agenda ou um calendário de saúde.
Interface: composição minimalista, cartões arredondados, ícones simples, linguagem clara e status que não dependam apenas de cores.
