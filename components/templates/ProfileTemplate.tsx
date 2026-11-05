import { IconTextButton } from '@/components/atoms/IconTextButton';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { Toast } from '@/components/molecules/Toast';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { ImagePickerCard } from '@/components/organisms/ImagePickerCard';
import { ProfileFormCard } from '@/components/organisms/ProfileFormCard';
import { ProfileSecurityCard } from '@/components/organisms/ProfileSecurityCard';
import { ProfileSummaryCard } from '@/components/organisms/ProfileSummaryCard';
import { TopBar } from '@/components/organisms/TopBar';
import {
  BACKGROUNDS,
  BASIC_AVATARS,
  ProfileContent,
  UPGRADED_AVATARS,
} from '@/constants/profile';
import { RANK_LEVEL_LABELS, levelForCoins, rankLevelForCoins } from '@/constants/ranking';
import type { ProfileFormState } from '@/hooks/useProfileForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';
import { useUser } from '@/hooks/useUser';
import { formatThousands } from '@/utils/formatNumber';

type Props = {
  content: ProfileContent;
  /** Valores, erros e ações dos formulários (useProfileForm) */
  form: ProfileFormState;
  onSaveAccount: () => void;
  onSavePassword: () => void;
  onExportData: () => void;
  onDeleteAccount: () => void;
  onLogout: () => void;
  /** Aviso no topo do conteúdo. Sem mensagem, não aparece. */
  toastMessage: string | null;
  onToastHide: () => void;
  /** Seta de voltar: pergunta só se algo seria perdido (form.hasChanges); senão, sai direto */
  onBack: () => void;
  backLabel: string;
};

/** Fração do quadrado ocupada pelo avatar (com folga, para não encostar na borda) */
const AVATAR_TILE_FILL = 0.84;

/**
 * Template do Perfil, aberto pela pílula do TopBar: resumo da conta, edição do nome e do e-mail,
 * troca de senha, escolha do avatar e do fundo, privacidade e segurança e, por fim, "Sair da Conta".
 * O conteúdo rola e encolhe acima do teclado.
 */
export function ProfileTemplate({
  content,
  form,
  onSaveAccount,
  onSavePassword,
  onExportData,
  onDeleteAccount,
  onLogout,
  toastMessage,
  onToastHide,
  onBack,
  backLabel,
}: Props) {
  const handleTabPress = useTopBarNavigation();
  const user = useUser();
  const rankLevel = rankLevelForCoins(user.coins);

  return (
    <HelpLayout
      keyboardAware
      topBar={<TopBar onTabPress={handleTabPress} />}
      overlay={
        <Toast message={toastMessage ?? ''} visible={toastMessage !== null} onHide={onToastHide} />
      }>
      <ReportHeader title={content.title} onBack={onBack} backLabel={backLabel} />
      <ProfileSummaryCard
        name={user.name}
        avatarLabel={content.avatarLabel(user.name)}
        avatar={user.avatar.image}
        background={user.background?.image}
        levelLabel={content.levelLabel(levelForCoins(user.coins), RANK_LEVEL_LABELS[rankLevel])}
        rankLevel={rankLevel}
        points={{
          label: content.pointsLabel,
          value: content.pointsValue(formatThousands(user.coins)),
        }}
        username={{ label: content.usernameLabel, value: user.username }}
        email={{ label: content.emailLabel, value: user.email }}
      />
      <ProfileFormCard
        title={content.accountTitle}
        fields={[
          {
            label: content.nameLabel,
            placeholder: content.namePlaceholder,
            value: form.name,
            onChangeText: form.setName,
            error: form.accountErrors.name,
            autoCapitalize: 'words',
          },
          {
            label: content.newEmailLabel,
            placeholder: content.emailPlaceholder,
            value: form.email,
            onChangeText: form.setEmail,
            error: form.accountErrors.email,
            keyboardType: 'email-address',
            autoCapitalize: 'none',
          },
          ...(form.emailChanged
            ? [
                {
                  label: content.emailPasswordLabel,
                  placeholder: content.emailPasswordPlaceholder,
                  value: form.emailPassword,
                  onChangeText: form.setEmailPassword,
                  error: form.accountErrors.emailPassword,
                  secureTextEntry: true,
                  autoCapitalize: 'none' as const,
                },
              ]
            : []),
        ]}
        saveLabel={content.saveLabel}
        cancelLabel={content.cancelLabel}
        onSave={onSaveAccount}
        onCancel={form.cancelAccount}
        showActions={form.accountChanged}
      />
      <ProfileFormCard
        title={content.passwordTitle}
        fields={[
          {
            label: content.currentPasswordLabel,
            placeholder: content.currentPasswordPlaceholder,
            value: form.passwords.currentPassword,
            onChangeText: (text) => form.setPassword('currentPassword', text),
            error: form.passwordErrors.currentPassword,
            secureTextEntry: true,
            autoCapitalize: 'none',
          },
          {
            label: content.newPasswordLabel,
            placeholder: content.newPasswordPlaceholder,
            value: form.passwords.newPassword,
            onChangeText: (text) => form.setPassword('newPassword', text),
            error: form.passwordErrors.newPassword,
            secureTextEntry: true,
            autoCapitalize: 'none',
          },
          {
            label: content.confirmPasswordLabel,
            placeholder: content.confirmPasswordPlaceholder,
            value: form.passwords.confirmPassword,
            onChangeText: (text) => form.setPassword('confirmPassword', text),
            error: form.passwordErrors.confirmPassword,
            secureTextEntry: true,
            autoCapitalize: 'none',
          },
        ]}
        saveLabel={content.saveLabel}
        cancelLabel={content.cancelLabel}
        onSave={onSavePassword}
        onCancel={form.cancelPassword}
        showActions={form.passwordChanged}
      />
      {/* TODO: bloquear os que o nível ainda não liberou (RN-094). Por enquanto, todos para teste. */}
      <ImagePickerCard
        title={content.avatarTitle}
        groups={[
          { title: content.basicAvatarsTitle, options: BASIC_AVATARS },
          { title: content.upgradedAvatarsTitle, options: UPGRADED_AVATARS },
        ]}
        selectedId={user.avatarId}
        onSelect={user.selectAvatar}
        imageFill={AVATAR_TILE_FILL}
        selectedIcon={content.selectedIcon}
      />
      {/* TODO: bloquear os que o nível ainda não liberou (RN-100). Por enquanto, todos para teste. */}
      <ImagePickerCard
        title={content.backgroundTitle}
        groups={[{ options: BACKGROUNDS }]}
        selectedId={user.backgroundId}
        onSelect={user.selectBackground}
        none={{
          label: content.noBackgroundLabel,
          icon: content.noBackgroundIcon,
          onSelect: () => user.selectBackground(undefined),
        }}
        selectedIcon={content.selectedIcon}
      />
      <ProfileSecurityCard
        title={content.securityTitle}
        twoFactorLabel={content.twoFactorLabel}
        twoFactorText={content.twoFactorText}
        twoFactorEnabled={user.twoFactorEnabled}
        onTwoFactorChange={user.setTwoFactorEnabled}
        dataText={content.dataText}
        exportLabel={content.exportLabel}
        deleteLabel={content.deleteLabel}
        onExport={onExportData}
        onDelete={onDeleteAccount}
      />
      <IconTextButton label={content.logoutLabel} icon={content.logoutIcon} onPress={onLogout} />
    </HelpLayout>
  );
}
