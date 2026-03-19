import React from "react";
import { Link } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

export const articles = [
	{
		slug: "lei-seca",
		title: "Multa por Lei Seca e Recusa (Art. 165 e 165-A)",
		seoTitle: "Defesa Multa Lei Seca Art. 165 CTB: Evite Suspensão da CNH",
		seoDescription: "Levou multa da Lei Seca ou Recusa (Art. 165-A)? Veja como anular a suspensão de 12 meses e a multa de R$ 2.934,70 com recurso técnico especializado.",
		description:
			"Seja por teste positivo ou por recusa ao bafômetro, a multa da Lei Seca prevê suspensão da CNH por 12 meses. Descubra as teses jurídicas para anular essa penalidade.",
		category: "Lei Seca",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Qual o valor da multa?",
				a: "O valor atual é de R$ 2.934,70 (multa gravíssima multiplicada por 10).",
			},
			{
				q: "Recusar o bafômetro gera suspensão automática?",
				a: "Não. É instaurado um processo onde você tem direito a defesa prévia e recursos à JARI e ao CETRAN antes de qualquer bloqueio na CNH.",
			},
			{
				q: "Vale a pena recorrer?",
				a: "Sim. Erros formais no bafômetro, falta de sinais de embriaguez descritos no auto ou falhas na notificação anulam totalmente a infração.",
			},
		],
		content: (
			<>
				<p>
					A Lei Seca é uma das fiscalizações mais rigorosas do trânsito brasileiro. Tanto a{" "}
					<strong>influência de álcool (Art. 165)</strong> quanto a{" "}
					<strong>recusa ao teste (Art. 165-A)</strong> geram as mesmas penalidades: multa de{" "}
					<strong>R$ 2.934,70</strong> e a <strong>suspensão da CNH por 12 meses</strong>.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Teses de Defesa para Art. 165 (Teste Positivo)
				</h2>
				<p>
					Quando há o teste, a defesa foca na validade técnica do etilômetro (bafômetro). O
					equipamento deve ter sido verificado pelo INMETRO nos últimos 12 meses e o resultado deve
					considerar o desconto da margem de erro regulamentar.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Teses de Defesa para Art. 165-A (Recusa)
				</h2>
				<p>
					A Constituição Federal garante que ninguém é obrigado a produzir provas contra si mesmo.
					No caso de recusa, o agente de trânsito é obrigado a preencher um{" "}
					<strong>Termo de Constatação de Sinais</strong>, descrevendo se o condutor apresentava
					olhos vermelhos, fala alterada ou desequilíbrio. Se o auto de infração for baseado apenas
					na recusa, sem descrição de sinais, ele é nulo.
				</p>

				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-xl">
					<h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
						<AlertTriangle size={20} /> Efeito Suspensivo
					</h4>
					<p className="text-sm text-yellow-800">
						Ao entrar com o recurso, sua CNH permanece ativa e você pode continuar dirigindo
						normalmente até o julgamento final em última instância.
					</p>
				</div>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">Sua multa pode ser anulada?</h3>
					<p className="text-gray-600 mb-6">
						Nossa IA analisa seu caso buscando erros formais e falta de materialidade que garantem o
						cancelamento da multa e da suspensão.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Fazer Análise Gratuita Agora <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "faixa-exclusiva",
		title: "Multa por Transitar em Faixa Exclusiva (Art. 184)",
		description:
			"Transitar na faixa de ônibus ou seletiva gera multa gravíssima. Entenda as exceções como acesso a garagens ou conversões à direita que anulam a autuação.",
		category: "Infrações Comuns",
		publishDate: "2026-02-26",
		faq: [
			{
				q: "Qual o valor da multa?",
				a: "Transitar na faixa exclusiva da direita ou esquerda (Art. 184, III) é infração gravíssima: R$ 293,47 e 7 pontos.",
			},
			{
				q: "Posso entrar na faixa para virar à direita?",
				a: "Sim. A manobra deve ser feita no trecho final da quadra (linhas pontilhadas). Entrar antes ou por tempo excessivo gera multa.",
			},
		],
		content: (
			<>
				<p>
					As faixas exclusivas para ônibus foram criadas para agilizar o transporte público, mas se
					tornaram verdadeiras armadilhas para motoristas, especialmente pela fiscalização
					eletrônica (radares de faixa).
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acesso Local e Conversões</h2>
				<p>
					O Código de Trânsito permite o uso da faixa exclusiva para fins de{" "}
					<strong>acesso a lotes lindeiros</strong> (garagens, postos de combustíveis) ou para
					realizar <strong>conversões à direita</strong>. Se você foi multado enquanto realizava
					uma dessas manobras legítimas, a autuação é indevida.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Principais Argumentos de Defesa
				</h2>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Sinalização Horizontal:</strong> Se a pintura no chão (linha contínua) estiver
							apagada ou não houver a sinalização pontilhada permitindo a entrada para conversão, a
							multa não pode ser aplicada.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Foto de Radar:</strong> A foto deve mostrar o veículo transitando por um
							longo trecho. Uma foto isolada não prova que o motorista não estava apenas entrando na
							faixa para acessar uma garagem próxima.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">
						Foi multado por entrar na faixa de ônibus?
					</h3>
					<p className="text-gray-600 mb-6">
						Muitas vezes o sistema automático não identifica que você estava apenas manobrando para
						entrar em um estacionamento. Recorra para anular os 7 pontos.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Verificar Viabilidade <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "excesso-velocidade",
		title: "Recurso de Multa por Excesso de Velocidade (Art. 218)",
		seoTitle: "Recurso Multa Excesso de Velocidade Art. 218 CTB | Anular Pontos",
		seoDescription: "Sua multa de radar do Art. 218 CTB pode ser anulada. Verifique erros técnicos no radar e evite a suspensão da CNH por excesso de velocidade.",
		description:
			"Multas de radar são as campeãs de emissão no Brasil. Entenda quando o equipamento falha e como evitar pontos na carteira ou até a suspensão direta.",
		category: "Excesso de Velocidade",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Radar móvel precisa estar visível?",
				a: "Sim. A legislação atual proíbe radares ocultos ('pegadinhas'). A via deve estar devidamente sinalizada.",
			},
			{
				q: "Acima de 50% suspende a CNH?",
				a: "Sim. Exceder a velocidade em mais de 50% gera processo de suspensão direta da CNH, mesmo que você não tenha outros pontos.",
			},
		],
		content: (
			<>
				<p>
					O excesso de velocidade é a infração mais comum no Brasil, mas também é a que mais
					apresenta irregularidades técnicas. A fiscalização eletrônica (radares) não é infalível e
					depende de uma cadeia rigorosa de manutenção, sinalização e homologação para ser legal.
				</p>
				<p>
					Muitos motoristas pagam a multa por acreditarem que "a foto não mente". A foto pode não
					mentir sobre a presença do carro, mas não garante que o aparelho mediu a velocidade
					corretamente ou que o local estava apto a ser fiscalizado.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Os Graus da Infração (Art. 218)
				</h2>
				<ul className="space-y-2 mt-2 mb-6 text-gray-700">
					<li>
						<strong>Até 20% acima do limite:</strong> Infração Média (4 pontos).
					</li>
					<li>
						<strong>De 20% a 50% acima:</strong> Infração Grave (5 pontos).
					</li>
					<li>
						<strong>Acima de 50% do limite:</strong> Infração Gravíssima (7 pontos) + Suspensão do
						Direito de Dirigir.
					</li>
				</ul>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Como a Defesa Técnica Funciona
				</h2>
				<p>
					Não adianta alegar que estava com pressa ou que não viu a placa. O recurso eficaz ataca a
					validade técnica da aferição.
				</p>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Estudo Técnico de Viabilidade:</strong> O INMETRO exige que cada local de
							radar tenha um estudo prévio aprovado. Se o estudo estiver vencido ou ausente, a multa
							cai.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Certificado de Verificação:</strong> Todo radar deve ser aferido anualmente.
							Nossa IA busca a data da última aferição e compara com a data da sua multa.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Distância da Sinalização:</strong> Existem regras sobre a distância entre a
							placa de velocidade e o radar. Se estiverem muito próximas ou distantes (fora do
							padrão do CONTRAN), a autuação é irregular.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">
						Quer descobrir se o radar estava regular?
					</h3>
					<p className="text-gray-600 mb-6">
						Temos acesso às bases de dados de regulamentação de radares. Verifique agora se a sua
						infração contém vícios técnicos ocultos.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Analisar Minha Notificação <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "ultrapassagem-indevida",
		title: "Ultrapassagem em Local Proibido (Art. 203)",
		description:
			"A multa por ultrapassagem é uma das mais caras do CTB (R$ 1.467,35). Muitas vezes, a sinalização é deficiente ou o agente não viu toda a manobra.",
		category: "Infrações Graves",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Posso recorrer mesmo se o agente disse que viu?",
				a: "Sim. A palavra do agente tem presunção de veracidade, mas não é absoluta. Ele precisa descrever a infração com detalhes que muitas vezes faltam.",
			},
			{
				q: "A multa suspende a CNH?",
				a: "Não diretamente, mas soma 7 pontos. Se você for reincidente em 12 meses, o valor da multa dobra para quase R$ 3.000.",
			},
		],
		content: (
			<>
				<p>
					Ultrapassar pela contramão em linha contínua amarela é uma infração gravíssima (Art. 203,
					V do CTB) com uma penalidade pesada:{" "}
					<strong>multa multiplicada por 5, totalizando R$ 1.467,35</strong>, e 7 pontos na
					carteira.
				</p>
				<p>
					O grande problema desse tipo de infração é que ela geralmente ocorre em rodovias e é
					aplicada "de longe", sem que o condutor seja abordado. Isso cria uma situação onde a
					defesa depende exclusivamente da análise técnica do local e do preenchimento do auto de
					infração.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Falta de Abordagem</h2>
				<p>
					Embora o CTB permita multas sem abordagem, nesses casos o agente de trânsito tem o dever
					de relatar minuciosamente o ocorrido. Ele precisa explicar por que não foi possível parar
					o veículo e descrever com clareza onde a manobra começou e terminou.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Pontos Chave para o Recurso</h2>
				<p>
					Muitas multas de ultrapassagem são anuladas por erros na descrição do local ou pela
					sinalização precária.
				</p>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Visibilidade da Sinalização:</strong> A linha amarela estava visível? Havia
							mato cobrindo a placa? Se a sinalização for insuficiente, a infração não pode
							subsistir.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Local Exato:</strong> O agente indicou o Km exato? Em rodovias, um erro de
							quilometragem pode colocar a infração em um local onde a ultrapassagem era, na
							verdade, permitida.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Situação de Emergência:</strong> A ultrapassagem foi feita para desviar de um
							obstáculo ou buraco? Isso pode descaracterizar a infração.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">Foi multado sem ser parado?</h3>
					<p className="text-gray-600 mb-6">
						Multas sem abordagem possuem um índice maior de cancelamento devido à falta de detalhes
						no auto de infração. Nossa tecnologia verifica essas lacunas para você.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Iniciar Defesa Técnica <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "cnh-vencida",
		title: "Dirigir com CNH Vencida (Art. 162, V)",
		description:
			"Esqueceu de renovar a carteira? Dirigir com a CNH vencida há mais de 30 dias é infração gravíssima. Veja como proceder para não piorar a situação.",
		category: "CNH",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Posso dirigir com a CNH vencida?",
				a: "Apenas por 30 dias após a data de vencimento. Após isso, é infração gravíssima.",
			},
			{
				q: "Se eu renovar, a multa some?",
				a: "Não. A infração penaliza o ato de dirigir vencido. A renovação posterior não anula o ato passado, mas é essencial para regularizar sua situação.",
			},
		],
		content: (
			<>
				<p>
					A correria do dia a dia faz com que muitos motoristas percam o prazo de renovação da CNH.
					O Art. 162, V do CTB concede uma tolerância de 30 dias após o vencimento. Passado esse
					prazo, ser flagrado dirigindo gera uma infração <strong>gravíssima (7 pontos)</strong> e
					multa de R$ 293,47.
				</p>
				<p>
					Além da multa, a medida administrativa é a <strong>retenção do veículo</strong> até a
					apresentação de um condutor habilitado. Isso significa que você não poderá sair dirigindo
					o carro da blitz.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Diferença entre CNH Vencida e Cassada
				</h2>
				<p>
					É importante não confundir. CNH vencida é apenas uma questão administrativa de validade do
					exame médico. CNH cassada ou suspensa é uma penalidade. Dirigir com a CNH cassada é uma
					infração muito mais grave e cara. No caso de CNH apenas vencida, a defesa é mais viável se
					houver erros no procedimento.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Possibilidades de Defesa</h2>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Erro na Data:</strong> Parece óbvio, mas agentes erram contas. Verifique se a
							autuação ocorreu realmente após o 31º dia do vencimento.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Notificação do Proprietário:</strong> Se você não era o condutor (o carro foi
							emprestado), a responsabilidade pela infração de dirigir sem habilitação recai sobre o
							condutor, mas a de entregar o veículo a pessoa inabilitada recai sobre o proprietário.
							A confusão na autuação pode anular a multa.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Calamidade Pública ou Greves:</strong> Em situações onde o DETRAN está fechado
							ou com serviços limitados (como ocorreu na pandemia), os prazos costumam ser
							prorrogados.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">Foi multado por um descuido?</h3>
					<p className="text-gray-600 mb-6">
						Não deixe que um erro de calendário prejudique seu histórico de motorista. Verifique se
						o procedimento do agente seguiu a lei.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Analisar Minha Multa <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "celular-direcao",
		title: "Uso de Celular ao Volante (Art. 252)",
		description:
			"Manusear ou segurar o celular enquanto dirige se tornou a infração mais fiscalizada nas cidades. Entenda os critérios para que essa multa seja válida.",
		category: "Infrações Comuns",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Posso usar no suporte (GPS)?",
				a: "Sim, desde que para visualização e com breves toques. O que é proibido é segurar o aparelho ou digitar mensagens longas.",
			},
			{
				q: "E no sinal vermelho?",
				a: "Tecnicamente, o veículo imobilizado no semáforo ainda está em trânsito. Portanto, o uso continua proibido, embora a defesa possa questionar a falta de risco.",
			},
		],
		content: (
			<>
				<p>
					O celular se tornou a extensão do nosso corpo, mas ao volante ele é um perigo e um alvo
					fácil para multas. O Art. 252 do CTB foi atualizado para diferenciar o "falar ao celular"
					do "segurar ou manusear" o aparelho, tornando esta última uma infração{" "}
					<strong>gravíssima (7 pontos)</strong>.
				</p>
				<p>
					A grande questão dessa multa é que ela é quase sempre baseada na observação visual do
					agente, sem foto ou abordagem. Isso gera uma presunção de veracidade, mas também abre
					margem para equívocos.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					A Diferença entre Segurar e Manusear
				</h2>
				<p>A lei pune duas condutas principais:</p>
				<ul className="list-disc pl-6 space-y-2 mb-6 text-gray-700">
					<li>
						<strong>Segurar:</strong> Manter o aparelho na mão, mesmo que desligado ou sem uso
						aparente.
					</li>
					<li>
						<strong>Manusear:</strong> Digitar, rolar a tela, enviar áudios, mesmo que o aparelho
						esteja no suporte.
					</li>
				</ul>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Como Recorrer da Multa de Celular?
				</h2>
				<p>
					Como geralmente não há foto, o "Calcanhar de Aquiles" dessa multa é o detalhamento no Auto
					de Infração.
				</p>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Falta de Detalhes:</strong> O agente deve descrever a situação. Se ele apenas
							coloca o código da infração sem dizer o que observou (ex: "condutor segurava aparelho
							na mão esquerda"), a multa é frágil.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Películas Escuras:</strong> Se o seu carro tem insulfilm permitido, isso
							dificulta a visão interna. Em dias de chuva ou à noite, é tecnicamente improvável que
							o agente tenha certeza visual do manuseio.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Objeto Confundido:</strong> Muitas vezes o motorista estava segurando outro
							objeto (carteira, óculos) e o agente presumiu ser um celular.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">Foi multado injustamente?</h3>
					<p className="text-gray-600 mb-6">
						Se você acredita que houve um erro de interpretação do agente ou que o auto de infração
						está incompleto, há grandes chances de cancelamento.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Verificar Minha Defesa <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "manobra-perigosa",
		title: "Manobra Perigosa ou Arrancada Brusca (Art. 175)",
		description:
			"Infração gravíssima que prevê suspensão do direito de dirigir. É uma autuação subjetiva que depende da interpretação do agente. Nossa defesa técnica busca provar a desproporcionalidade ou inexistência do risco.",
		category: "Direção Perigosa",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "O que caracteriza manobra perigosa?",
				a: "Arrancada brusca, derrapagem ou frenagem com deslizamento de pneus.",
			},
			{
				q: "Existe risco de suspensão?",
				a: "Sim, além da multa de quase R$ 3.000, o Art. 175 prevê suspensão do direito de dirigir.",
			},
		],
		content: (
			<>
				<p>
					A infração por manobra perigosa (Art. 175 do CTB) é uma das mais severas do código. Ela
					pune quem utiliza o veículo para exibir-se em via pública com manobras arriscadas, como
					arrancadas bruscas, derrapagens ou frenagens que façam os pneus deslizarem.
				</p>
				<p>
					A penalidade é pesadíssima: multa multiplicada por 10 (R$ 2.934,70) e a{" "}
					<strong>suspensão do direito de dirigir</strong>. O problema é que a definição do que é
					"perigoso" ou "exibição" muitas vezes fica a critério subjetivo do agente de trânsito.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Subjetividade e Defesa</h2>
				<p>
					Uma arrancada um pouco mais forte para sair de um cruzamento perigoso é uma "exibição"?
					Uma frenagem brusca para evitar um acidente é "manobra perigosa"?
				</p>
				<p>
					A defesa técnica explora exatamente essa subjetividade. Para que a multa seja válida, o
					agente precisa descrever que a conduta teve a <strong>intenção de exibição</strong> ou
					gerou risco real à segurança.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Argumentos para o Recurso</h2>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Falta de Intenção:</strong> Demonstrar que a manobra foi defensiva (para
							evitar colisão) e não exibicionista.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Condições da Via:</strong> Óleo na pista ou aquaplanagem podem causar
							derrapagens involuntárias que são confundidas com manobras propositais.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Descrição Insuficiente:</strong> O auto de infração genérico, que apenas cita
							o artigo da lei sem narrar a conduta específica, viola o direito de defesa.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">
						Foi uma manobra defensiva e não perigosa?
					</h3>
					<p className="text-gray-600 mb-6">
						Não aceite a suspensão da sua CNH por uma interpretação equivocada do agente. Nossa
						tecnologia ajuda a montar uma defesa sólida baseada nos fatos.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Iniciar Análise Técnica <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "multa-moto",
		title: "Infrações de Motocicleta (Capacete/Viseira)",
		description:
			"Multas específicas para motociclistas, como viseira levantada ou falta de capacete, possuem regras rígidas. Analisamos se a autuação respeita as resoluções do CONTRAN.",
		category: "Motocicletas",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Viseira levantada suspende a CNH?",
				a: "Não mais. Atualmente é infração média (Art. 244). Mas cuidado: falta de óculos de proteção ou capacete sem jugular ainda geram problemas maiores.",
			},
			{
				q: "Capacete sem selo do INMETRO dá multa?",
				a: "Sim, é infração grave. Mas a fiscalização precisa provar que o capacete não é certificado.",
			},
		],
		content: (
			<>
				<p>
					Motociclistas são alvos frequentes de fiscalização rigorosa. As multas mais comuns
					envolvem o uso do capacete e da viseira. Antigamente, andar com a viseira levantada era
					infração gravíssima com suspensão da CNH, mas a lei mudou.
				</p>
				<p>
					Hoje, pilotar com a <strong>viseira levantada</strong> é infração média (Art. 244 do CTB).
					Porém, muitos agentes ainda aplicam o código antigo ou confundem com a infração de
					"pilotar sem capacete", que continua sendo gravíssima e mandatória de suspensão.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					O Perigo da Confusão na Autuação
				</h2>
				<p>
					Se o agente de trânsito anotar o código errado na autuação, você pode responder a um
					processo de suspensão da CNH por algo que deveria ser apenas uma multa média. Esse erro
					formal (vício de motivo) é causa clara de anulação.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">O Que Pode Ser Questionado?</h2>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Tipificação Errada:</strong> Transformar infração de viseira (média) em falta
							de capacete (gravíssima).
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Capacete Engatado:</strong> Muitas multas alegam "falta de uso" quando na
							verdade a cinta jugular estava apenas folgada. A diferença legal é enorme.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Selo do INMETRO:</strong> Se a multa for pela falta do selo, o agente precisa
							verificar se o capacete possui a etiqueta interna, pois o selo externo pode desgastar
							com o tempo (o que é permitido).
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">Multa desproporcional?</h3>
					<p className="text-gray-600 mb-6">
						Não permita que um erro de código do agente custe sua habilitação. Verifique se a
						tipificação da sua multa está correta.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Conferir Minha Multa Agora <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "perda-ppd",
		title: "Cassação da Permissão para Dirigir (PPD)",
		description:
			"Se você tem a PPD e cometeu infração grave, gravíssima ou reincidência em média, pode não pegar a CNH definitiva. O recurso visa anular a infração para salvar sua permissão.",
		category: "CNH",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "Perdi a PPD, tenho que começar do zero?",
				a: "Sim. Se a penalidade for confirmada, você terá que refazer todo o processo de habilitação (autoescola).",
			},
			{
				q: "Posso recorrer para salvar a PPD?",
				a: "Sim! Se o recurso estiver em andamento ('efeito suspensivo') quando completar 1 ano de carta, você tem o direito de pegar a definitiva.",
			},
		],
		content: (
			<>
				<p>
					O período de Permissão para Dirigir (PPD) é o momento mais frágil da vida do motorista.
					Qualquer infração <strong>grave (5 pontos)</strong>,{" "}
					<strong>gravíssima (7 pontos)</strong> ou ser reincidente em infrações{" "}
					<strong>médias (4 pontos)</strong> impede a obtenção da CNH definitiva.
				</p>
				<p>
					Isso significa voltar para a estaca zero: pagar todas as taxas novamente, fazer as aulas
					teóricas e práticas e passar nos exames. É um prejuízo de tempo e dinheiro enorme.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					A Estratégia do Efeito Suspensivo
				</h2>
				<p>
					Muitos motoristas novatos desconhecem que, ao recorrer da multa, a pontuação não entra
					imediatamente no prontuário. Enquanto o processo administrativo não for julgado em última
					instância, a infração fica suspensa.
				</p>
				<p>
					Se o seu período de PPD vencer enquanto o recurso ainda estiver correndo, o DETRAN é
					obrigado a emitir sua CNH definitiva. Essa é uma das principais estratégias para salvar a
					habilitação de quem cometeu um deslize no primeiro ano.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Erros que Salvam a PPD</h2>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Proprietário x Condutor:</strong> Se a multa foi no seu carro mas outra pessoa
							dirigia, você tem prazo para indicar o condutor. Se perdeu o prazo, ainda é possível
							discutir judicialmente a responsabilidade real.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Multas Meramente Administrativas:</strong> Algumas decisões judiciais entendem
							que multas que não geram risco ao trânsito (ex: cor do veículo alterada, recibo de
							transferência atrasado) não deveriam impedir a CNH definitiva.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">
						Risco de voltar para a autoescola?
					</h3>
					<p className="text-gray-600 mb-6">
						Não entregue sua PPD sem lutar. O recurso administrativo é a ferramenta legal para
						garantir que você pegue sua CNH definitiva.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Salvar Minha PPD <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "multa-nic",
		title: "Multa NIC (Não Indicação de Condutor)",
		description:
			"Multa aplicada a pessoas jurídicas (empresas) que não indicam o condutor infrator. O valor é multiplicado pelo número de vezes que a mesma infração foi cometida nos últimos 12 meses.",
		category: "Pessoa Jurídica",
		publishDate: "2026-02-03",
		faq: [
			{
				q: "A multa NIC gera pontos?",
				a: "Não. Como é uma multa para a empresa (CNPJ), não há pontuação na CNH. É uma penalidade puramente financeira.",
			},
			{
				q: "O valor pode ser muito alto?",
				a: "Sim. Se o carro teve 10 multas iguais no ano, a nova multa NIC será multiplicada por 10. Pode chegar a valores astronômicos.",
			},
		],
		content: (
			<>
				<p>
					A Multa NIC (Não Indicação de Condutor) é o pesadelo dos gestores de frota e donos de
					empresas. Ela ocorre quando um veículo registrado em CNPJ (Pessoa Jurídica) é multado e a
					empresa não informa ao DETRAN quem estava dirigindo no prazo legal.
				</p>
				<p>
					Como o CNPJ não tem carteira de habilitação para receber pontos, a punição é no bolso: uma{" "}
					<strong>nova multa</strong> é gerada apenas pela falta de indicação. E o pior: o valor
					dessa nova multa é multiplicado pelo número de vezes que aquela mesma infração foi
					cometida pelo veículo nos últimos 12 meses.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">O Efeito Bola de Neve</h2>
				<p>
					Imagine que um carro da empresa foi multado 5 vezes por excesso de velocidade. Na 6ª vez,
					se não houver indicação do condutor, a multa NIC será o valor da multa original{" "}
					<strong>multiplicado por 6</strong>. Isso pode transformar uma infração simples de R$
					130,00 em uma dívida de milhares de reais.
				</p>

				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Como Recorrer da Multa NIC?</h2>
				<p>
					Para anular a multa NIC, a estratégia principal é atacar a{" "}
					<strong>multa originária</strong> ou a <strong>falta de notificação</strong> da empresa.
				</p>
				<ul className="space-y-4 mt-4">
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Anulação da Origem:</strong> Se a multa de trânsito original (que gerou a NIC)
							for anulada por erro técnico, a multa NIC perde o motivo de existir e também deve ser
							cancelada.
						</span>
					</li>
					<li className="flex items-start gap-3">
						<CheckCircle className="text-green-500 shrink-0 mt-1" size={20} />
						<span>
							<strong>Falha na Notificação:</strong> A empresa precisa ser notificada validamente
							para indicar o condutor. Se a notificação foi enviada para endereço errado ou não foi
							recebida, o prazo não poderia ter corrido.
						</span>
					</li>
				</ul>

				<div className="bg-blue-50 rounded-2xl p-8 mt-10 text-center border border-blue-100">
					<h3 className="text-xl font-bold text-gray-900 mb-4">
						Sua empresa recebeu uma multa multiplicada?
					</h3>
					<p className="text-gray-600 mb-6">
						A gestão de multas corporativas exige atenção. Podemos ajudar a identificar nulidades
						que isentam sua empresa dessas cobranças abusivas.
					</p>
					<Link
						to="/upload"
						className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-1">
						Analisar Multas da Frota <ArrowRight size={18} />
					</Link>
				</div>
			</>
		),
	},
	{
		slug: "motorista-app",
		title: "Uber e 99: Como Proteger sua Conta de Bloqueios por Multas",
		description:
			"Motoristas de aplicativo dependem da CNH para trabalhar. Descubra quais multas causam exclusão das plataformas e como recorrer para manter sua renda.",
		category: "Profissional",
		publishDate: "2026-02-10",
		faq: [
			{
				q: "A Uber bloqueia por pontos na CNH?",
				a: "Sim. Se a CNH for suspensa ou cassada, a plataforma bloqueia a conta automaticamente na próxima verificação de antecedentes.",
			},
			{
				q: "Multa média atrapalha o trabalho?",
				a: "Geralmente não, mas o acúmulo de pontos pode levar à suspensão. O perigo real são as infrações suspensivas diretas (ex: Lei Seca).",
			},
		],
		content: (
			<>
				<p>
					Para quem dirige profissionalmente (EAR), a CNH não é apenas um documento, é o instrumento
					de trabalho. As plataformas como Uber e 99 realizam verificações periódicas de
					antecedentes e do status da habilitação.
				</p>
				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">O Risco da Suspensão</h2>
				<p>
					Uma única multa de Lei Seca (mesmo recusando o bafômetro) ou excesso de velocidade acima
					de 50% gera a suspensão da CNH. Isso significa <strong>desligamento imediato</strong> dos
					aplicativos.
				</p>
				<div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8 rounded-r-xl">
					<h4 className="font-bold text-yellow-800 mb-2">Estratégia de Defesa</h4>
					<p className="text-sm text-yellow-800">
						O recurso administrativo tem "efeito suspensivo". Isso significa que, enquanto você
						recorre, sua CNH continua ativa e "limpa" para as plataformas.
					</p>
				</div>
				<p>
					Não espere a notificação de suspensão chegar. Se foi multado, recorra imediatamente para
					garantir seu direito de trabalhar.
				</p>
			</>
		),
	},
	{
		slug: "caminhoneiro",
		title: "Defesa de Multas para Caminhoneiros e Transportadoras",
		description:
			"Excesso de peso, exame toxicológico e evasão de balança. Saiba como anular multas que prejudicam o frete e a transportadora.",
		category: "Profissional",
		publishDate: "2026-02-10",
		faq: [
			{
				q: "Multa de toxicológico suspende a CNH?",
				a: "Sim. O exame toxicológico vencido por mais de 30 dias é infração gravíssima com multa de R$ 1.467,35 e suspensão do direito de dirigir por 3 meses.",
			},
			{
				q: "A multa vai para o embarcador ou transportador?",
				a: "Depende. No excesso de peso, se houver nota fiscal com peso declarado incorreto, a responsabilidade é do embarcador.",
			},
		],
		content: (
			<>
				<p>
					O setor de transporte sofre com uma fiscalização específica e pesada. Multas de pesagem e
					toxicológico vencido são as que mais geram prejuízos.
				</p>
				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
					Exame Toxicológico (Art. 165-B)
				</h2>
				<p>
					A "multa de balcão" (verificada na renovação) pegou muitos motoristas de surpresa. Porém,
					para que a multa seja válida em fiscalização de trânsito, o agente precisa seguir
					protocolos rígidos de abordagem.
				</p>
				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Excesso de Peso</h2>
				<p>
					As balanças rodoviárias precisam de aferição regular do INMETRO, assim como os radares.
					Falhas na pesagem ou no ticket da balança são as principais causas de anulação.
				</p>
			</>
		),
	},

	// --- NOVAS INFRAÇÕES COMUNS ---
	{
		slug: "avancar-sinal",
		title: "Multa por Avançar Sinal Vermelho (Art. 208)",
		description:
			"Foi multado por furar o sinal de madrugada ou para dar passagem a ambulância? Veja quando o recurso é aceito.",
		category: "Infrações Comuns",
		publishDate: "2026-02-10",
		faq: [
			{
				q: "Furar sinal de madrugada dá multa?",
				a: "Pela lei, sim. Porém, a defesa pode alegar estado de necessidade ou risco à segurança, dependendo do horário e local.",
			},
			{
				q: "Tem foto?",
				a: "Se for fiscalização eletrônica, sim. Se for agente, a palavra dele tem fé pública, mas ele deve descrever a situação detalhadamente.",
			},
		],
		content: (
			<>
				<p>
					O avanço de sinal vermelho é infração gravíssima (7 pontos). No entanto, existem exceções
					não escritas que são aceitas nos recursos, como o <strong>estado de necessidade</strong>{" "}
					(fugir de um assalto à noite) ou dar passagem a veículos de emergência.
				</p>
				<p>
					Para multas eletrônicas, verificamos se a foto mostra o veículo cruzando totalmente a via
					ou apenas parando sobre a faixa (que é outra infração, média, e não gravíssima).
				</p>
			</>
		),
	},
	{
		slug: "estacionamento-proibido",
		title: "Multa de Estacionamento: Quando Recorrer?",
		description:
			"Placa escondida, guia rebaixada irregular ou operação de carga e descarga. Saiba como não pagar multas injustas de estacionamento.",
		category: "Estacionamento",
		publishDate: "2026-02-10",
		faq: [
			{
				q: "Posso parar com pisca-alerta ligado?",
				a: "O pisca-alerta não autoriza estacionamento em local proibido, apenas parada para embarque/desembarque rápido se permitido.",
			},
			{
				q: "Falta de sinalização anula a multa?",
				a: "Sim. Se a placa de 'Proibido Estacionar' não estiver visível ou estiver fora dos padrões do CONTRAN a cada 60 metros, a multa é nula.",
			},
		],
		content: (
			<>
				<p>
					A "indústria da multa" muitas vezes se aproveita de sinalização confusa. Para multar, a
					prefeitura tem a obrigação de sinalizar a via perfeitamente.
				</p>
				<h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">A Regra dos Marcos</h2>
				<p>
					A proibição de estacionamento vale do ponto da placa até a próxima esquina ou placa de
					término. Se você estacionou antes da placa, a multa é indevida. Nossa IA analisa o local
					da infração via Google Maps para checar a sinalização.
				</p>
			</>
		),
	},
];
