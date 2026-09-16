import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import {
  AdminDetailItem,
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

type ServiceCategory = 'hair' | 'skin' | 'face';
type FilterType = 'all' | ServiceCategory;

type AdminService = {
  id: string;
  name: string;
  category: ServiceCategory;
  duration: string;
  price: string;
  doctors: number;
  status: 'active' | 'inactive';
  icon: AppIconName;
};

const filters: Array<{ label: string; value: FilterType }> = [
  { label: 'All', value: 'all' },
  { label: 'Hair', value: 'hair' },
  { label: 'Skin', value: 'skin' },
  { label: 'Face', value: 'face' },
];

const services: AdminService[] = [
  {
    id: '1',
    name: 'Hair Growth Treatment',
    category: 'hair',
    duration: '45 min',
    price: '25 KWD',
    doctors: 3,
    status: 'active',
    icon: 'Sparkles',
  },
  {
    id: '2',
    name: 'Acne Treatment',
    category: 'skin',
    duration: '45 min',
    price: '22 KWD',
    doctors: 4,
    status: 'active',
    icon: 'ScanFace',
  },
  {
    id: '3',
    name: 'Hydration Facial Therapy',
    category: 'skin',
    duration: '60 min',
    price: '30 KWD',
    doctors: 2,
    status: 'active',
    icon: 'Droplets',
  },
  {
    id: '4',
    name: 'Fillers Consultation',
    category: 'face',
    duration: '35 min',
    price: '35 KWD',
    doctors: 2,
    status: 'inactive',
    icon: 'Syringe',
  },
];

export function AdminServicesScreen() {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesFilter =
        selectedFilter === 'all' || service.category === selectedFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.category.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [search, selectedFilter]);

  const activeCount = services.filter((service) => service.status === 'active').length;
  const inactiveCount = services.filter((service) => service.status === 'inactive').length;

  return (
    <Screen
      title="Services"
      subtitle="Treatment management"
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
          icon="Sparkles"
          title="Clinic Services"
          description="Manage treatment names, categories, pricing, duration, assigned doctors, and service status."
        >
          <View style={styles.statsRow}>
            <SummaryItem label="Total" value={`${services.length}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Active" value={`${activeCount}`} />
            <View style={styles.statDivider} />
            <SummaryItem label="Inactive" value={`${inactiveCount}`} />
          </View>

          <AppButton title="Add Service" />
        </AdminHeroCard>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search services..."
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
            title="Service List"
            subtitle={`${filteredServices.length} services found`}
          />

          <View style={styles.list}>
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </View>

        {filteredServices.length === 0 ? (
          <AdminEmptyState
            title="No services found"
            description="Try another keyword or change the service category filter."
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

function ServiceCard({ service }: { service: AdminService }) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isActive = service.status === 'active';

  return (
    <Pressable
      style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}
    >
      <View style={styles.serviceTop}>
        <View style={styles.serviceIcon}>
          <AppIcon
            name={service.icon}
            size={24}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.cardText}>
          <View style={styles.titleRow}>
            <AppText variant="bodyMedium" style={styles.title}>
              {service.name}
            </AppText>

            <AdminStatusBadge
              label={isActive ? 'Active' : 'Inactive'}
              type={isActive ? 'success' : 'error'}
            />
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {service.category.toUpperCase()}
          </AppText>
        </View>
      </View>

      <View style={styles.detailsBox}>
        <AdminDetailItem icon="Clock" label="Duration" value={service.duration} />
        <AdminDetailItem icon="CreditCard" label="Price" value={service.price} />
        <AdminDetailItem
          icon="Stethoscope"
          label="Doctors"
          value={`${service.doctors} assigned`}
        />
      </View>

      <View style={styles.actionRow}>
        <AppButton
          title="Edit"
          fullWidth={false}
          style={styles.actionButton}
        />

        <AppButton
          title={isActive ? 'Disable' : 'Enable'}
          variant="outline"
          fullWidth={false}
          style={styles.actionButton}
        />
      </View>
    </Pressable>
  );
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

    serviceCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      ...(theme.shadows.card ?? {}),
    },

    serviceTop: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      alignItems: 'center',
    },

    serviceIcon: {
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

    detailsBox: {
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