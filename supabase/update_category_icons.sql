-- Atualizar emojis das categorias existentes baseado no nome
-- Este script sugere automaticamente o emoji correto para cada categoria
-- Execute este script para aplicar os emojis corretos

UPDATE categories
SET icon = CASE
  -- Alimentação
  WHEN LOWER(name) LIKE '%alimentação%' OR LOWER(name) LIKE '%restaurante%' THEN '🍽️'
  WHEN LOWER(name) LIKE '%comida%' THEN '🍔'
  WHEN LOWER(name) LIKE '%supermercado%' OR LOWER(name) LIKE '%mercado%' OR LOWER(name) LIKE '%compras%' THEN '🛒'

  -- Transporte
  WHEN LOWER(name) LIKE '%transporte%' OR LOWER(name) LIKE '%carro%' THEN '🚗'
  WHEN LOWER(name) LIKE '%uber%' OR LOWER(name) LIKE '%taxi%' THEN '🚕'
  WHEN LOWER(name) LIKE '%gasolina%' OR LOWER(name) LIKE '%combustível%' THEN '⛽'

  -- Lazer
  WHEN LOWER(name) LIKE '%lazer%' THEN '🎮'
  WHEN LOWER(name) LIKE '%entretenimento%' OR LOWER(name) LIKE '%cinema%' THEN '🎬'
  WHEN LOWER(name) LIKE '%diversão%' THEN '🎉'

  -- Contas e Casa
  WHEN LOWER(name) LIKE '%conta%' OR LOWER(name) LIKE '%boleto%' THEN '🧾'
  WHEN LOWER(name) LIKE '%casa%' OR LOWER(name) LIKE '%moradia%' OR LOWER(name) LIKE '%aluguel%' THEN '🏠'

  -- Trabalho
  WHEN LOWER(name) LIKE '%trabalho%' OR LOWER(name) LIKE '%escritório%' THEN '💼'

  -- Saúde
  WHEN LOWER(name) LIKE '%saúde%' OR LOWER(name) LIKE '%farmácia%' OR LOWER(name) LIKE '%remédio%' THEN '💊'
  WHEN LOWER(name) LIKE '%médico%' THEN '⚕️'
  WHEN LOWER(name) LIKE '%hospital%' THEN '🏥'

  -- Educação
  WHEN LOWER(name) LIKE '%educação%' OR LOWER(name) LIKE '%curso%' OR LOWER(name) LIKE '%escola%' OR LOWER(name) LIKE '%faculdade%' THEN '🎓'
  WHEN LOWER(name) LIKE '%estudo%' OR LOWER(name) LIKE '%livro%' THEN '📚'

  -- Finanças
  WHEN LOWER(name) LIKE '%investimento%' THEN '📈'
  WHEN LOWER(name) LIKE '%poupança%' OR LOWER(name) LIKE '%economia%' THEN '💰'

  -- Viagem
  WHEN LOWER(name) LIKE '%viagem%' OR LOWER(name) LIKE '%turismo%' THEN '✈️'
  WHEN LOWER(name) LIKE '%férias%' THEN '🏖️'

  -- Vestuário e Beleza
  WHEN LOWER(name) LIKE '%roupa%' OR LOWER(name) LIKE '%vestuário%' THEN '👕'
  WHEN LOWER(name) LIKE '%beleza%' OR LOWER(name) LIKE '%cosméticos%' THEN '💄'

  -- Pets
  WHEN LOWER(name) LIKE '%pet%' OR LOWER(name) LIKE '%animal%' THEN '🐾'
  WHEN LOWER(name) LIKE '%cachorro%' THEN '🐕'
  WHEN LOWER(name) LIKE '%gato%' THEN '🐈'

  -- Tecnologia
  WHEN LOWER(name) LIKE '%telefone%' OR LOWER(name) LIKE '%celular%' THEN '📱'
  WHEN LOWER(name) LIKE '%internet%' THEN '🌐'

  -- Utilidades
  WHEN LOWER(name) LIKE '%energia%' THEN '⚡'
  WHEN LOWER(name) LIKE '%luz%' THEN '💡'
  WHEN LOWER(name) LIKE '%água%' THEN '💧'

  -- Esporte
  WHEN LOWER(name) LIKE '%academia%' THEN '🏋️'
  WHEN LOWER(name) LIKE '%esporte%' THEN '⚽'

  -- Presente
  WHEN LOWER(name) LIKE '%presente%' OR LOWER(name) LIKE '%gift%' THEN '🎁'

  -- Padrão (mantém o emoji atual se não houver match)
  ELSE COALESCE(icon, '📁')
END;
