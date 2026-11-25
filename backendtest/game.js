export const BET_TIME = 15000
export const TURN_TIME = 8000
export const RESULT_TIME = 6000
export const START_MONEY = 1000
export const MIN_BET = 10

const SUITS = ['♠', '♥', '♦', '♣']
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export function createDeck(rng = Math.random) {
    const deck = SUITS.flatMap(suit => RANKS.map(rank => ({ rank, suit })))
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]
    }
    return deck
}

export function handValue(cards) {
    let total = 0
    let aces = 0
    for (const { rank } of cards) {
        if (rank === 'A') { aces++; total += 11 }
        else if (['J', 'Q', 'K'].includes(rank)) total += 10
        else total += Number(rank)
    }
    while (total > 21 && aces > 0) { total -= 10; aces-- }
    return { total, soft: aces > 0 }
}

const isBlackjack = cards => cards.length === 2 && handValue(cards).total === 21

// Un solo mazo, todos en la misma mesa. El dealer se planta en 17 (soft 17 incluido).
export class Game {
    constructor(onChange, { newDeck = createDeck, times = {} } = {}) {
        this.onChange = onChange
        this.newDeck = newDeck
        this.times = { bet: BET_TIME, turn: TURN_TIME, result: RESULT_TIME, ...times }
        this.players = []
        this.dealer = []
        this.deck = []
        this.phase = 'idle' // idle | betting | playing | dealer | results
        this.currentId = null
        this.deadline = null
        this.timer = null
    }

    findPlayer(id) {
        return this.players.find(p => p.id === id)
    }

    isNameTaken(name) {
        return this.players.some(p => p.name === name)
    }

    addPlayer(id, { name, picture }) {
        if (this.findPlayer(id)) return
        this.players.push({
            id, name, picture: picture ?? null,
            money: START_MONEY, bet: 0, hand: [], status: 'waiting', result: null, delta: 0
        })
        if (this.phase === 'idle') this.startBetting()
        else if (this.phase === 'betting') this.findPlayer(id).status = 'betting'
        else this.emit()
    }

    removePlayer(id) {
        const player = this.findPlayer(id)
        if (!player) return
        const wasCurrent = this.currentId === id
        this.players = this.players.filter(p => p.id !== id)

        if (this.players.length === 0) {
            this.clearTimer()
            Object.assign(this, { phase: 'idle', dealer: [], currentId: null, deadline: null })
            return this.emit()
        }
        if (this.phase === 'betting') {
            if (this.allBetsPlaced()) return this.endBetting()
        } else if (this.phase === 'playing') {
            if (wasCurrent) return this.nextTurn()
            if (!this.players.some(p => p.status === 'playing')) return this.dealerPlay()
        }
        this.emit()
    }

    allBetsPlaced() {
        const betting = this.players.filter(p => p.status === 'betting' || p.status === 'bet')
        return betting.length > 0 && betting.every(p => p.status === 'bet')
    }

    startBetting() {
        this.phase = 'betting'
        this.dealer = []
        this.currentId = null
        for (const p of this.players) {
            if (p.money < MIN_BET) p.money = START_MONEY
            Object.assign(p, { bet: 0, hand: [], status: 'betting', result: null, delta: 0 })
        }
        this.setTimer(this.times.bet, () => this.endBetting())
        this.emit()
    }

    placeBet(id, amount) {
        const p = this.findPlayer(id)
        amount = Number(amount)
        if (this.phase !== 'betting' || !p) return 'No se puede apostar ahora'
        if (!Number.isInteger(amount) || amount < MIN_BET || amount > p.money) {
            return `La apuesta debe estar entre ${MIN_BET} y ${p.money}`
        }
        p.bet = amount
        p.status = 'bet'
        if (this.allBetsPlaced()) this.endBetting()
        else this.emit()
    }

    endBetting() {
        this.clearTimer()
        for (const p of this.players) if (p.status === 'betting') p.status = 'waiting'
        const active = this.players.filter(p => p.status === 'bet')
        if (active.length === 0) return this.startBetting()

        this.deck = this.newDeck()
        this.dealer = []
        for (let i = 0; i < 2; i++) {
            for (const p of active) p.hand.push(this.deck.pop())
            this.dealer.push(this.deck.pop())
        }
        for (const p of active) p.status = isBlackjack(p.hand) ? 'blackjack' : 'playing'

        this.phase = 'playing'
        if (isBlackjack(this.dealer)) return this.dealerPlay()
        this.nextTurn()
    }

    nextTurn() {
        this.clearTimer()
        const next = this.players.find(p => p.status === 'playing')
        if (!next) {
            this.currentId = null
            return this.dealerPlay()
        }
        this.currentId = next.id
        this.setTimer(this.times.turn, () => this.stand(next.id))
        this.emit()
    }

    hit(id) {
        const p = this.findPlayer(id)
        if (this.phase !== 'playing' || !p || this.currentId !== id) return
        p.hand.push(this.deck.pop())
        const { total } = handValue(p.hand)
        if (total > 21) p.status = 'bust'
        else if (total === 21) p.status = 'stand'
        else {
            // Se reinicia el tiempo para decidir tras cada carta
            this.setTimer(this.times.turn, () => this.stand(id))
            return this.emit()
        }
        this.nextTurn()
    }

    stand(id) {
        const p = this.findPlayer(id)
        if (this.phase !== 'playing' || !p || this.currentId !== id) return
        p.status = 'stand'
        this.nextTurn()
    }

    dealerPlay() {
        this.clearTimer()
        this.phase = 'dealer'
        this.currentId = null
        const contenders = this.players.filter(p => ['stand', 'blackjack'].includes(p.status))
        const needsDraw = contenders.some(p => p.status === 'stand') && !isBlackjack(this.dealer)
        while (needsDraw && handValue(this.dealer).total < 17) this.dealer.push(this.deck.pop())
        this.settle()
    }

    settle() {
        const dealerBJ = isBlackjack(this.dealer)
        const dealerTotal = handValue(this.dealer).total
        for (const p of this.players.filter(p => p.bet > 0 && p.hand.length)) {
            const total = handValue(p.hand).total
            let result
            if (p.status === 'bust') result = 'lose'
            else if (p.status === 'blackjack') result = dealerBJ ? 'push' : 'blackjack'
            else if (dealerBJ) result = 'lose'
            else if (dealerTotal > 21 || total > dealerTotal) result = 'win'
            else if (total === dealerTotal) result = 'push'
            else result = 'lose'

            p.result = result
            p.delta = { blackjack: p.bet * 1.5, win: p.bet, push: 0, lose: -p.bet }[result]
            p.money += p.delta
        }
        this.phase = 'results'
        this.setTimer(this.times.result, () => this.startBetting())
        this.emit()
    }

    setTimer(ms, fn) {
        this.clearTimer()
        this.deadline = Date.now() + ms
        this.timer = setTimeout(fn, ms)
    }

    clearTimer() {
        clearTimeout(this.timer)
        this.timer = null
        this.deadline = null
    }

    snapshot() {
        // Mientras se juega, la segunda carta del dealer permanece oculta
        const hidden = this.phase === 'playing' && this.dealer.length > 1
        const dealerCards = hidden ? [this.dealer[0], null] : this.dealer
        return {
            phase: this.phase,
            currentId: this.currentId,
            timeLeft: this.deadline ? Math.max(0, this.deadline - Date.now()) : null,
            dealer: {
                cards: dealerCards,
                total: this.dealer.length ? handValue(hidden ? [this.dealer[0]] : this.dealer).total : null
            },
            players: this.players.map(p => ({
                id: p.id, name: p.name, picture: p.picture, money: p.money, bet: p.bet,
                cards: p.hand, total: p.hand.length ? handValue(p.hand).total : null,
                status: p.status, result: p.result, delta: p.delta
            }))
        }
    }

    emit() {
        this.onChange(this.snapshot())
    }
}
