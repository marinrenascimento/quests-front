import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        // O mockup não tem barra de abas inferior: a navegação é pelo TopBar
        tabBarStyle: { display: 'none' },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rank"
        options={{
          title: 'Rank',
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          // Ao sair da aba, a pilha volta para a Help (Estudos não fica aberta por baixo)
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="relatorios"
        options={{
          title: 'Relatórios',
        }}
      />
      <Tabs.Screen
        name="decks"
        options={{
          title: 'Meus Decks',
          // Ao sair da aba, a pilha volta para a lista (um deck não fica aberto por baixo)
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="provas"
        options={{
          title: 'Minhas Provas',
          // Ao sair da aba, a pilha volta para a lista (como em Meus Decks)
          popToTopOnBlur: true,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
