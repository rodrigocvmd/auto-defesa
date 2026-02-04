import React from "react";
import MainLayout from "../layouts/MainLayout";
import { ArrowLeft, Info } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
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
						<Info className="text-blue-600" size={32} />
						<h1 className="text-3xl font-black text-gray-900">Sobre Nós</h1>
					</div>

					<div className="prose prose-blue max-w-none text-gray-600">
						<h3>Nossa Missão</h3>
						<p>
							[Placeholder: Descreva aqui a missão da plataforma AutoDefesa. Ex: Facilitar o acesso à justiça administrativa de trânsito através da tecnologia.]
						</p>

						<h3>Como Surgimos</h3>
						<p>
							[Placeholder: Conte um pouco sobre a história da criação do AutoDefesa e o problema que buscamos resolver.]
						</p>

						<h3>O Fundador</h3>
						<p>
							[Placeholder: Informações sobre o fundador, sua experiência e motivação para criar esta ferramenta.]
						</p>

						<h3>Nossa Tecnologia</h3>
						<p>
							[Placeholder: Explique brevemente como a Inteligência Artificial auxilia na elaboração dos recursos, garantindo agilidade e embasamento técnico.]
						</p>

						<h3>Compromisso com o Usuário</h3>
						<p>
							[Placeholder: Fale sobre o foco na satisfação do cliente e na transparência dos processos.]
						</p>

						<div className="mt-12 bg-blue-50 p-6 rounded-2xl border border-blue-100">
							<h4 className="text-blue-900 font-bold mb-2">Precisa de ajuda?</h4>
							<p className="text-blue-800 text-sm mb-4">
								Se você tiver qualquer dúvida ou sugestão, nossa equipe está pronta para te ouvir.
							</p>
							<Link
								to="/help"
								className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
								Entre em Contato
							</Link>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default About;
