import React from "react";
import MainLayout from "../layouts/MainLayout";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
	const data = new Date();
	data.setMonth(data.getMonth() - 2);

	const updatedDate = data.toLocaleDateString("pt-BR", {
		month: "long",
		year: "numeric",
	});

	const formattedDate = updatedDate.charAt(0).toUpperCase() + updatedDate.slice(1);

	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto py-12 px-4">
				<Link
					to="/"
					className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors font-medium">
					<ArrowLeft size={20} className="mr-1" /> Voltar para Início
				</Link>

				<div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100">
					<div className="flex items-center gap-4 mb-10 border-b border-gray-100 pb-8">
						<div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
							<Shield size={32} />
						</div>
						<div>
							<h1 className="text-3xl font-black text-gray-900">Termos de Uso</h1>
							<p className="text-sm text-gray-400 mt-1 uppercase tracking-wider font-bold">
								Última atualização: {formattedDate}
							</p>
						</div>
					</div>

					<div className="prose prose-blue max-w-none text-gray-600 space-y-8">
						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									1
								</span>
								Aceitação dos Termos
							</h3>
							<p className="leading-relaxed">
								Ao acessar e utilizar a plataforma <strong>Auto Defesa</strong> ("Plataforma"), você
								("Usuário") concorda integralmente com estes Termos de Uso. Se você não concordar
								com qualquer disposição destes termos, não deverá utilizar nossos serviços.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									2
								</span>
								Descrição do Serviço
							</h3>
							<p className="leading-relaxed">
								O Auto Defesa oferece um serviço de análise técnica e administrativa de multas de
								trânsito, utilizando tecnologia de inteligência artificial e OCR (reconhecimento
								óptico de caracteres) para:
							</p>
							<ul className="list-disc pl-5 space-y-2 mt-2">
								<li>Extrair dados de autos de infração e notificações.</li>
								<li>
									Identificar possíveis nulidades formais e materiais com base na legislação
									vigente.
								</li>
								<li>Gerar minutas de recursos administrativos (Defesa Prévia, JARI, CETRAN).</li>
							</ul>
							<p className="mt-4 leading-relaxed">
								Nossas análises são fundamentadas no Código de Trânsito Brasileiro (CTB), Manual
								Brasileiro de Fiscalização de Trânsito (MBFT) e Resoluções do CONTRAN.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									3
								</span>
								Limitações Jurídicas e Isenção de Garantia
							</h3>
							<p className="font-bold text-blue-900 mb-4 tracking-tight uppercase text-xs underline decoration-blue-200">
								IMPORTANTE - LEIA COM ATENÇÃO:
							</p>
							<ul className="space-y-4">
								<li className="flex gap-3">
									<div className="text-blue-600 mt-1 font-bold">•</div>
									<p>
										<strong>Não somos um escritório de advocacia:</strong> O serviço realiza
										auditoria técnica e documental, fornecendo um documento base (minuta).{" "}
										<strong>NÃO</strong> prestamos consultoria jurídica personalizada.
									</p>
								</li>
								<li className="flex gap-3">
									<div className="text-blue-600 mt-1 font-bold">•</div>
									<p>
										<strong>Obrigação de Meio:</strong> A elaboração do recurso constitui uma
										obrigação de meio, e não de fim. O Auto Defesa utiliza as melhores teses
										disponíveis, mas <strong>NÃO garantimos o deferimento (vitória)</strong> do
										recurso, pois a decisão final cabe exclusivamente às autoridades de trânsito.
									</p>
								</li>
								<li className="flex gap-3">
									<div className="text-blue-600 mt-1 font-bold">•</div>
									<p>
										<strong>Responsabilidade do Protocolo:</strong> Cabe exclusivamente ao Usuário a
										responsabilidade pela revisão, assinatura, impressão e protocolo (envio) do
										recurso gerado junto ao órgão competente, dentro do prazo legal.
									</p>
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									4
								</span>
								Responsabilidades do Usuário
							</h3>
							<p className="mb-4">Ao utilizar a Plataforma, o Usuário declara e se compromete a:</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>Fornecer informações verdadeiras, completas e atualizadas.</li>
								<li>
									Enviar apenas documentos e autos de infração de sua propriedade ou para os quais
									possua autorização legal.
								</li>
								<li>
									Não utilizar o serviço para fins fraudulentos ou envio de documentos falsificados.
								</li>
								<li>
									Assumir inteira responsabilidade por eventuais perdas de prazos para o protocolo
									de recursos.
								</li>
							</ul>
							<p className="mt-4 leading-relaxed font-medium text-gray-700">
								O Auto Defesa reserva-se o direito de banir usuários que utilizem a plataforma para
								fins ilícitos ou violem a propriedade intelectual do sistema.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									5
								</span>
								Pagamentos, Créditos e Reembolso
							</h3>
							<p className="mb-4 leading-relaxed text-gray-700">
								O serviço opera no modelo de <strong>créditos pré-pagos</strong> ou pagamento avulso
								por análise. Sobre os créditos adquiridos:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>Não possuem data de validade (não expiram).</li>
								<li>
									São consumidos apenas no momento da geração final do documento completo (PDF).
								</li>
								<li>
									<strong>Política de Reembolso:</strong> Devido à natureza digital e instantânea do
									serviço (entrega do documento gerado pela IA), os valores{" "}
									<strong>não são reembolsáveis</strong> após a utilização do crédito e download da
									peça, configurando a efetiva prestação do serviço.
								</li>
								<li>
									Em caso de falha técnica comprovada do nosso sistema que impeça a geração do
									documento, o crédito será restituído à conta do Usuário.
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									6
								</span>
								Demonstrações e Testes
							</h3>
							<p className="leading-relaxed text-gray-700">
								As análises prévias ou funcionalidades de demonstração gratuita ("Standard")
								utilizam modelos otimizados para velocidade e podem ter precisão analítica diferente
								dos modelos utilizados na geração do recurso final pago ("Pro/Advogado Virtual"). A
								análise de viabilidade gratuita é apenas uma estimativa algorítmica.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									7
								</span>
								Propriedade Intelectual
							</h3>
							<p className="leading-relaxed text-gray-700">
								Todos os direitos relativos à Plataforma — incluindo software, algoritmos de IA,
								design, marcas e textos gerados — pertencem exclusivamente ao Auto Defesa. É
								estritamente proibida a reprodução, engenharia reversa, uso de robôs/crawlers ou
								comercialização (revenda) dos recursos gerados sem autorização prévia.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									8
								</span>
								Limitação de Responsabilidade
							</h3>
							<p className="mb-4 leading-relaxed text-gray-700">
								O Auto Defesa <strong>NÃO</strong> se responsabiliza por:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									Indeferimento, recusa ou não conhecimento de recursos por parte dos órgãos de
									trânsito.
								</li>
								<li>
									Suspensão ou cassação da CNH decorrente do julgamento desfavorável do órgão
									julgador.
								</li>
								<li>
									Danos indiretos, lucros cessantes ou perda de oportunidades decorrentes do uso da
									plataforma.
								</li>
								<li>
									Indisponibilidade temporária do sistema por motivos de força maior ou manutenção
									de servidores parceiros (OpenAI/Google).
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									9
								</span>
								Modificações dos Termos
							</h3>
							<p className="leading-relaxed text-gray-700">
								Reservamo-nos o direito de modificar estes Termos a qualquer momento para refletir
								melhorias no sistema ou mudanças na lei. O uso continuado da Plataforma após as
								alterações constitui aceitação dos novos termos.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									10
								</span>
								Lei Aplicável e Foro
							</h3>
							<p className="leading-relaxed text-gray-700">
								Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o
								foro de Brasília/DF para dirimir quaisquer controvérsias decorrentes destes Termos,
								com renúncia expressa a qualquer outro, por mais privilegiado que seja.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									11
								</span>
								Contato e Suporte
							</h3>
							<p className="mb-4 leading-relaxed text-gray-700">
								Nosso compromisso é com a transparência técnica. Para dúvidas ou suporte, entre em
								contato com nossa equipe:
							</p>
							<p className="mb-2">
								<strong>Email:</strong>{" "}
								<a
									className="text-blue-600 font-bold hover:underline"
									href="mailto:suporte@meuautodefesa.com.br">
									suporte@meuautodefesa.com.br
								</a>
							</p>
							<p>
								Ou utilize nosso{" "}
								<Link to="/help" className="text-blue-600 font-bold hover:underline">
									formulário de atendimento
								</Link>
								.
							</p>
						</section>

						<div className="mt-12 bg-gray-50 p-8 rounded-2xl text-center border border-gray-100 shadow-inner">
							<p className="text-sm font-medium text-gray-500 italic">
								Ao clicar em "Aceitar", "Cadastrar" ou ao gerar seu primeiro recurso, você concorda
								formalmente com todas as cláusulas acima.
							</p>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Terms;
