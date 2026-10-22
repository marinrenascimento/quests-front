import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorText } from '@/components/atoms/ErrorText';
import { InputField } from '@/components/atoms/InputField';
import { Label } from '@/components/atoms/Label';
import { SelectOption } from '@/components/atoms/SelectOption';
import { FontFamily, Palette } from '@/constants/theme';
import { normalizeSearch } from '@/utils/normalizeSearch';

export type SearchSelectOption = { id: string; label: string };

export type SearchSelectFieldProps = {
  label: string;
  placeholder: string;
  options: SearchSelectOption[];
  /** Id da opção escolhida (sem valor: nada escolhido) */
  selectedId?: string;
  onSelect: (id: string) => void;
  /**
   * Recebe o texto digitado (sem espaços nas pontas) quando nenhuma opção corresponde a ele.
   * Junto com createLabel, liga a ação de criar; sem os dois, o campo só escolhe entre as opções.
   */
  onCreate?: (text: string) => void;
  /** Texto da ação de criar, a partir do texto digitado (ex.: Criar Disciplina "Artes") */
  createLabel?: (text: string) => string;
  /** Lista aberta sem opções e sem texto digitado */
  emptyMessage: string;
  /**
   * Sem criação: texto da lista quando a pesquisa não encontra nada (ex.: "Nenhuma Disciplina
   * Encontrada"). Padrão: emptyMessage.
   */
  noResultsMessage?: string;
  /**
   * false: select simples, sem pesquisa (ex.: quantidade). Tocar no campo abre e fecha a lista,
   * sem teclado. Padrão: true.
   */
  searchable?: boolean;
  /** Campo cinza, sem foco nem lista (ex.: conteúdo antes de escolher a disciplina) */
  disabled?: boolean;
  /** Mensagem de erro abaixo do campo (opcional) */
  error?: string;
};

/** Altura máxima da lista, em dp: 3,5 linhas de 40dp (a linha cortada indica que ela rola) */
const MAX_LIST_HEIGHT = 140;
const CHEVRON_SIZE = 20;
/** Espaço à direita do texto, para ele não passar por baixo da seta */
const INPUT_PADDING_RIGHT = 36;

/**
 * Campo de seleção com pesquisa e criação, no estilo 'outlined' do cadastro: ao tocar, abre
 * abaixo do campo (no fluxo da tela, empurrando o conteúdo) a lista de opções filtrada pelo
 * texto digitado, sem diferenciar maiúsculas nem acentos. Sem texto, mostra todas. Se nenhuma
 * corresponder, mostra a ação de criar com o texto digitado (quando a criação está ligada) ou a
 * mensagem de nenhum resultado. Tocar numa opção (ou na ação) escolhe e fecha a lista; sair do
 * campo também fecha, e o campo volta a mostrar a escolhida. Com searchable={false}, vira um
 * select simples: o campo é um botão que abre e fecha a lista. Os textos vêm todos por props.
 */
export function SearchSelectField({
  label,
  placeholder,
  options,
  selectedId,
  onSelect,
  onCreate,
  createLabel,
  emptyMessage,
  noResultsMessage,
  searchable = true,
  disabled = false,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selectedLabel = options.find((option) => option.id === selectedId)?.label ?? '';

  // Enquanto o texto é o da opção escolhida (campo recém-aberto), a lista mostra todas
  const search = !searchable || query === selectedLabel ? '' : normalizeSearch(query);
  const filtered = search
    ? options.filter((option) => normalizeSearch(option.label).includes(search))
    : options;
  const createText = query.trim();
  const canCreate =
    onCreate !== undefined &&
    createLabel !== undefined &&
    filtered.length === 0 &&
    createText.length > 0;
  // Sem opções: com texto pesquisado, "nenhum resultado"; sem texto, a lista está vazia
  const emptyText = search && noResultsMessage ? noResultsMessage : emptyMessage;

  // Keyboard.dismiss tira o foco do campo (onBlur), que fecha a lista
  const choose = (action: () => void) => {
    action();
    setOpen(false);
    Keyboard.dismiss();
  };

  const chevron = (
    <View pointerEvents="none" style={styles.chevron}>
      <MaterialCommunityIcons
        name={open ? 'chevron-up' : 'chevron-down'}
        size={CHEVRON_SIZE}
        color={disabled ? Palette.placeholder : Palette.forest}
      />
    </View>
  );

  return (
    <View>
      <Label size="compact">{label}</Label>
      <View style={styles.labelGap} />
      {searchable ? (
        <View>
          <InputField
            variant="outlined"
            value={open ? query : selectedLabel}
            onChangeText={setQuery}
            onFocus={() => {
              setQuery(selectedLabel);
              setOpen(true);
            }}
            onBlur={() => setOpen(false)}
            placeholder={placeholder}
            editable={!disabled}
            hasError={!!error}
            accessibilityLabel={label}
            accessibilityState={{ disabled, expanded: open }}
            autoCapitalize="sentences"
            autoCorrect={false}
            returnKeyType="done"
            style={styles.input}
          />
          {chevron}
        </View>
      ) : (
        // Select simples: o botão recebe o toque e o leitor de tela; o campo é só a aparência
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityValue={{ text: selectedLabel || placeholder }}
          accessibilityState={{ disabled, expanded: open }}
          disabled={disabled}
          onPress={() => {
            Keyboard.dismiss();
            setOpen((current) => !current);
          }}>
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants">
            <InputField
              variant="outlined"
              value={selectedLabel}
              placeholder={placeholder}
              editable={!disabled}
              hasError={!!error}
              style={styles.input}
            />
            {chevron}
          </View>
        </Pressable>
      )}
      {error ? <ErrorText>{error}</ErrorText> : null}
      {open ? (
        <View style={styles.list}>
          {/* Lista curta com altura máxima: ScrollView próprio, aninhado no da tela */}
          <ScrollView
            style={styles.listScroll}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            bounces={false}>
            {filtered.map((option) => (
              <SelectOption
                key={option.id}
                label={option.label}
                selected={option.id === selectedId}
                onPress={() => choose(() => onSelect(option.id))}
              />
            ))}
            {canCreate ? (
              <SelectOption
                icon="plus"
                label={createLabel(createText)}
                onPress={() => choose(() => onCreate(createText))}
              />
            ) : null}
            {filtered.length === 0 && !canCreate ? (
              <Text maxFontSizeMultiplier={1.3} style={styles.empty}>
                {emptyText}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

type Props = SearchSelectFieldProps;

const styles = StyleSheet.create({
  // Mesmo espaço entre rótulo e campo do FormField 'outlined'
  labelGap: {
    height: 6,
  },
  input: {
    paddingRight: INPUT_PADDING_RIGHT,
  },
  chevron: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 8,
    justifyContent: 'center',
  },
  // Mesma borda e raio do campo 'outlined'
  list: {
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.inputBorder,
    backgroundColor: Palette.white,
    overflow: 'hidden',
  },
  listScroll: {
    maxHeight: MAX_LIST_HEIGHT,
  },
  empty: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FontFamily.input,
    fontSize: 13,
    color: Palette.placeholder,
  },
});
