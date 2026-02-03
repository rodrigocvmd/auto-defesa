import React, { useState } from "react";
import { Star, User, Quote } from "lucide-react";

const REVIEWS = [
	{
		id: 1,
		name: "Carlos Eduardo",
		rating: 5,
		date: "Há 2 dias",
		comment:
			"Eu estava desesperado com uma multa de Lei Seca. A plataforma me ajudou a montar um recurso super técnico. O atendimento no suporte também foi nota 10.",
	},
	{
		id: 2,
		name: "Fernanda S.",
		rating: 5,
		date: "Há 1 semana",
		comment:
			"Muito prático. Tirei a foto da notificação e em minutos já tinha uma prévia da defesa. Recomendo para quem não quer gastar com despachante.",
	},
	{
		id: 3,
		name: "Roberto Almeida",
		rating: 4,
		date: "Há 2 semanas",
		comment:
			"O sistema é bom, mas tive uma dúvida na hora de pagar. O suporte me ajudou rápido, mas poderia ser mais claro no site. O recurso em si ficou excelente.",
	},
	{
		id: 4,
		name: "Juliana Mendes",
		rating: 5,
		date: "Há 3 semanas",
		comment:
			"Consegui anular uma multa de velocidade que eu nem lembrava de ter levado. A argumentação sobre a aferição do radar foi o ponto chave. Obrigada!",
	},
	{
		id: 5,
		name: "Ricardo Oliveira",
		rating: 5,
		date: "Há 1 mês",
		comment:
			"Impressionante a qualidade do texto jurídico. Parece escrito por um advogado especialista mesmo. Valeu cada centavo.",
	},
	{
		id: 6,
		name: "Ana Paula",
		rating: 4,
		date: "Há 1 mês",
		comment:
			"Gostei bastante. Só achei que poderia ter opção de parcelar em mais vezes, mas o preço é justo pelo que entrega.",
	},
	{
		id: 7,
		name: "Marcos V.",
		rating: 5,
		date: "Há 1 mês",
		comment:
			"Minha PPD estava em risco. Fiz o recurso para ganhar tempo e acabou que a multa caducou. Salvei minha carteira!",
	},
	{
		id: 8,
		name: "Lucas G.",
		rating: 5,
		date: "Há 2 meses",
		comment:
			"Interface limpa e fácil de usar. Não precisei falar com ninguém, fiz tudo pelo celular no horário do almoço.",
	},
	{
		id: 9,
		name: "Beatriz Costa",
		rating: 3,
		date: "Há 2 meses",
		comment:
			"O recurso é bom, mas demorei um pouco pra entender onde baixar o PDF final. Depois que achei, foi tranquilo.",
	},
	{
		id: 10,
		name: "Sérgio N.",
		rating: 5,
		date: "Há 3 meses",
		comment:
			"Já indiquei para dois amigos. O recurso de multa de bafômetro é muito completo, cita leis que eu nem sabia que existiam.",
	},
	{
		id: 11,
		name: "Patrícia L.",
		rating: 5,
		date: "Há 3 meses",
		comment:
			"Profissionalismo total. O documento sai formatado, pronto pra imprimir e levar no Detran. Facilitou demais minha vida.",
	},
	{
		id: 12,
		name: "André F.",
		rating: 4,
		date: "Há 4 meses",
		comment:
			"Bom serviço. Tive um problema com o login mas resolvi rápido redefinindo a senha. O recurso valeu a pena.",
	},
];

const Testimonials = () => {
	const [showAll, setShowAll] = useState(false);
	const displayedReviews = showAll ? REVIEWS : REVIEWS.slice(0, 6);

	return (
		<section className="py-16 bg-white border-t border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-black text-gray-900 mb-4">O que dizem nossos usuários</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Junte-se a milhares de motoristas que protegeram seus direitos com o Auto Defesa.
					</p>

					<div className="flex-col">
						<div className="flex items-center justify-center gap-2 mt-4 text-yellow-500 font-bold">
							<span className="text-2xl text-gray-900">4.6</span>
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={20}
										fill="currentColor"
										className={i < 4 ? "" : "text-yellow-400"}
									/>
								))}
							</div>
							<div></div>
						</div>
						<span className="text-sm text-gray-500 font-normal">
							(Baseado em <strong>38 avaliações</strong>)
						</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayedReviews.map((review) => (
						<div
							key={review.id}
							className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-3">
									<div className="bg-blue-100 p-2 rounded-full text-blue-600">
										<User size={20} />
									</div>
									<div>
										<p className="font-bold text-gray-900 text-sm">{review.name}</p>
										<p className="text-xs text-gray-500">{review.date}</p>
									</div>
								</div>
								<Quote size={24} className="text-gray-200" />
							</div>

							<div className="flex text-yellow-400 mb-3">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										size={16}
										fill={i < review.rating ? "currentColor" : "none"}
										className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
									/>
								))}
							</div>

							<p className="text-gray-600 text-sm leading-relaxed">"{review.comment}"</p>
						</div>
					))}
				</div>

				{!showAll && (
					<div className="text-center mt-12">
						<button
							onClick={() => setShowAll(true)}
							className="bg-white border border-gray-300 text-gray-700 font-bold py-3 px-8 rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all">
							Ver mais avaliações
						</button>
					</div>
				)}
			</div>
		</section>
	);
};

export default Testimonials;
