import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';

import { TopBarTab } from '@/components/atoms/TopBarTab';
import { VerticalDivider } from '@/components/atoms/VerticalDivider';

export type TopBarTabKey = 'home' | 'rank' | 'help';

type Props = {
  /** Sem valor, nenhuma aba fica em destaque */
  activeTab?: TopBarTabKey;
  onTabPress: (tab: TopBarTabKey) => void;
};

const TABS: { key: TopBarTabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'rank', label: 'Rank' },
  { key: 'help', label: 'Help' },
];

export function TopBarTabs({ activeTab, onTabPress }: Props) {
  return (
    <View accessibilityRole="tablist" style={styles.row}>
      {TABS.map((tab, index) => (
        <Fragment key={tab.key}>
          {index > 0 && <VerticalDivider />}
          <TopBarTab
            label={tab.label}
            active={tab.key === activeTab}
            onPress={() => onTabPress(tab.key)}
          />
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
