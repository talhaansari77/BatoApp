import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminEmptyState,
  AdminFilterChips,
  AdminHeroCard,
  AdminSectionHeader,
  AdminStatusBadge,
} from '../components';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type PromotionStatus = 'active' | 'scheduled' | 'expired';
type FilterType = 'all' | PromotionStatus;

type Promotion = {
  id: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  status: PromotionStatus;
  usage: string;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Expired', value: 'expired' },
];

const promotions: Promotion[] = [
  {
    id: '1',
    title: 'Glow Skin Package',
    description: 'Discount on hydration facial and skin consultation.',
    discount: '20% OFF',
    validUntil: 'Jun 30',
    status: 'active',
    usage: '42 used',
    icon: 'Sparkles',
  },
  {
    id: '2',
    title: 'Hair Growth Care',
    description: 'Special offer for hair growth consultation and therapy.',
    discount: '15% OFF',
    validUntil: 'Jul 10',
    status: 'scheduled',
    usage: 'Not started',
    icon: 'BadgePercent',
  },
  {
    id: '3',
    title: 'Botox Consultation Offer',
    description: 'Limited campaign for face and anti-aging consultation.',
    discount: '10% OFF',
    validUntil: 'Jun 01',
    status: 'expired',
    usage: '31 used',
    icon: 'Gift',
  },
];

export function AdminPromotionsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredPromotions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return promotions.filter((promotion) => {
      const matchesFilter =
        selectedFilter === 'all' || promotion.status === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        promotion.title.toLowerCase().includes(normalizedSearch) ||
        promotion.description.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  const activeCount = promotions.filter((item) => item.status === 'active').length;
  const scheduledCount = promotions.filter(
    (item) => item.status === 'scheduled',
  ).length;
  const expiredCount = promotions.filter((item) => item.status === 'expired').length;

  return (
    <Screen
      title="Promotions"
      subtitle="Offers & campaigns"
      showBack
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <AdminHeroCard
          icon="BadgePercent"
          title="Promotion Center"
          description="Manage offers, discounts, banners, coupon campaigns, and active marketing promotions."
        >
          <View style={styles.statsRow}>
            <SummaryItem label="Active" value={`${activeCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Scheduled" value={`${scheduledCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Expired" value={`${expiredCount}`} />
          </View>

          <AppButton title="Create Promotion" />
        </AdminHeroCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search promotions..."
          leftIcon="Search"
          rightIcon={search ? 'X' : undefined}
          onRightIconPress={() => setSearch('')}
        />

        <AdminFilterChips
          options={filters}
          selectedValue={selectedFilter}
          onChange={setSelectedFilter}
        />

        <View style={styles.section}>
          <AdminSectionHeader
            title="Campaign List"
            subtitle={`${filteredPromotions.length} promotions found`}
          />

          <View style={styles.list}>
            {filteredPromotions.map((promotion) => (
              <PromotionCard key={promotion.id} promotion={promotion} />
            ))}
          </View>
        </View>

        {filteredPromotions.length === 0 ? (
          <AdminEmptyState
            title="No promotions found"
            description="Try another keyword or change the promotion status filter."
          />
        ) : null}
      </View>
    </Screen>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
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

function PromotionCard({ promotion }: { promotion: Promotion }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(promotion.status);

  return (
    <Pressable
      style={({ pressed }) => [styles.promotionCard, pressed && styles.pressed]}
    >
      <View style={styles.promotionTop}>
        <View style={styles.promotionIcon}>
          <AppIcon
            name={promotion.icon}
            size={24}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {promotion.title}
            </AppText>

            <AdminStatusBadge
              label={statusConfig.label}
              type={statusConfig.type}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {promotion.description}
          </AppText>
        </View>
      </View>

      <View style={styles.discountBox}>
        <View>
          <AppText variant="small" color={theme.colors.textMuted}>
            Discount
          </AppText>

          <AppText variant="h3" color={theme.colors.primaryDark}>
            {promotion.discount}
          </AppText>
        </View>

        <View>
          <AppText variant="small" color={theme.colors.textMuted}>
            Valid Until
          </AppText>

          <AppText variant="caption">{promotion.validUntil}</AppText>
        </View>

        <View>
          <AppText variant="small" color={theme.colors.textMuted}>
            Usage
          </AppText>

          <AppText variant="caption">{promotion.usage}</AppText>
        </View>
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="Edit"
          fullWidth={false}
          style={styles.actionButton}
        />

        <AppButton
          title={promotion.status === 'active' ? 'Disable' : 'Preview'}
          variant="outline"
          fullWidth={false}
          style={styles.actionButton}
        />
      </View>
    </Pressable>
  );
}

function getStatusConfig(status: PromotionStatus): {
  label: string;
  type: 'success' | 'warning' | 'error' | 'info';
} {
  const config = {
    active: {
      label: 'Active',
      type: 'success',
    },
    scheduled: {
      label: 'Scheduled',
      type: 'info',
    },
    expired: {
      label: 'Expired',
      type: 'error',
    },
  } as const;

  return config[status];
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
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

    section: {
      gap: theme.spacing.md,
    },

    list: {
      gap: theme.spacing.md,
    },

    promotionCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    promotionTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    promotionIcon: {
      width: 54,
      height: 54,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },

    title: {
      flex: 1,
    },

    discountBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },

    actionRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    actionButton: {
      flex: 1,
      minHeight: 42,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}