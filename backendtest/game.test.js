import test from 'node:test'
import assert from 'node:assert/strict'
import { Game, handValue } from './game.js'

const c = (rank) => ({ rank, suit: '♠' })

// Orden de reparto: jugador, dealer, jugador, dealer, luego cartas extra
function newGame(cards) {
    const game = new Game(() => {}, {
        newDeck: () => cards.map(c).reverse(),
        times: { bet: 1e6, turn: 1e6, result: 1e6 }
    })
    game.addPlayer('a', { name: 'a' })
    return game
}

test('handValue maneja ases blandos', () => {
    assert.deepEqual(handValue([c('A'), c('6')]), { total: 17, soft: true })
    assert.deepEqual(handValue([c('A'), c('6'), c('10')]), { total: 17, soft: false })
    assert.equal(handValue([c('A'), c('K')]).total, 21)
})

test('el dealer se planta en soft 17 y el jugador gana con 20', () => {
    const game = newGame(['10', 'A', 'K', '6'])
    game.placeBet('a', 100)
    game.stand('a')
    assert.equal(game.phase, 'results')
    assert.equal(game.dealer.length, 2)
    assert.equal(game.findPlayer('a').money, 1100)
    game.clearTimer()
})

test('blackjack paga 3:2 y bust pierde la apuesta', () => {
    const bj = newGame(['A', '9', 'K', '8'])
    bj.placeBet('a', 100)
    assert.equal(bj.findPlayer('a').money, 1150)
    bj.clearTimer()

    const bust = newGame(['10', '9', '6', '8', 'K'])
    bust.placeBet('a', 100)
    bust.hit('a')
    assert.equal(bust.findPlayer('a').result, 'lose')
    assert.equal(bust.findPlayer('a').money, 900)
    bust.clearTimer()
})

test('la carta oculta del dealer no se envía durante el turno', () => {
    const game = newGame(['10', '9', '6', '8'])
    game.placeBet('a', 100)
    assert.equal(game.snapshot().dealer.cards[1], null)
    game.clearTimer()
})

test('apuestas inválidas se rechazan', () => {
    const game = newGame(['10', '9', '6', '8'])
    assert.ok(game.placeBet('a', 5000))
    assert.ok(game.placeBet('a', 1.5))
    game.clearTimer()
})
