-- Constrói a base lunar (chão, crateras, recursos, reator, zona segura) e controla a iluminação.
-- ModuleScript chamado "Mundo" dentro de ServerScriptService.

local Workspace = game:GetService("Workspace")
local Lighting = game:GetService("Lighting")
local TweenService = game:GetService("TweenService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Config = require(ReplicatedStorage:WaitForChild("Config"))

local Mundo = {}

local CENTRO = Vector3.new(0, 0, 0)

local pastaMundo
local pastaRecursos
local zona
local luzReator
local nucleoReator

local function novaParte(classe, props, pai)
	local parte = Instance.new(classe)
	parte.Anchored = true
	parte.TopSurface = Enum.SurfaceType.Smooth
	parte.BottomSurface = Enum.SurfaceType.Smooth
	for chave, valor in props do
		parte[chave] = valor
	end
	parte.Parent = pai
	return parte
end

local function pontoAleatorio(raioMin, raioMax)
	local angulo = math.random() * math.pi * 2
	local raio = raioMin + math.sqrt(math.random()) * (raioMax - raioMin)
	return Vector3.new(CENTRO.X + math.cos(angulo) * raio, CENTRO.Y, CENTRO.Z + math.sin(angulo) * raio)
end

-- Formas dos recursos. Cada uma recebe o Model, o ponto no chão e a cor, e devolve a parte principal.
local formas = {}

function formas.Cristal(modelo, base, cor)
	local principal = novaParte("Part", {
		Size = Vector3.new(2.5, 6, 2.5),
		Color = cor,
		Material = Enum.Material.Neon,
		Transparency = 0.1,
		CFrame = CFrame.new(base + Vector3.new(0, 2.5, 0)) * CFrame.Angles(0, math.rad(45), math.rad(8)),
	}, modelo)
	novaParte("Part", {
		Size = Vector3.new(1.5, 3.5, 1.5),
		Color = cor,
		Material = Enum.Material.Neon,
		Transparency = 0.1,
		CFrame = CFrame.new(base + Vector3.new(1.8, 1.2, 0.6)) * CFrame.Angles(0, 0, math.rad(-30)),
	}, modelo)
	novaParte("Part", {
		Size = Vector3.new(1.2, 2.5, 1.2),
		Color = cor,
		Material = Enum.Material.Neon,
		Transparency = 0.1,
		CFrame = CFrame.new(base + Vector3.new(-1.5, 0.9, -0.8)) * CFrame.Angles(0, 0, math.rad(25)),
	}, modelo)
	return principal
end

function formas.Caixa(modelo, base, cor)
	local caixa = novaParte("Part", {
		Size = Vector3.new(4, 3, 4),
		Color = cor,
		Material = Enum.Material.DiamondPlate,
		CFrame = CFrame.new(base + Vector3.new(0, 1.5, 0)) * CFrame.Angles(0, math.random() * math.pi, 0),
	}, modelo)
	novaParte("Part", {
		Size = Vector3.new(4.1, 0.5, 4.1),
		Color = Color3.fromRGB(230, 180, 30),
		Material = Enum.Material.SmoothPlastic,
		CanCollide = false,
		CFrame = caixa.CFrame,
	}, modelo)
	return caixa
end

function formas.Capsula(modelo, base, cor)
	local corpo = novaParte("Part", {
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(3, 2, 2),
		Color = cor,
		Material = Enum.Material.Metal,
		CFrame = CFrame.new(base + Vector3.new(0, 1, 0)) * CFrame.Angles(0, math.random() * math.pi, 0),
	}, modelo)
	novaParte("Part", {
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(0.6, 0.6, 0.6),
		Color = Color3.fromRGB(80, 255, 80),
		Material = Enum.Material.Neon,
		CanCollide = false,
		CFrame = corpo.CFrame * CFrame.new(0, 1, 0),
	}, modelo)
	return corpo
end

local function criarRecurso(tipo, def, base, aoColetar)
	local modelo = Instance.new("Model")
	modelo.Name = def.nome
	local principal = formas[def.forma](modelo, base, def.cor)
	modelo.PrimaryPart = principal
	modelo.Parent = pastaRecursos

	-- Guarda a aparência original para restaurar quando o recurso voltar
	local originais = {}
	for _, parte in modelo:GetDescendants() do
		if parte:IsA("BasePart") then
			originais[parte] = { parte.Transparency, parte.CanCollide }
		end
	end

	local prompt = Instance.new("ProximityPrompt")
	prompt.ActionText = def.acao
	prompt.ObjectText = def.nome
	prompt.HoldDuration = 0.8
	prompt.MaxActivationDistance = 12
	prompt.RequiresLineOfSight = false
	prompt.KeyboardKeyCode = Enum.KeyCode.E
	prompt.Parent = principal

	prompt.Triggered:Connect(function(jogador)
		if not prompt.Enabled then
			return
		end
		prompt.Enabled = false
		aoColetar(jogador, tipo, def.rende)

		for parte in originais do
			parte.Transparency = 1
			parte.CanCollide = false
		end

		task.delay(Config.TEMPO_RENASCER_RECURSO, function()
			for parte, valores in originais do
				parte.Transparency = valores[1]
				parte.CanCollide = valores[2]
			end
			prompt.Enabled = true
		end)
	end)
end

local function construirChao()
	local tamanho = Config.RAIO_MUNDO * 2 + 200
	novaParte("Part", {
		Name = "Chao",
		Size = Vector3.new(tamanho, 4, tamanho),
		Color = Config.CORES.chao,
		Material = Enum.Material.Slate,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, -2, 0)),
	}, pastaMundo)

	-- Crateras (decoração)
	for _ = 1, 30 do
		local ponto = pontoAleatorio(30, Config.RAIO_MUNDO + 60)
		local diametro = math.random(10, 30)
		novaParte("Part", {
			Name = "Cratera",
			Shape = Enum.PartType.Cylinder,
			Size = Vector3.new(0.3, diametro, diametro),
			Color = Color3.fromRGB(60, 60, 68),
			Material = Enum.Material.Slate,
			CanCollide = false,
			CFrame = CFrame.new(ponto + Vector3.new(0, 0.05, 0)) * CFrame.Angles(0, 0, math.rad(90)),
		}, pastaMundo)
	end

	-- Pedras (decoração)
	for _ = 1, 45 do
		local ponto = pontoAleatorio(25, Config.RAIO_MUNDO + 60)
		local tamanhoPedra = math.random(2, 6)
		novaParte("Part", {
			Name = "Pedra",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(tamanhoPedra, tamanhoPedra, tamanhoPedra),
			Color = Color3.fromRGB(105, 105, 115),
			Material = Enum.Material.Slate,
			CFrame = CFrame.new(ponto + Vector3.new(0, tamanhoPedra * 0.2, 0)),
		}, pastaMundo)
	end

	-- Planeta Terra no céu
	novaParte("Part", {
		Name = "Planeta",
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(500, 500, 500),
		Color = Color3.fromRGB(60, 120, 220),
		Material = Enum.Material.SmoothPlastic,
		CanCollide = false,
		CanQuery = false,
		CastShadow = false,
		CFrame = CFrame.new(CENTRO + Vector3.new(900, 450, -1300)),
	}, pastaMundo)
end

local function construirBase(aoAbastecer, aoMelhorar)
	-- Domos de habitação
	for _, posicao in { Vector3.new(-16, 0, -8), Vector3.new(16, 0, -8) } do
		novaParte("Part", {
			Name = "Domo",
			Shape = Enum.PartType.Ball,
			Size = Vector3.new(12, 12, 12),
			Color = Color3.fromRGB(220, 230, 240),
			Material = Enum.Material.Glass,
			Transparency = 0.3,
			CFrame = CFrame.new(CENTRO + posicao),
		}, pastaMundo)
	end

	-- Antena
	novaParte("Part", {
		Name = "Antena",
		Size = Vector3.new(0.6, 16, 0.6),
		Color = Color3.fromRGB(180, 180, 190),
		Material = Enum.Material.Metal,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, 8, -16)),
	}, pastaMundo)
	novaParte("Part", {
		Name = "LuzAntena",
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(1.2, 1.2, 1.2),
		Color = Color3.fromRGB(255, 50, 50),
		Material = Enum.Material.Neon,
		CanCollide = false,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, 16.5, -16)),
	}, pastaMundo)

	-- Reator
	local modelo = Instance.new("Model")
	modelo.Name = "Reator"
	novaParte("Part", {
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(1.5, 9, 9),
		Color = Color3.fromRGB(80, 80, 95),
		Material = Enum.Material.Metal,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, 0.75, 0)) * CFrame.Angles(0, 0, math.rad(90)),
	}, modelo)
	for i = 1, 3 do
		local angulo = i * math.pi * 2 / 3
		novaParte("Part", {
			Size = Vector3.new(0.8, 6, 0.8),
			Color = Color3.fromRGB(120, 120, 135),
			Material = Enum.Material.Metal,
			CFrame = CFrame.new(CENTRO + Vector3.new(math.cos(angulo) * 3.2, 4, math.sin(angulo) * 3.2)),
		}, modelo)
	end
	nucleoReator = novaParte("Part", {
		Name = "Nucleo",
		Shape = Enum.PartType.Ball,
		Size = Vector3.new(4, 4, 4),
		Color = Config.CORES.reator,
		Material = Enum.Material.Neon,
		CanCollide = false,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, 4.5, 0)),
	}, modelo)
	modelo.PrimaryPart = nucleoReator
	modelo.Parent = pastaMundo

	luzReator = Instance.new("PointLight")
	luzReator.Color = Config.CORES.reator
	luzReator.Range = 40
	luzReator.Brightness = 2
	luzReator.Shadows = true
	luzReator.Parent = nucleoReator

	-- Cada prompt usa uma tecla diferente: o Roblox mostra só um prompt por tecla
	local promptAbastecer = Instance.new("ProximityPrompt")
	promptAbastecer.ActionText = "Abastecer"
	promptAbastecer.ObjectText = "Reator"
	promptAbastecer.KeyboardKeyCode = Enum.KeyCode.E
	promptAbastecer.HoldDuration = 0.3
	promptAbastecer.MaxActivationDistance = 12
	promptAbastecer.RequiresLineOfSight = false
	promptAbastecer.Parent = nucleoReator
	promptAbastecer.Triggered:Connect(aoAbastecer)

	local promptMelhorar = Instance.new("ProximityPrompt")
	promptMelhorar.ActionText = "Melhorar"
	promptMelhorar.ObjectText = "Reator"
	promptMelhorar.KeyboardKeyCode = Enum.KeyCode.R
	promptMelhorar.HoldDuration = 1
	promptMelhorar.MaxActivationDistance = 12
	promptMelhorar.RequiresLineOfSight = false
	promptMelhorar.Parent = nucleoReator
	promptMelhorar.Triggered:Connect(aoMelhorar)

	-- Círculo que mostra a zona segura
	zona = novaParte("Part", {
		Name = "ZonaSegura",
		Shape = Enum.PartType.Cylinder,
		Size = Vector3.new(0.2, 1, 1),
		Color = Config.CORES.reator,
		Material = Enum.Material.Neon,
		Transparency = 0.85,
		CanCollide = false,
		CanQuery = false,
		CanTouch = false,
		CastShadow = false,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, 0.15, 0)) * CFrame.Angles(0, 0, math.rad(90)),
	}, pastaMundo)

	novaParte("SpawnLocation", {
		Name = "Spawn",
		Size = Vector3.new(6, 1, 6),
		Transparency = 1,
		CanCollide = false,
		Neutral = true,
		Duration = 3,
		CFrame = CFrame.new(CENTRO + Vector3.new(0, 0.5, 9)),
	}, pastaMundo)

	return promptMelhorar
end

local function configurarIluminacao()
	-- Sem atmosfera, nuvens ou neblina: é o espaço
	for _, filho in Lighting:GetChildren() do
		if filho:IsA("Atmosphere") then
			filho:Destroy()
		end
	end
	local nuvens = Workspace.Terrain:FindFirstChildOfClass("Clouds")
	if nuvens then
		nuvens:Destroy()
	end

	local ceu = Lighting:FindFirstChildOfClass("Sky")
	if not ceu then
		ceu = Instance.new("Sky")
		ceu.Parent = Lighting
	end
	ceu.StarCount = 5000
	ceu.CelestialBodiesShown = true

	-- Meia-noite fixa deixa o céu preto e estrelado
	Lighting.ClockTime = 0
	Lighting.FogEnd = 100000
	Lighting.GlobalShadows = true
	for propriedade, valor in Config.ILUMINACAO.dia do
		Lighting[propriedade] = valor
	end
end

-- Monta o mapa inteiro. Devolve as informações que o servidor precisa.
function Mundo.Construir(callbacks)
	-- Remove o chão e o spawn que vêm no template Baseplate (só durante o jogo)
	local baseplate = Workspace:FindFirstChild("Baseplate")
	if baseplate then
		baseplate:Destroy()
	end
	for _, objeto in Workspace:GetChildren() do
		if objeto:IsA("SpawnLocation") then
			objeto:Destroy()
		end
	end

	Workspace.Gravity = Config.GRAVIDADE

	pastaMundo = Instance.new("Folder")
	pastaMundo.Name = "Mundo"
	pastaMundo.Parent = Workspace

	pastaRecursos = Instance.new("Folder")
	pastaRecursos.Name = "Recursos"
	pastaRecursos.Parent = pastaMundo

	construirChao()
	local promptMelhorar = construirBase(callbacks.aoAbastecer, callbacks.aoMelhorar)

	for _, tipo in Config.ORDEM_RECURSOS do
		local def = Config.RECURSOS[tipo]
		for _ = 1, def.quantidade do
			criarRecurso(tipo, def, pontoAleatorio(28, Config.RAIO_MUNDO), callbacks.aoColetar)
		end
	end

	configurarIluminacao()

	return {
		centro = CENTRO,
		raioMundo = Config.RAIO_MUNDO,
		promptMelhorar = promptMelhorar,
	}
end

-- Atualiza o círculo, a luz e o brilho do reator conforme o combustível.
function Mundo.AtualizarZona(raio, fracao)
	local diametro = math.max(raio * 2, 0.1)
	TweenService:Create(zona, TweenInfo.new(0.9), { Size = Vector3.new(0.2, diametro, diametro) }):Play()
	zona.Transparency = raio > 0 and 0.85 or 1
	luzReator.Range = math.clamp(raio * 1.6, 4, 60)
	luzReator.Brightness = fracao > 0 and 2 or 0
	nucleoReator.Transparency = fracao > 0 and 0 or 0.7
end

function Mundo.DefinirPeriodo(noite)
	local alvo = noite and Config.ILUMINACAO.noite or Config.ILUMINACAO.dia
	TweenService:Create(Lighting, TweenInfo.new(5), alvo):Play()
end

return Mundo
