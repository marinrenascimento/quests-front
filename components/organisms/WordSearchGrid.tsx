import { useRef, useState } from 'react';
import { GestureResponderEvent, StyleSheet, View } from 'react-native';

import { WordSearchCell, WordSearchCellState } from '@/components/atoms/WordSearchCell';
import { lineCells } from '@/utils/wordSearch';

type Props = {
  /** Casas por lado */
  size: number;
  /** As letras, linha por linha */
  letters: string[];
  /** Lado de cada casa, em dp */
  cellSize: number;
  /** Casas das respostas achadas */
  foundCells: number[];
  /** Casas da última seleção errada */
  missCells: number[];
  /** false: a grade não recebe toques (ex.: indo para o próximo caça-palavras) */
  enabled: boolean;
  accessibilityLabel: string;
  /** Chamado com as casas selecionadas, da primeira à última */
  onSelect: (cells: number[]) => void;
};

/** O começo do toque em andamento: a casa e os pontos de partida para calcular o arraste */
type Gesture = {
  startCell: number;
  startX: number;
  startY: number;
  startPageX: number;
  startPageY: number;
};

/** O que a tela mostra do toque em andamento */
type Press = {
  startCell: number;
  currentCell: number;
};

const RADIUS = 8;

/**
 * Grade do caça-palavras. Há duas formas de selecionar: arrastar da primeira até a última letra, ou
 * tocar nas duas (o primeiro toque fica marcado, e tocar nele de novo desmarca). A seleção é sempre
 * uma linha reta, a mais próxima do que o dedo fez. O arraste usa a distância desde o começo do toque
 * (e não a posição dentro da casa), o que dá o mesmo resultado no Android, no iOS e na web.
 *
 * Os dados do gesto ficam numa ref, e ao soltar a casa final sai do próprio evento: num arraste rápido,
 * o dedo solta antes de a tela desenhar o último movimento, e o estado ainda teria a casa anterior
 * (a resposta perderia a última letra). O estado `press` serve só para mostrar a seleção.
 */
export function WordSearchGrid({
  size,
  letters,
  cellSize,
  foundCells,
  missCells,
  enabled,
  accessibilityLabel,
  onSelect,
}: Props) {
  // Primeiro toque da seleção por 2 toques, à espera do segundo
  const [anchor, setAnchor] = useState<number | null>(null);
  const [press, setPress] = useState<Press | null>(null);
  const gesture = useRef<Gesture | null>(null);

  const cellAt = (x: number, y: number) => {
    const clamp = (value: number) => Math.min(size - 1, Math.max(0, Math.floor(value / cellSize)));
    return clamp(y) * size + clamp(x);
  };

  /** Casa em que o dedo está, pela distância desde o começo do toque */
  const cellOf = (event: GestureResponderEvent, start: Gesture) =>
    cellAt(
      start.startX + event.nativeEvent.pageX - start.startPageX,
      start.startY + event.nativeEvent.pageY - start.startPageY,
    );

  const handleGrant = (event: GestureResponderEvent) => {
    const { locationX, locationY, pageX, pageY } = event.nativeEvent;
    const startCell = cellAt(locationX, locationY);
    gesture.current = {
      startCell,
      startX: locationX,
      startY: locationY,
      startPageX: pageX,
      startPageY: pageY,
    };
    setPress({ startCell, currentCell: startCell });
  };

  const handleMove = (event: GestureResponderEvent) => {
    const start = gesture.current;
    if (start) {
      const currentCell = cellOf(event, start);
      setPress((current) =>
        current && current.currentCell !== currentCell ? { ...current, currentCell } : current,
      );
    }
  };

  const handleRelease = (event: GestureResponderEvent) => {
    const start = gesture.current;
    if (!start) {
      return;
    }
    gesture.current = null;
    setPress(null);
    const endCell = cellOf(event, start);
    if (endCell !== start.startCell) {
      // Arrastou
      setAnchor(null);
      onSelect(lineCells(start.startCell, endCell, size));
    } else if (anchor === null) {
      setAnchor(start.startCell);
    } else if (anchor === start.startCell) {
      setAnchor(null);
    } else {
      setAnchor(null);
      onSelect(lineCells(anchor, start.startCell, size));
    }
  };

  const handleTerminate = () => {
    gesture.current = null;
    setPress(null);
  };

  // O que está sendo selecionado agora: o arraste, ou do primeiro toque até o toque atual
  const selecting = new Set<number>();
  if (press && press.currentCell !== press.startCell) {
    lineCells(press.startCell, press.currentCell, size).forEach((cell) => selecting.add(cell));
  } else if (anchor !== null) {
    (press ? lineCells(anchor, press.currentCell, size) : [anchor]).forEach((cell) =>
      selecting.add(cell),
    );
  } else if (press) {
    selecting.add(press.startCell);
  }
  const found = new Set(foundCells);
  const miss = new Set(missCells);

  const stateOf = (cell: number): WordSearchCellState => {
    if (miss.has(cell)) return 'miss';
    if (selecting.has(cell)) return 'selecting';
    return found.has(cell) ? 'found' : 'idle';
  };

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      // Os toques ficam na grade: as posições são sempre em relação a ela, não à casa tocada
      pointerEvents="box-only"
      onStartShouldSetResponder={() => enabled}
      onMoveShouldSetResponder={() => enabled}
      onResponderTerminationRequest={() => false}
      onResponderGrant={handleGrant}
      onResponderMove={handleMove}
      onResponderRelease={handleRelease}
      onResponderTerminate={handleTerminate}
      style={[styles.grid, { width: cellSize * size, borderRadius: RADIUS }]}>
      {/* Grade pequena e fixa, que não rola: um .map simples basta */}
      {letters.map((letter, cell) => (
        <WordSearchCell key={cell} letter={letter} size={cellSize} state={stateOf(cell)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
