import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';

import { GameIconButton } from '@/components/molecules/GameIconButton';
import { GameShowcaseCard } from '@/components/molecules/GameShowcaseCard';
import type { GameInfo } from '@/constants/games';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  games: GameInfo[];
  /** Toque no quadrado grande */
  onGamePress: (game: GameInfo) => void;
  /** Rótulo do ícone de um jogo, lido pelo leitor de tela */
  iconLabel: (name: string) => string;
  /** Frase do quadrado grande, lida pelo leitor de tela */
  playHint: (description: string) => string;
};

// Medidas em px do mockup da Help (a tela Jogos não tem mockup)
const ICONS_TOP = 14;
const ICONS_GAP = 11;

/**
 * Vitrine da tela Jogos: um quadrado grande que mostra um jogo por vez, arrastando para o lado, e os
 * ícones dos jogos embaixo. O ícone do jogo em exibição fica em destaque, e tocar em outro leva o
 * quadrado grande até ele. Tocar no quadrado grande abre o jogo.
 */
export function GameShowcase({ games, onGamePress, iconLabel, playHint }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const listRef = useRef<FlatList<GameInfo>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const side = layoutWidth - paddingHorizontal * 2;
  const iconsGap = scale(ICONS_GAP);
  const iconSize = Math.floor((side - iconsGap * (games.length - 1)) / games.length);

  // Pelo onScroll (e não ao fim da rolagem): o destaque do ícone acompanha o dedo
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / side);
    setActiveIndex(Math.min(games.length - 1, Math.max(0, index)));
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        data={games}
        keyExtractor={(game) => game.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        getItemLayout={(_, index) => ({ length: side, offset: side * index, index })}
        style={{ width: side, height: side }}
        renderItem={({ item }) => (
          <GameShowcaseCard
            name={item.name}
            description={item.description}
            accessibilityHint={playHint(item.description)}
            image={item.image}
            background={item.background}
            size={side}
            onPress={() => onGamePress(item)}
          />
        )}
      />
      <View style={[styles.icons, { gap: iconsGap, marginTop: scale(ICONS_TOP) }]}>
        {/* Sempre 3 jogos: um .map simples basta */}
        {games.map((game, index) => (
          <GameIconButton
            key={game.id}
            label={iconLabel(game.name)}
            image={game.image}
            background={game.background}
            size={iconSize}
            selected={index === activeIndex}
            onPress={() => listRef.current?.scrollToIndex({ index, animated: true })}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
  },
});
