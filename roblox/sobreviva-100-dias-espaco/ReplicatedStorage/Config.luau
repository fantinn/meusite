-- Configuração do "Sobreviva 100 Dias no Espaço".
-- ModuleScript chamado "Config" dentro de ReplicatedStorage (o servidor e o HUD usam).
-- Mude os números aqui para deixar o jogo mais fácil ou mais difícil.

local Config = {
	TITULO = "Sobreviva 100 Dias no Espaço",

	-- Tempo
	TOTAL_DIAS = 100,
	DURACAO_DIA = 45, -- segundos
	DURACAO_NOITE = 30, -- segundos

	-- Mundo
	GRAVIDADE = 50, -- a gravidade normal do Roblox é 196.2
	RAIO_MUNDO = 220, -- até onde aparecem recursos e alienígenas
	TEMPO_RENASCER_RECURSO = 40, -- segundos para um recurso coletado voltar

	-- Reator (zona segura)
	COMBUSTIVEL_INICIAL = 100,
	COMBUSTIVEL_POR_CRISTAL = 10,
	CONSUMO_DIA = 1, -- combustível gasto por segundo de dia
	CONSUMO_NOITE = 1.5, -- combustível gasto por segundo de noite
	RAIO_BASE = 18, -- raio da zona segura no nível 1 com tanque cheio
	RAIO_POR_NIVEL = 6,
	COMBUSTIVEL_POR_NIVEL = 50, -- quanto o tanque aumenta por nível
	NIVEL_MAXIMO = 5,
	CUSTO_MELHORIA = 8, -- sucata necessária = CUSTO_MELHORIA × nível atual

	-- Jogador
	FOME_POR_SEGUNDO = 0.6,
	COMIDA_RECUPERA = 35,
	OXIGENIO_PERDA = 2, -- por segundo fora da base
	OXIGENIO_GANHO = 12, -- por segundo dentro da base
	DANO_FOME = 3, -- por segundo com a fome zerada
	DANO_SEM_OXIGENIO = 6, -- por segundo com o oxigênio zerado
	RENASCER_DE_DIA = 10, -- segundos para renascer se morrer de dia

	-- Alienígenas
	MAX_INIMIGOS = 20,
	INIMIGO_VIDA = 3, -- golpes para derrotar
	INIMIGO_DANO = 15,
	INIMIGO_VELOCIDADE = 12, -- o jogador anda a 16
	INIMIGO_VELOCIDADE_MAX = 15,
	INIMIGO_ALCANCE_VISAO = 160,
	INIMIGO_ALCANCE_ATAQUE = 5,
}

-- Os três recursos. A chave (Combustivel, Material, Comida) é usada no código; o "nome" aparece na tela.
Config.RECURSOS = {
	Combustivel = {
		nome = "Cristal de Energia",
		acao = "Minerar",
		forma = "Cristal",
		cor = Color3.fromRGB(70, 255, 190),
		quantidade = 30,
		rende = 2,
	},
	Material = {
		nome = "Sucata",
		acao = "Recolher",
		forma = "Caixa",
		cor = Color3.fromRGB(140, 140, 150),
		quantidade = 25,
		rende = 2,
	},
	Comida = {
		nome = "Ração",
		acao = "Pegar",
		forma = "Capsula",
		cor = Color3.fromRGB(240, 190, 50),
		quantidade = 18,
		rende = 1,
	},
}
Config.ORDEM_RECURSOS = { "Combustivel", "Material", "Comida" }

Config.CORES = {
	reator = Color3.fromRGB(0, 200, 255),
	oxigenio = Color3.fromRGB(80, 200, 255),
	chao = Color3.fromRGB(85, 85, 95),
	alien = Color3.fromRGB(110, 230, 60),
	olhosAlien = Color3.fromRGB(255, 40, 40),
}

-- O céu fica sempre estrelado; "dia" e "noite" mudam a luz ambiente.
Config.ILUMINACAO = {
	dia = {
		Ambient = Color3.fromRGB(140, 140, 160),
		OutdoorAmbient = Color3.fromRGB(170, 170, 190),
		Brightness = 3,
	},
	noite = {
		Ambient = Color3.fromRGB(25, 25, 45),
		OutdoorAmbient = Color3.fromRGB(30, 30, 55),
		Brightness = 0.3,
	},
}

Config.MENSAGENS = {
	dia = "Colete cristais para manter o reator ligado!",
	noite = "Escureceu... os alienígenas estão chegando!",
	vitoria = "VOCÊS SOBREVIVERAM 100 DIAS NO ESPAÇO!",
}

return Config
