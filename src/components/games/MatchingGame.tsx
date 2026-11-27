import { useCallback, useEffect, useMemo, useState } from 'react'
import { useI18n } from '../../i18n/I18nContext'

type Card = {
  id: number
  pairId: string
  face: string
  flipped: boolean
  matched: boolean
}

const PAIRS: { id: string; face: string }[] = [
  { id: 'cut', face: '✂️' },
  { id: 'cam', face: '🎬' },
  { id: 'mic', face: '🎙️' },
  { id: 'play', face: '▶️' },
  { id: 'thumb', face: '🖼️' },
  { id: 'star', face: '⭐' },
  { id: 'clap', face: '👏' },
  { id: 'fire', face: '🔥' },
]

function shuffle<T>(list: T[]): T[] {
  const next = [...list]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

function buildDeck(): Card[] {
  const doubled = PAIRS.flatMap((p) => [
    { pairId: p.id, face: p.face },
    { pairId: p.id, face: p.face },
  ])
  return shuffle(doubled).map((item, index) => ({
    id: index,
    pairId: item.pairId,
    face: item.face,
    flipped: false,
    matched: false,
  }))
}

type Props = {
  onBack: () => void
}

export function MatchingGame({ onBack }: Props) {
  const { t } = useI18n()
  const [cards, setCards] = useState<Card[]>(() => buildDeck())
  const [openIds, setOpenIds] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)

  const matchedCount = useMemo(
    () => cards.filter((c) => c.matched).length / 2,
    [cards],
  )
  const won = matchedCount === PAIRS.length

  useEffect(() => {
    if (!running || won) return
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [running, won])

  const restart = useCallback(() => {
    setCards(buildDeck())
    setOpenIds([])
    setMoves(0)
    setLocked(false)
    setElapsed(0)
    setRunning(false)
  }, [])

  function flip(id: number) {
    if (locked || won) return
    const card = cards.find((c) => c.id === id)
    if (!card || card.flipped || card.matched) return
    if (openIds.includes(id)) return

    if (!running) setRunning(true)

    const nextOpen = [...openIds, id]
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)),
    )
    setOpenIds(nextOpen)

    if (nextOpen.length < 2) return

    setMoves((m) => m + 1)
    setLocked(true)
    const [aId, bId] = nextOpen
    const first = cards.find((c) => c.id === aId)
    const isMatch = Boolean(first && first.pairId === card.pairId)

    window.setTimeout(() => {
      if (isMatch) {
        setCards((prev) =>
          prev.map((c) =>
            c.id === aId || c.id === bId
              ? { ...c, matched: true, flipped: true }
              : c,
          ),
        )
      } else {
        setCards((prev) =>
          prev.map((c) =>
            c.id === aId || c.id === bId ? { ...c, flipped: false } : c,
          ),
        )
      }
      setOpenIds([])
      setLocked(false)
    }, isMatch ? 280 : 700)
  }

  const minutes = Math.floor(elapsed / 60)
  const seconds = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="matching-game">
      <div className="matching-toolbar">
        <button type="button" className="linkish" onClick={onBack}>
          {t('games.backToList')}
        </button>
        <div className="matching-stats">
          <span>
            {t('games.moves')}: {moves}
          </span>
          <span>
            {t('games.time')}: {minutes}:{seconds}
          </span>
          <span>
            {t('games.pairs')}: {matchedCount}/{PAIRS.length}
          </span>
        </div>
        <button type="button" className="chip" onClick={restart}>
          {t('games.restart')}
        </button>
      </div>

      {won && (
        <div className="matching-win" role="status">
          <strong>{t('games.win')}</strong>
          <span>
            {t('games.winDetail', { moves, time: `${minutes}:${seconds}` })}
          </span>
          <button
            type="button"
            className="chip chip-active"
            onClick={restart}
          >
            {t('games.playAgain')}
          </button>
        </div>
      )}

      <div className="matching-grid" aria-label={t('games.matchingTitle')}>
        {cards.map((card) => {
          const show = card.flipped || card.matched
          return (
            <button
              key={card.id}
              type="button"
              className={
                card.matched
                  ? 'matching-card matching-card-matched'
                  : show
                    ? 'matching-card matching-card-flipped'
                    : 'matching-card'
              }
              onClick={() => flip(card.id)}
              disabled={locked && !show}
              aria-label={show ? card.face : t('games.cardBack')}
            >
              <span className="matching-card-inner">
                <span className="matching-face matching-face-back">◆</span>
                <span className="matching-face matching-face-front">
                  {card.face}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
