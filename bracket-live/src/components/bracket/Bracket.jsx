import { Fragment } from 'react'
import BracketColumn from './BracketColumn'
import ConnectorColumn from './ConnectorColumn'
import MatchCard from './MatchCard'
import ResultSlot from './ResultSlot'

/**
 * Bracket genérico: una columna por ronda, un conector entre rondas consecutivas
 * y, al final, las cajas de Campeón / Sub-Campeón. Funciona para 2, 4, 8, 16... equipos.
 *
 * @param {{
 *   rounds: Array<{ id: string, label: string, matches: any[] }>,
 *   champion: any, runnerUp: any
 * }} props
 */
export default function Bracket({ rounds, champion, runnerUp }) {
  return (
    <section aria-label="Bracket del torneo" className="flex flex-1 items-stretch p-6">
      {rounds.map((round, i) => {
        const isFinal = i === rounds.length - 1

        return (
          <Fragment key={round.id}>
            <BracketColumn label={round.label} className={isFinal ? 'flex-[1.1]' : 'flex-1'}>
              {round.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  teams={match.teams}
                  isLive={match.isLive}
                  variant={isFinal ? 'featured' : 'default'}
                />
              ))}
            </BracketColumn>

            {isFinal ? (
              <ConnectorColumn count={1} type="split" topTone="champion" bottomTone="link" />
            ) : (
              <ConnectorColumn count={rounds[i + 1].matches.length} type="merge" />
            )}
          </Fragment>
        )
      })}

      <BracketColumn label="Resultados" className="flex-1">
        <ResultSlot label="Campeón" team={champion} tone="champion" />
        <ResultSlot label="Sub-Campeón" team={runnerUp} tone="runnerUp" />
      </BracketColumn>
    </section>
  )
}
