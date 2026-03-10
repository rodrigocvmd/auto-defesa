import React from "react";
import MainLayout from "../layouts/MainLayout";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
						<div className="bg-green-50 p-3 rounded-2xl text-green-600">
							<Lock size={32} />
						</div>
						<div>
							<h1 className="text-3xl font-black text-gray-900">Política de Privacidade</h1>
							<p className="text-sm text-gray-400 mt-1 uppercase tracking-wider font-bold">
								Última atualização: {formattedDate}
							</p>
						</div>
					</div>

					<div className="prose prose-blue max-w-none text-gray-600 space-y-8">
						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									1
								</span>
								Introdução
							</h3>
							<p className="leading-relaxed">
								O <strong>Auto Defesa</strong> ("nós", "nosso" ou "Plataforma") está comprometido em
								proteger a privacidade e a segurança dos dados de seus usuários. Esta Política de
								Privacidade descreve, de forma transparente, como coletamos, usamos, armazenamos e
								protegemos suas informações pessoais em conformidade com a Lei Geral de Proteção de
								Dados (Lei nº 13.709/2018 - LGPD).
							</p>
							<p className="mt-4 leading-relaxed">
								Ao utilizar nossos serviços, você entende que coletaremos e usaremos suas
								informações pessoais nas formas descritas nesta Política, sob as normas de Proteção
								de Dados (LGPD, Marco Civil da Internet e demais normas do ordenamento jurídico
								brasileiro).
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									2
								</span>
								Quais Dados Coletamos?
							</h3>
							<p className="mb-4 leading-relaxed">
								Para a prestação dos serviços de defesa técnica automatizada, coletamos apenas os
								dados estritamente necessários:
							</p>
							<ul className="space-y-4">
								<li className="flex flex-col md:flex-row md:gap-2">
									<strong className="text-gray-900 md:shrink-0">• Dados de Identificação:</strong>
									<span>
										Nome completo, CPF, RG, E-mail e Telefone (para criação de conta e qualificação
										na peça jurídica).
									</span>
								</li>
								<li className="flex flex-col md:flex-row md:gap-2">
									<strong className="text-gray-900 md:shrink-0">
										• Dados do Veículo e Infração:
									</strong>
									<span>
										Placa, número do Auto de Infração (AIT), descrição dos fatos, data/hora da
										infração e cópia da Notificação de Autuação.
									</span>
								</li>
								<li className="flex flex-col md:flex-row md:gap-2">
									<strong className="text-gray-900 md:shrink-0">• Dados de Navegação:</strong>
									<span>
										Endereço IP, tipo de navegador, logs de acesso e interações com a plataforma
										(para segurança e auditoria).
									</span>
								</li>
								<li className="flex flex-col md:flex-row md:gap-2">
									<strong className="text-gray-900 md:shrink-0">• Dados Financeiros:</strong>
									<span>
										Não armazenamos dados de cartão de crédito. O processamento é feito
										integralmente por nosso parceiro de pagamentos (Stripe), restando a nós apenas a
										confirmação da transação.
									</span>
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									3
								</span>
								Como Usamos Seus Dados (Finalidade)
							</h3>
							<p className="mb-4 leading-relaxed">
								Seus dados têm destinação específica e legítima:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									<strong>Prestação do Serviço:</strong> Gerar, via Inteligência Artificial, os
									recursos administrativos personalizados e juridicamente fundamentados.
								</li>
								<li>
									<strong>Melhoria da IA:</strong> Utilizar dados anonimizados (sem identificação
									pessoal) para treinar e refinar nossos modelos de defesa.
								</li>
								<li>
									<strong>Comunicação:</strong> Enviar atualizações sobre sua conta, status de
									pagamentos ou alterações nesta política.
								</li>
								<li>
									<strong>Segurança:</strong> Prevenir fraudes, atividades ilegais e garantir a
									integridade da plataforma.
								</li>
								<li>
									<strong>Cumprimento Legal:</strong> Atender a obrigações legais, regulatórias ou
									ordens judiciais.
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									4
								</span>
								Bases Legais para o Tratamento
							</h3>
							<p className="mb-4 leading-relaxed">
								A LGPD exige que tenhamos uma base legal para tratar seus dados. No Auto Defesa,
								operamos sob:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									<strong>Execução de Contrato:</strong> Para entregar o serviço que você contratou
									(o recurso de multa).
								</li>
								<li>
									<strong>Legítimo Interesse:</strong> Para apoio e promoção de nossas atividades e
									segurança dos usuários.
								</li>
								<li>
									<strong>Cumprimento de Obrigação Legal:</strong> Para guarda de registros de
									acesso (Marco Civil da Internet) e dados fiscais.
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									5
								</span>
								Compartilhamento de Dados
							</h3>
							<p className="mb-4 leading-relaxed">
								<strong>Não vendemos seus dados pessoais.</strong> O compartilhamento ocorre apenas
								com parceiros essenciais para a operação:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>
									<strong>Infraestrutura e IA:</strong> Google Cloud Platform e OpenAI
									(processamento de dados e geração de texto).
								</li>
								<li>
									<strong>Pagamentos:</strong> Stripe (processamento financeiro seguro).
								</li>
								<li>
									<strong>Autoridades:</strong> Apenas quando estritamente exigido por lei ou ordem
									judicial.
								</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									6
								</span>
								Segurança e Armazenamento
							</h3>
							<p className="leading-relaxed">
								Adotamos práticas de segurança de nível bancário, incluindo criptografia SSL/TLS em
								trânsito e criptografia em repouso nos servidores. Seus dados são armazenados em
								ambiente nuvem seguro (Firebase/Google Cloud). Embora adotemos as melhores práticas,
								nenhum sistema é completamente imune a riscos, mas nos comprometemos a agir com
								transparência em qualquer incidente.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									7
								</span>
								Retenção de Dados
							</h3>
							<p className="leading-relaxed">
								Manteremos seus dados pessoais somente pelo tempo que for necessário para cumprir
								com as finalidades para as quais os coletamos, inclusive para fins de cumprimento de
								quaisquer obrigações legais, contratuais, ou de prestação de contas.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									8
								</span>
								Seus Direitos (Titular dos Dados)
							</h3>
							<p className="mb-4 leading-relaxed">
								Conforme a LGPD, você tem total controle sobre seus dados:
							</p>
							<ul className="list-disc pl-5 space-y-2">
								<li>Confirmar a existência de tratamento de dados.</li>
								<li>Acessar seus dados de forma facilitada.</li>
								<li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
								<li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
								<li>Revogar o consentimento a qualquer momento.</li>
							</ul>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									9
								</span>
								Cookies
							</h3>
							<p className="leading-relaxed">
								Utilizamos cookies essenciais para autenticação (saber que é você logado) e
								segurança. Você pode gerenciar as permissões de cookies diretamente nas
								configurações do seu navegador.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
								<span className="bg-green-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 font-bold">
									10
								</span>
								Contato (DPO)
							</h3>
							<p className="leading-relaxed">
								Para exercer seus direitos de titular ou esclarecer dúvidas, entre em contato com
								nosso Encarregado de Proteção de Dados através do e-mail:{" "}
								<a
									className="text-blue-600 font-bold hover:underline"
									href="mailto:suporte@meuautodefesa.com.br">
									suporte@meuautodefesa.com.br
								</a>
							</p>
							<p className="mt-8 text-sm font-medium text-gray-500 italic text-center">
								Ao utilizar o Auto Defesa, você declara estar ciente desta Política de Privacidade.
							</p>
						</section>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Privacy;
