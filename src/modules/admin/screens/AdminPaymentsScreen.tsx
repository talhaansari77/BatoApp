import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminCard,
  AdminDetailItem,
  AdminFilterChips,
  AdminHeroCard,
  AdminSectionHeader,
  AdminStatusBadge,
} from '../components';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type PaymentStatus = 'paid' | 'pending' | 'refunded';
type FilterType = 'all' | PaymentStatus;

type Payment = {
  id: string;
  patientName: string;
  service: string;
  amount: string;
  method: 'Online' | 'Pay at Clinic';
  date: string;
  status: PaymentStatus;
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Refunded', value: 'refunded' },
];

const payments: Payment[] = [
  {
    id: 'pay-1',
    patientName: 'Muhammad Talha',
    service: 'Hair Growth Treatment',
    amount: '25 KWD',
    method: 'Pay at Clinic',
    date: 'Today',
    status: 'pending',
    icon: 'Sparkles',
  },
  {
    id: 'pay-2',
    patientName: 'Aisha Khan',
    service: 'Skin Consultation',
    amount: '22 KWD',
    method: 'Online',
    date: 'Today',
    status: 'paid',
    icon: 'ScanFace',
  },
  {
    id: 'pay-3',
    patientName: 'Omar Ali',
    service: 'Hydration Facial Therapy',
    amount: '30 KWD',
    method: 'Online',
    date: 'Jun 17',
    status: 'paid',
    icon: 'Droplets',
  },
  {
    id: 'pay-4',
    patientName: 'Mariam Yousef',
    service: 'Botox Consultation',
    amount: '35 KWD',
    method: 'Online',
    date: 'Jun 12',
    status: 'refunded',
    icon: 'CreditCard',
  },
];

export function AdminPaymentsScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredPayments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesFilter =
        selectedFilter === 'all' || payment.status === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        payment.patientName.toLowerCase().includes(normalizedSearch) ||
        payment.service.toLowerCase().includes(normalizedSearch) ||
        payment.method.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  return (
    <Screen
      title="Payments"
      subtitle="Transactions"
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
          icon="CreditCard"
          title="Payment Center"
          description="Track online payments, pay-at-clinic collections, refunds, and pending transaction actions."
        >
          <View style={styles.statsRow}>
            <SummaryItem label="Today" value="1,240 KWD" />
            <View style={styles.statDivider} />
            <SummaryItem label="Pending" value="25 KWD" />
          </View>
        </AdminHeroCard>

        <AdminCard style={styles.revenueCard}>
          <View style={styles.revenueIcon}>
            <AppIcon
              name="ChartNoAxesColumnIncreasing"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.cardText}>
            <AppText variant="bodyMedium">Monthly Revenue</AppText>

            <AppText variant="h2">31,420 KWD</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              +12% compared to previous month
            </AppText>
          </View>

          <View style={styles.growthBadge}>
            <AppIcon
              name="TrendingUp"
              size={15}
              color={theme.colors.successText}
            />

            <AppText variant="small" color={theme.colors.successText}>
              +12%
            </AppText>
          </View>
        </AdminCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search payments..."
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
            title="Transactions"
            subtitle={`${filteredPayments.length} payments found`}
          />

          <View style={styles.list}>
            {filteredPayments.map((payment) => (
              <PaymentCard key={payment.id} payment={payment} />
            ))}
          </View>
        </View>
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

function PaymentCard({ payment }: { payment: Payment }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const statusConfig = getStatusConfig(payment.status);

  return (
    <Pressable
      style={({ pressed }) => [styles.paymentCard, pressed && styles.pressed]}
    >
      <View style={styles.paymentTop}>
        <View style={styles.paymentIcon}>
          <AppIcon
            name={payment.icon}
            size={24}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {payment.patientName}
            </AppText>

            <AdminStatusBadge
              label={statusConfig.label}
              type={statusConfig.type}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {payment.service}
          </AppText>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <AdminDetailItem
          icon="CircleDollarSign"
          label="Amount"
          value={payment.amount}
        />

        <AdminDetailItem
          icon="CreditCard"
          label="Method"
          value={payment.method}
        />

        <AdminDetailItem icon="Calendar" label="Date" value={payment.date} />
      </View>
    </Pressable>
  );
}

function getStatusConfig(status: PaymentStatus): {
  label: string;
  type: 'success' | 'warning' | 'error' | 'info';
} {
  const config = {
    paid: {
      label: 'Paid',
      type: 'success',
    },
    pending: {
      label: 'Pending',
      type: 'warning',
    },
    refunded: {
      label: 'Refunded',
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

    revenueCard: {
      backgroundColor: theme.colors.info,
      flexDirection: 'row',
      alignItems: 'center',
    },

    revenueIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cardText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    growthBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.success,
    },

    section: {
      gap: theme.spacing.md,
    },

    list: {
      gap: theme.spacing.md,
    },

    paymentCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    paymentTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    paymentIcon: {
      width: 54,
      height: 54,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    titleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },

    title: {
      flex: 1,
    },

    detailsBox: {
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
    },

    pressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },
  });
}