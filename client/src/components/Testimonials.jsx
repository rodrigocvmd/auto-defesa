import React, { useState, useRef } from "react";
import { Star, User, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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
	{
		id: 13,
		name: "Rodrigo M.",
		rating: 5,
		date: "Há 4 meses",
		comment:
			"Excelente plataforma. O recurso gerado foi aceito de primeira na defesa prévia. Recomendo fortemente.",
	},
	{
		id: 14,
		name: "Aline Santos",
		rating: 5,
		date: "Há 5 meses",
		comment:
			"Fiquei surpresa com a facilidade. Em menos de 10 minutos meu recurso estava pronto e muito bem fundamentado.",
	},
	{
		id: 15,
		name: "Pedro Henrique",
		rating: 4,
		date: "Há 5 meses",
		comment:
			"Ótima alternativa para quem não quer pagar caro em escritórios de trânsito. O conteúdo jurídico é muito sólido.",
	},
	{
		id: 16,
		name: "Camila R.",
		rating: 5,
		date: "Há 6 meses",
		comment:
			"Usei para uma multa de sinal vermelho e deu certo! A IA identificou uma falha na sinalização que eu não tinha visto.",
	},
	{
		id: 17,
		name: "Gabriel Souza",
		rating: 5,
		date: "Há 6 meses",
		comment:
			"Muito bom mesmo. O passo a passo é simples e o resultado final é um documento extremamente profissional.",
	},
	{
		id: 18,
		name: "Letícia F.",
		rating: 5,
		date: "Há 6 meses",
		comment:
			"Salvou minha CNH! Estava com 19 pontos e essa última multa ia me fazer perder a carteira. O recurso foi deferido.",
	},
	{
		id: 19,
		name: "Bruno Oliveira",
		rating: 4,
		date: "Há 7 meses",
		comment:
			"Prático e rápido. O suporte tirou minhas dúvidas sobre como protocolar o documento no site do Detran.",
	},
	{
		id: 20,
		name: "Vanessa K.",
		rating: 5,
		date: "Há 7 meses",
		comment:
			"Melhor investimento que fiz. O valor é simbólico perto do valor da multa que consegui anular.",
	},
	{
		id: 21,
		name: "Thiago Silva",
		rating: 5,
		date: "Há 7 meses",
		comment:
			"Incrível como a tecnologia facilita as coisas. Um recurso que levaria dias pra pesquisar ficou pronto na hora.",
	},
	{
		id: 22,
		name: "Mariana G.",
		rating: 5,
		date: "Há 8 meses",
		comment:
			"Adorei a experiência. O site é intuitivo e transmite muita confiança. O documento final é impecável.",
	},
	{
		id: 23,
		name: "Felipe Costa",
		rating: 5,
		date: "Há 8 meses",
		comment:
			"Eficiente demais. Consegui cancelar uma multa injusta de estacionamento proibido. A IA é muito inteligente.",
	},
	{
		id: 24,
		name: "Isabela M.",
		rating: 4,
		date: "Há 8 meses",
		comment:
			"Muito bom o serviço. O documento vem bem organizado e com todas as citações legais necessárias.",
	},
	{
		id: 25,
		name: "Gustavo P.",
		rating: 5,
		date: "Há 9 meses",
		comment:
			"Recomendo a todos os motoristas. Ter uma ferramenta dessas à mão traz muito mais segurança no trânsito.",
	},
	{
		id: 26,
		name: "Débora S.",
		rating: 5,
		date: "Há 9 meses",
		comment:
			"Interface amigável e processo transparente. Consegui gerar minha defesa sem nenhuma complicação.",
	},
	{
		id: 27,
		name: "Leonardo T.",
		rating: 5,
		date: "Há 9 meses",
		comment:
			"Sensacional. A argumentação jurídica é de alto nível. Vale muito a pena para quem quer exercer seu direito de defesa.",
	},
	{
		id: 28,
		name: "Priscila B.",
		rating: 5,
		date: "Há 10 meses",
		comment:
			"O suporte é excelente e a ferramenta funciona perfeitamente. Consegui anular minha multa de rodízio.",
	},
	{
		id: 29,
		name: "Marcelo J.",
		rating: 4,
		date: "Há 10 meses",
		comment:
			"Bom custo-benefício. O recurso é bem escrito e foca nos pontos certos para o cancelamento da multa.",
	},
	{
		id: 30,
		name: "Natália R.",
		rating: 5,
		date: "Há 10 meses",
		comment:
			"Fácil, rápido e certeiro. Não imaginei que seria tão simples recorrer de uma multa de trânsito.",
	},
	{
		id: 31,
		name: "Igor C.",
		rating: 5,
		date: "Há 11 meses",
		comment:
			"Plataforma indispensável. Me ajudou a entender melhor meus direitos e a me defender de uma autuação irregular.",
	},
	{
		id: 32,
		name: "Bianca L.",
		rating: 5,
		date: "Há 11 meses",
		comment:
			"Estava com medo de ser complicado, mas o site me guiou em tudo. O recurso ficou pronto instantaneamente.",
	},
	{
		id: 33,
		name: "Rafael S.",
		rating: 5,
		date: "Há 11 meses",
		comment:
			"Excelente serviço. A economia que tive não contratando um advogado pagou o crédito da plataforma várias vezes.",
	},
	{
		id: 34,
		name: "Tatiane M.",
		rating: 4,
		date: "Há 1 ano",
		comment:
			"Gostei muito. O recurso é bem detalhado e cita jurisprudências atualizadas do CONTRAN.",
	},
	{
		id: 35,
		name: "Eduardo V.",
		rating: 5,
		date: "Há 1 ano",
		comment:
			"Ferramenta poderosa. Consegui reverter uma situação difícil com um recurso muito bem elaborado pela IA.",
	},
	{
		id: 36,
		name: "Larissa G.",
		rating: 5,
		date: "Há 1 ano",
		comment: "Muito satisfeita com o resultado. O processo é rápido e o suporte é muito atencioso.",
	},
	{
		id: 37,
		name: "Daniel F.",
		rating: 5,
		date: "Há 1 ano",
		comment:
			"Top demais. Já usei duas vezes e nas duas tive sucesso nos recursos. A IA realmente sabe o que faz.",
	},
	{
		id: 38,
		name: "Cláudia R.",
		rating: 5,
		date: "Há 1 ano",
		comment:
			"Recomendo de olhos fechados. Uma solução moderna e eficiente para um problema antigo e burocrático.",
	},
];

const Testimonials = () => {
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (scrollRef.current) {
			const { scrollLeft, clientWidth } = scrollRef.current;
			const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
			scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
		}
	};

	return (
		<section className="py-16 bg-white border-t border-gray-100 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-black text-gray-900 mb-4">O que dizem nossos usuários</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Junte-se a milhares de motoristas que protegeram seus direitos com o Auto Defesa.
					</p>

					<div className="flex-col">
						<div className="flex items-center justify-center gap-2 mt-4 text-yellow-500 font-bold">
							<span className="text-2xl text-gray-900">4.8</span>
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
						</div>
						<span className="text-sm text-gray-500 font-normal">
							(Baseado em <strong>647 avaliações</strong>)
						</span>
					</div>
				</div>

				<div className="relative group">
					{/* Navigation Arrows */}
					<button
						onClick={() => scroll("left")}
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-xl border border-gray-100 p-3 rounded-full text-gray-600 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
						<ChevronLeft size={24} />
					</button>
					<button
						onClick={() => scroll("right")}
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-xl border border-gray-100 p-3 rounded-full text-gray-600 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100 hidden md:block">
						<ChevronRight size={24} />
					</button>

					{/* Slider Container */}
					<div
						ref={scrollRef}
						className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide no-scrollbar"
						style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
						{REVIEWS.map((review) => (
							<div
								key={review.id}
								className="flex-none w-[300px] md:w-[350px] bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow snap-start">
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

								<p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
							</div>
						))}
					</div>
				</div>

				<div className="text-center mt-4 text-gray-400 text-sm animate-pulse">
					Arraste para o lado para ver mais <ChevronRight size={14} className="inline" />
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
