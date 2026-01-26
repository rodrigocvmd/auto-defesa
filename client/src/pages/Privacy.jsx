import React from "react";
import MainLayout from "../layouts/MainLayout";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
	return (
		<MainLayout>
			<div className="max-w-4xl mx-auto py-12 px-4">
				<Link
					to="/"
					className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors">
					<ArrowLeft size={20} className="mr-1" /> Voltar para Início
				</Link>

				<div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
					<div className="flex items-center gap-3 mb-8 border-b pb-6">
						<Lock className="text-green-600" size={32} />
						<h1 className="text-3xl font-black text-gray-900">Política de Privacidade</h1>
					</div>

					<div className="prose prose-green max-w-none text-gray-600">
						<h3>1. Coleta de Dados</h3>
						<p>
							Para a prestação dos serviços do <strong>AutoDefesa</strong>, coletamos os seguintes
							dados:
						</p>
						<ul>
							<li>
								<strong>Dados Pessoais:</strong> Nome, CPF, RG, Endereço, E-mail e Telefone.
							</li>
							<li>
								<strong>Dados do Veículo/Infração:</strong> Placa, Renavam, AIT (Auto de Infração),
								descrições e fotos da notificação.
							</li>
						</ul>
						<p>
							Esses dados são estritamente necessários para o preenchimento automático das peças
							jurídicas (recursos) conforme exigido pela legislação de trânsito, e não ficam salvos
							em nossos servidores.
						</p>

						<h3>2. Uso das Informações</h3>
						<p>As informações coletadas são utilizadas exclusivamente para:</p>
						<ul>
							<li>Gerar os documentos de defesa personalizados.</li>
							<li>Processar pagamentos e gerenciar sua conta.</li>
							<li>Melhorar nossos algoritmos de inteligência artificial (de forma anonimizada).</li>
						</ul>
						<p>
							<strong>Não armazenamos ou vendemos seus dados pessoais para terceiros.</strong>
						</p>

						<h3>3. Segurança</h3>
						<p>
							Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo
							criptografia em trânsito (SSL/TLS) e armazenamento seguro em servidores de nuvem
							(Firebase/Google Cloud) com acesso restrito.
						</p>

						<h3>4. Compartilhamento com Terceiros</h3>
						<p>
							Seus dados podem ser processados por provedores de serviço parceiros essenciais para o
							funcionamento da plataforma, tais como:
						</p>
						<ul>
							<li>Processadores de pagamento (Stripe).</li>
							<li>Provedores de infraestrutura de nuvem e IA (Google/OpenAI).</li>
						</ul>
						<p>
							Esses parceiros estão obrigados a manter a confidencialidade e segurança dos dados.
						</p>

						<h3>5. Seus Direitos (LGPD)</h3>
						<p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
						<ul>
							<li>Solicitar o acesso aos seus dados.</li>
							<li>Solicitar a correção de dados incompletos ou inexatos.</li>
							<li>
								Solicitar a exclusão de seus dados (salvo quando a retenção for exigida por lei).
							</li>
						</ul>

						<h3>6. Cookies</h3>
						<p>
							Utilizamos cookies essenciais para autenticação e funcionamento do site. Você pode
							gerenciar as preferências de cookies nas configurações do seu navegador.
						</p>

						<h3>7. Contato do Encarregado (DPO)</h3>
						<p>
							Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com
							nosso Encarregado de Proteção de Dados pelo número{" "}
							<a
								href="https://wa.me/5561999662404"
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-500 hover:text-blue-600 font-medium transition-colors underline">
								+5561999662404
							</a>{" "}
							ou pelo{" "}
							<Link
								to="/help"
								className="text-gray-500 hover:text-blue-600 font-medium transition-colors underline">
								formulário
							</Link>
							&nbsp;de contato.
						</p>
						<br></br>
						<p className="lead">Atualizado em Janeiro de 2026.</p>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default Privacy;
