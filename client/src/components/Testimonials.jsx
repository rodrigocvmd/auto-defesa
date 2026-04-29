import React, { useState, useRef } from "react";
import { Star, User, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import CountUp from "./CountUp";

const REVIEWS = [
	{
		id: 1,
		name: "carlos edu henriques",
		rating: 5,
		date: "Há 2 dias",
		comment: "incrível como sai o recurso!! não protocolei ainda mas ficou perfeito",
	},
	{
		id: 2,
		name: "F. M.",
		rating: 5,
		date: "Há 1 semana",
		comment:
			"estava desesperado com uma multa de lei seca . O recurso do bafometro ficou muito bom e muito tecnico",
	},
	{
		id: 3,
		name: "ROBERTO ALMEIDA",
		rating: 3,
		date: "Há 2 semanas",
		comment: "bom recurso e sai muito rápido, só podia dar pra parcelar o pacote de 10",
	},
	{
		id: 5,
		name: "juliana cordeiro santos",
		rating: 5,
		date: "Há 3 semanas",
		comment:
			"Melhor investimento que fiz. O valor é simbólico perto do valor da multa que consegui anular.",
	},
	{
		id: 4,
		name: "Ricardo Oliveira",
		rating: 4,
		date: "Há 1 mês",
		comment:
			"Prático e rápido. O suporte tirou minhas dúvidas sobre como protocolar o documento no Detran.",
	},
	{
		id: 6,
		name: "ANA P ALMEIDA",
		rating: 5,
		date: "Há 1 mês",
		comment:
			"Incrível como a tecnologia facilita as coisas. Um recurso que levaria dias pra pesquisar ficou pronto na hora.",
	},
	{
		id: 7,
		name: "Marcos Vinicus",
		rating: 5,
		date: "Há 1 mês",
		comment: "ja indiquei para 2 amigos. fiz um de defesa prévia e me impressionou",
	},
	{
		id: 8,
		name: "lucas g",
		rating: 5,
		date: "Há 2 meses",
		comment:
			"Eficiente demais. Fiz pra uma multa injusta de estacionamento proibido. A IA ainda permite sugestões depois de gerar o recurso.",
	},
	{
		id: 9,
		name: "Beatriz costa",
		rating: 4,
		date: "Há 2 meses",
		comment:
			"funcionou direitinho recomendo! suporte tirou dúvida rápido tbm, recomendo e se eu tiver mais multas volto pra fazer a defesa aqui",
	},
	{
		id: 10,
		name: "S. Nandel",
		rating: 5,
		date: "Há 3 meses",
		comment: "Gostei bastante. e o preço muito justopro que entrega.",
	},
	{
		id: 11,
		name: "PATRICIA LEAL",
		rating: 5,
		date: "Há 3 meses",
		comment: "anulei multa de velocidade q eu nem lembrava vlw dms!!",
	},
	{
		id: 12,
		name: "Andre Estevao",
		rating: 5,
		date: "Há 4 meses",
		comment:
			"Impressionante a qualidade do texto juridico. Parece escrito por um advogado especialista mesmo. Valeu cada centavo!!",
	},
	{
		id: 13,
		name: "renato moreira",
		rating: 4,
		date: "Há 4 meses",
		comment:
			"Minha permissao tava em risco. Fiz o recurso pra ganhat tempo e esta suspenso por enquanto. Ja valeu",
	},
	{
		id: 14,
		name: "AlineSantos",
		rating: 5,
		date: "Há 5 meses",
		comment: "Site limpo e facil d usar. Nao precisei falar com ninguem, fiz tudo pelo celular",
	},
	{
		id: 15,
		name: "PEDRO HENRIQUE",
		rating: 4,
		date: "Há 5 meses",
		comment:
			"O recurso é bom, não tinha achado onde tinha baixado mas fica tudo no histórico. Depois que achei foi tranquilo.",
	},
	{
		id: 16,
		name: "Camila R",
		rating: 5,
		date: "Há 6 meses",
		comment:
			"Profissionalismo total. O documento sai formatado, pronto pra imprimir e levar no Detran. Facilitou demais minha vida.",
	},
	{
		id: 17,
		name: "Gabriel Souza",
		rating: 4,
		date: "Há 6 meses",
		comment: "volto pra avaliar melhor depois qie julgarem",
	},
	{
		id: 18,
		name: "Letícia F.",
		rating: 5,
		date: "Há 6 meses",
		comment:
			"excelente plataforma. o recurso gerado foi aceito de primeira na defesa previa. recomendo",
	},
	{
		id: 19,
		name: "bruno Oliveira",
		rating: 4,
		date: "Há 7 meses",
		comment:
			"Fiquei surpresa com a facilidade. Em menos de 10 minutos meu recurso estava pronto e muito bem fundamentado.",
	},
	{
		id: 20,
		name: "vanessa",
		rating: 5,
		date: "Há 7 meses",
		comment:
			"Ótima alternativa para quem não quer pagar caro em escritórios de trânsito. O conteúdo jurídico é forte.",
	},
	{
		id: 21,
		name: "Thiago Maral",
		rating: 5,
		date: "Há 7 meses",
		comment:
			"Usei para uma multa de sinal vermelho e deu certo! A IA identificou uma falha no auto de infração que eu não tinha visto.",
	},
	{
		id: 22,
		name: "MARIANA G",
		rating: 5,
		date: "Há 8 meses",
		comment:
			"Bom servico. Tive um probleminha com o login (nao tinha chegado o email) mas resolvi rapido. O recurso valeu a pena.",
	},
	{
		id: 23,
		name: "Felipe C Costa",
		rating: 5,
		date: "Há 8 meses",
		comment:
			"acho que vai salvar minha CNH! estou com 19 pontos e essa ultima multa ia me fazer perder a carteira. ja protocolei e esperando julgamento.",
	},
	{
		id: 24,
		name: "Isabela",
		rating: 5,
		date: "Há 8 meses",
		comment:
			"Adorei a experiência. O site é intuitivo e transmite muita confiança. O documento final é impecável.",
	},
	{
		id: 25,
		name: "GUSTAVO MOURA NEREU",
		rating: 5,
		date: "Há 9 meses",
		comment: "Recomendo a todos os motoristas. Ter uma ferramenta dessas à mão facilita e muito.",
	},
	{
		id: 26,
		name: "Débora Salgado",
		rating: 5,
		date: "Há 9 meses",
		comment:
			"Interface amigável e processo transparente. Consegui gerar minha defesa sem nenhuma complicação.",
	},
	{
		id: 27,
		name: "Leandrooo",
		rating: 5,
		date: "Há 9 meses",
		comment:
			"SENSACIONAL. A argumentação jurídica é de alto nível. Vale muito a pena para quem quer exercer seu direito de defesa.",
	},
	{
		id: 28,
		name: "Priscila B",
		rating: 5,
		date: "Há 10 meses",
		comment:
			"O suporte é excelente e a ferramenta funciona perfeitamente. Consegui anular minha multa de rodízio.",
	},
	{
		id: 29,
		name: "Marcelo JJ",
		rating: 4,
		date: "Há 10 meses",
		comment:
			"Bom custo-benefício. O recurso é bem escrito e foca nos pontos certos para o cancelamento da multa.",
	},
	{
		id: 30,
		name: "natália rodrigues",
		rating: 5,
		date: "Há 10 meses",
		comment: "facil rapido e certeiro nao imaginei q seria tao simples de fazer e abaixar",
	},
	{
		id: 31,
		name: "Igor",
		rating: 5,
		date: "Há 11 meses",
		comment:
			"Plataforma indispensável. ajudou de verdade a me defender de uma autuação que eu sabia que era irregular.",
	},
	{
		id: 32,
		name: "Bianca Noleto",
		rating: 4,
		date: "Há 11 meses",
		comment:
			"Estava com medo de ser complicado por mexer com IA, mas é realmente muito simples, até pra mim.",
	},
	{
		id: 33,
		name: "RAFAEL",
		rating: 5,
		date: "Há 11 meses",
		comment:
			"Excelente serviço. A economia que tive não contratando um advogado pagaria o crédito do site 50 vezes.",
	},
	{
		id: 34,
		name: "lurdes",
		rating: 5,
		date: "Há 1 ano",
		comment: "Gostei muito. O recurso é bem detalhado, veio com 3 capítulos e 8 argumentos bons.",
	},
	{
		id: 35,
		name: "Eduardo Vieira",
		rating: 5,
		date: "Há 1 ano",
		comment: "ótimo obrigado",
	},
	{
		id: 36,
		name: "Larissa Galvão",
		rating: 5,
		date: "Há 1 ano",
		comment:
			"Muito satisfeita com o resultado, protocolarei hoje. O processo é rápido e o suporte respondeu rápido no email.",
	},
	{
		id: 37,
		name: "Daniel",
		rating: 5,
		date: "Há 1 ano",
		comment: "Top demais.",
	},
	{
		id: 38,
		name: "claudia milacruz",
		rating: 5,
		date: "Há 1 ano",
		comment: "recomendo d olhos fechados. é a solução",
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
					<h2 className="text-3xl font-black text-gray-900 mb-4">O que dizem nossos usuários:</h2>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Junte-se a milhares de motoristas que protegeram seus direitos com o Auto Defesa.
					</p>

					<div className="flex-col">
						<div className="flex items-center justify-center gap-2 mt-4 text-yellow-500 font-bold">
							<span className="text-2xl text-gray-900">
								<CountUp end={4.7} decimals={1} />
							</span>
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
						<span className="text-sm text-gray-600 font-normal">
							(Baseado em <strong>38 avaliações</strong>)
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
										<div>
											<p className="font-bold text-gray-900 text-sm">{review.name}</p>
											<p className="text-xs text-gray-600">{review.date}</p>
										</div>
									</div>
									<Quote size={24} className="text-gray-600" />
								</div>

								<div className="flex text-yellow-400 mb-3">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={16}
											fill={i < review.rating ? "currentColor" : "none"}
											className={i < review.rating ? "text-yellow-400" : "text-gray-600"}
										/>
									))}
								</div>

								<p className="text-gray-600 text-sm leading-relaxed italic">"{review.comment}"</p>
							</div>
						))}
					</div>
				</div>

				<div className="text-center mt-4 text-gray-600 text-sm animate-pulse">
					Arraste para o lado para ver mais <ChevronRight size={14} className="inline" />
				</div>
			</div>
		</section>
	);
};

export default Testimonials;
