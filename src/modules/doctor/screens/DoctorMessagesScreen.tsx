import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type MessageStatus = 'unread' | 'replied' | 'urgent';

type Conversation = {
  id: string;
  patientName: string;
  treatment: string;
  message: string;
  time: string;
  status: MessageStatus;
  icon: AppIconName;
};

const conversations: Conversation[] = [
  {
    id: '1',
    patientName: 'Muhammad Talha',
    treatment: 'Hair Rejuvenation Plan',
    message: 'Doctor, should I upload new progress photos before my next visit?',
    time: '10 min ago',
    status: 'unread',
    icon: 'UserRound',
  },
  {
    id: '2',
    patientName: 'Aisha Khan',
    treatment: 'Acne Treatment Plan',
    message: 'The redness is better today. Should I continue the same routine?',
    time: '35 min ago',
    status: 'urgent',
    icon: 'UserRound',
  },
  {
    id: '3',
    patientName: 'Omar Ali',
    treatment: 'Hydration Facial Therapy',
    message: 'Thank you doctor, I will follow the instructions.',
    time: '2 hrs ago',
    status: 'replied',
    icon: 'UserRound',
  },
];

export function DoctorMessagesScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [search, setSearch] = useState('');

  const filteredConversations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter(
      (conversation) =>
        conversation.patientName.toLowerCase().includes(normalizedSearch) ||
        conversation.treatment.toLowerCase().includes(normalizedSearch) ||
        conversation.message.toLowerCase().includes(normalizedSearch),
    );
  }, [search]);

  return (
    <Screen
      title="Messages"
      subtitle="Patient conversations"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <AppIcon
                name="MessagesSquare"
                size={34}
                color={theme.colors.primaryDark}
              />
            </View>

            <View style={styles.cardText}>
              <AppText variant="h2">Patient Messages</AppText>

              <AppText color={theme.colors.textMuted}>
                Review patient questions, follow-ups, and treatment updates.
              </AppText>
            </View>
          </View>

          <View style={styles.statsRow}>
            <StatItem label="Unread" value="1" />
            <View style={styles.statDivider} />
            <StatItem label="Urgent" value="1" />
            <View style={styles.statDivider} />
            <StatItem label="Replied" value="1" />
          </View>
        </View>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search messages..."
          leftIcon="Search"
          rightIcon={search ? 'X' : undefined}
          onRightIconPress={() => setSearch('')}
        />

        <View style={styles.quickReplyCard}>
          <View style={styles.quickReplyIcon}>
            <AppIcon
              name="MessageCircleReply"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Quick Reply Templates</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Use saved responses for progress photos, follow-ups, and care
              instructions.
            </AppText>
          </View>

          <AppIcon
            name="ChevronRight"
            size={20}
            color={theme.colors.textMuted}
          />
        </View>

        <View style={styles.section}>
          <View>
            <AppText variant="h3">Inbox</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              {filteredConversations.length} conversations found
            </AppText>
          </View>

          <View style={styles.list}>
            {filteredConversations.map((conversation) => (
              <ConversationCard
                key={conversation.id}
                conversation={conversation}
              />
            ))}
          </View>
        </View>

        {filteredConversations.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <AppIcon
                name="SearchX"
                size={30}
                color={theme.colors.primaryDark}
              />
            </View>

            <AppText variant="bodyMedium" align="center">
              No messages found
            </AppText>

            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              align="center"
            >
              Try another patient name or treatment keyword.
            </AppText>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', gap: theme.spacing.xs }}>
      <AppText variant="h3" color={theme.colors.primaryDark}>
        {value}
      </AppText>

      <AppText variant="small" color={theme.colors.textMuted}>
        {label}
      </AppText>
    </View>
  );
}

function ConversationCard({
  conversation,
}: {
  conversation: Conversation;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(conversation.status, theme);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.conversationCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.conversationTop}>
        <View style={styles.avatar}>
          <AppIcon
            name={conversation.icon}
            size={25}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {conversation.patientName}
            </AppText>

            <AppText variant="small" color={theme.colors.textMuted}>
              {conversation.time}
            </AppText>
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {conversation.treatment}
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color={theme.colors.textMuted}>
        {conversation.message}
      </AppText>

      <View style={styles.footerRow}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusConfig.backgroundColor },
          ]}
        >
          <AppText variant="small" color={statusConfig.textColor}>
            {statusConfig.label}
          </AppText>
        </View>

        <View style={styles.actions}>
          <AppButton
            title="Reply"
            fullWidth={false}
            style={styles.replyButton}
          />

          <Pressable style={styles.iconButton}>
            <AppIcon
              name="FileText"
              size={20}
              color={theme.colors.primaryDark}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

function getStatusConfig(
  status: MessageStatus,
  theme: ReturnType<typeof useAppTheme>,
) {
  const config = {
    unread: {
      label: 'Unread',
      backgroundColor: theme.colors.info,
      textColor: theme.colors.infoText,
    },
    urgent: {
      label: 'Urgent',
      backgroundColor: theme.colors.warning,
      textColor: theme.colors.warningText,
    },
    replied: {
      label: 'Replied',
      backgroundColor: theme.colors.success,
      textColor: theme.colors.successText,
    },
  };

  return config[status];
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    summaryCard: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      gap: theme.spacing.lg,
      ...(theme.shadows.card ?? {}),
    },

    summaryTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },

    summaryIcon: {
      width: 70,
      height: 70,
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    statsRow: {
      minHeight: 82,
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
    },

    statDivider: {
      width: 1,
      height: '65%',
      backgroundColor: theme.colors.border,
    },

    quickReplyCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    quickReplyIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    section: {
      gap: theme.spacing.md,
    },

    list: {
      gap: theme.spacing.md,
    },

    conversationCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    conversationTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    avatar: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },

    title: {
      flex: 1,
    },

    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    statusBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
    },

    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },

    replyButton: {
      minHeight: 40,
      paddingHorizontal: theme.spacing.xl,
    },

    iconButton: {
      width: 42,
      height: 42,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    emptyCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      gap: theme.spacing.sm,
      ...(theme.shadows.card ?? {}),
    },

    emptyIcon: {
      width: 58,
      height: 58,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}