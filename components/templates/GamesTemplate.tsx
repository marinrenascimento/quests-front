import { ReportHeader } from '@/components/molecules/ReportHeader';
import { GameShowcase } from '@/components/organisms/GameShowcase';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import type { GameInfo } from '@/constants/games';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  title: string;
  games: GameInfo[];
  onGamePress: (game: GameInfo) => void;
  /** Rótulo do ícone de um jogo, lido pelo leitor de tela */
  iconLabel: (name: string) => string;
  /** Frase do quadrado grande, lida pelo leitor de tela */
  playHint: (description: string) => string;
  backLabel: string;
};

/**
 * Template da tela Jogos: TopBar sem aba em destaque, cabeçalho (voltar + título) e a vitrine dos
 * jogos. O voltar leva à Home (mesma navegação da aba Home do TopBar).
 */
export function GamesTemplate({ title, games, onGamePress, iconLabel, playHint, backLabel }: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout topBar={<TopBar onTabPress={handleTabPress} />}>
      <ReportHeader title={title} onBack={() => handleTabPress('home')} backLabel={backLabel} />
      <GameShowcase
        games={games}
        onGamePress={onGamePress}
        iconLabel={iconLabel}
        playHint={playHint}
      />
    </HelpLayout>
  );
}
