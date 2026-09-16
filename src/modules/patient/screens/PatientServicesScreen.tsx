import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
// import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
// import { PatientTabParamList } from '../../../core/navigation/navigation.types';
import { PatientStackParamList } from '../../../core/navigation/navigation.types';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppInput } from '../../../shared/ui/atoms/AppInput';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { Screen } from '../../../shared/ui/templates/Screen';

type PatientServicesNavigation = NativeStackNavigationProp<PatientStackParamList>;

type ServiceCategoryId = 'all' | 'hair' | 'skin' | 'face';

type ServiceCategory = {
  id: ServiceCategoryId;
  title: string;
  icon: AppIconName;
};

type Service = {
  id: string;
  title: string;
  category: Exclude<ServiceCategoryId, 'all'>;
  description: string;
  duration: string;
  price: string;
  icon: AppIconName;
  tag?: string;
};

const categories: ServiceCategory[] = [
  {
    id: 'all',
    title: 'All',
    icon: 'LayoutGrid',
  },
  {
    id: 'hair',
    title: 'Hair',
    icon: 'Sparkles',
  },
  {
    id: 'skin',
    title: 'Skin',
    icon: 'ScanFace',
  },
  {
    id: 'face',
    title: 'Face',
    icon: 'SmilePlus',
  },
];

const services: Service[] = [
  {
    id: 'hair-growth',
    title: 'Hair Growth Treatment',
    category: 'hair',
    description: 'Personalized scalp and hair strengthening care plan.',
    duration: '45 min',
    price: 'From 25 KWD',
    icon: 'Sprout',
    tag: 'Popular',
  },
  {
    id: 'hair-fall',
    title: 'Hair Fall Control',
    category: 'hair',
    description: 'Medical consultation and treatment for hair fall concerns.',
    duration: '40 min',
    price: 'From 20 KWD',
    icon: 'ShieldCheck',
  },
  {
    id: 'hair-nourishment',
    title: 'Hair Nourishment Therapy',
    category: 'hair',
    description: 'Deep care therapy for dry, weak, or damaged hair.',
    duration: '50 min',
    price: 'From 18 KWD',
    icon: 'Leaf',
  },
  {
    id: 'skin-acne',
    title: 'Acne Treatment',
    category: 'skin',
    description: 'Dermatology-led acne care with progress follow-up.',
    duration: '45 min',
    price: 'From 22 KWD',
    icon: 'Activity',
    tag: 'Doctor Recommended',
  },
  {
    id: 'skin-hydration',
    title: 'Hydration Facial Therapy',
    category: 'skin',
    description: 'Premium skin hydration and glow recovery treatment.',
    duration: '60 min',
    price: 'From 30 KWD',
    icon: 'Droplets',
  },
  {
    id: 'skin-analysis',
    title: 'Skin Analysis',
    category: 'skin',
    description: 'Detailed skin assessment before starting treatment.',
    duration: '30 min',
    price: 'From 15 KWD',
    icon: 'ScanLine',
  },
  {
    id: 'face-fillers',
    title: 'Fillers Consultation',
    category: 'face',
    description: 'Specialist consultation for natural facial enhancement.',
    duration: '35 min',
    price: 'From 35 KWD',
    icon: 'Syringe',
  },
  {
    id: 'face-botox',
    title: 'Botox Consultation',
    category: 'face',
    description: 'Personalized anti-aging consultation and care planning.',
    duration: '35 min',
    price: 'From 35 KWD',
    icon: 'Sparkle',
  },
  {
    id: 'face-lifting',
    title: 'Face Lifting Care',
    category: 'face',
    description: 'Non-surgical lifting and beauty enhancement procedures.',
    duration: '50 min',
    price: 'From 45 KWD',
    icon: 'Gem',
    tag: 'Premium',
  },
];

export function PatientServicesScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation<PatientServicesNavigation>();

  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategoryId>('all');
  const [search, setSearch] = useState('');

  const styles = useMemo(() => createStyles(theme), [theme]);

  const filteredServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === 'all' || service.category === selectedCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        service.title.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <Screen
      title="Services"
      subtitle="Choose your treatment"
      actions={[
        {
          icon: 'Bell',
          onPress: () => {},
        },
      ]}
    >
      <View style={styles.root}>
        <View style={styles.heroCard}>
          <View style={styles.heroText}>
            <View style={styles.heroBadge}>
              <AppIcon
                name="HeartPulse"
                size={15}
                color={theme.colors.primaryDark}
              />

              <AppText variant="small" color={theme.colors.primaryDark}>
                Medical Beauty Care
              </AppText>
            </View>

            <AppText variant="h2">Find the right treatment for you</AppText>

            <AppText color={theme.colors.textMuted}>
              Explore hair, skin, and face treatments designed by BATO Clinic
              specialists.
            </AppText>
          </View>

          <View style={styles.heroIcon}>
            <AppIcon
              name="Sparkles"
              size={42}
              color={theme.colors.primaryDark}
            />
          </View>
        </View>

        <AppInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search treatments..."
          leftIcon="Search"
          rightIcon={search ? 'X' : undefined}
          onRightIconPress={() => setSearch('')}
        />

        <View style={styles.categoryRow}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={({ pressed }) => [
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                  pressed && styles.pressed,
                ]}
              >
                <AppIcon
                  name={category.icon}
                  size={18}
                  color={
                    isSelected
                      ? theme.colors.primaryDark
                      : theme.colors.textMuted
                  }
                />

                <AppText
                  variant="caption"
                  color={
                    isSelected
                      ? theme.colors.primaryDark
                      : theme.colors.textMuted
                  }
                  style={isSelected ? styles.selectedText : undefined}
                >
                  {category.title}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <AppIcon
              name="CalendarPlus"
              size={24}
              color={theme.colors.primaryDark}
            />
          </View>

          <View style={styles.summaryText}>
            <AppText variant="bodyMedium">Booking flow preview</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              Service → branch → doctor → date and time → payment option.
            </AppText>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <AppText variant="h3">Available Treatments</AppText>

            <AppText variant="caption" color={theme.colors.textMuted}>
              {filteredServices.length} services found
            </AppText>
          </View>
        </View>

        <View style={styles.serviceList}>
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onBookPress={() => navigation.navigate('ServiceDetails')}
            />
          ))}
        </View>

        {filteredServices.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <AppIcon
                name="SearchX"
                size={30}
                color={theme.colors.primaryDark}
              />
            </View>

            <AppText variant="bodyMedium" align="center">
              No treatment found
            </AppText>

            <AppText
              variant="caption"
              color={theme.colors.textMuted}
              align="center"
            >
              Try another keyword or choose a different category.
            </AppText>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

type ServiceCardProps = {
  service: Service;
  onBookPress: () => void;
};

function ServiceCard({ service, onBookPress }: ServiceCardProps) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable style={({ pressed }) => [styles.serviceCard, pressed && styles.pressed]}>
      <View style={styles.serviceTop}>
        <View style={styles.serviceIcon}>
          <AppIcon
            name={service.icon}
            size={25}
            color={theme.colors.primaryDark}
          />
        </View>

        <View style={styles.serviceInfo}>
          <View style={styles.serviceTitleRow}>
            <AppText variant="bodyMedium" style={styles.serviceTitle}>
              {service.title}
            </AppText>

            {service.tag ? (
              <View style={styles.tag}>
                <AppText variant="small" color={theme.colors.primaryDark}>
                  {service.tag}
                </AppText>
              </View>
            ) : null}
          </View>

          <AppText variant="caption" color={theme.colors.textMuted}>
            {service.description}
          </AppText>
        </View>
      </View>

      <View style={styles.serviceMetaRow}>
        <View style={styles.metaItem}>
          <AppIcon name="Clock" size={16} color={theme.colors.textMuted} />

          <AppText variant="caption" color={theme.colors.textMuted}>
            {service.duration}
          </AppText>
        </View>

        <View style={styles.metaItem}>
          <AppIcon
            name="CircleDollarSign"
            size={16}
            color={theme.colors.textMuted}
          />

          <AppText variant="caption" color={theme.colors.textMuted}>
            {service.price}
          </AppText>
        </View>
      </View>

      <View style={styles.serviceFooter}>
        <AppButton
          title="Book Now"
          fullWidth={false}
          style={styles.bookButton}
          onPress={onBookPress}
        />

        <Pressable style={styles.detailsButton} onPress={onBookPress}>
          <AppText variant="caption" color={theme.colors.primaryDark}>
            Details
          </AppText>

          <AppIcon
            name="ChevronRight"
            size={17}
            color={theme.colors.primaryDark}
          />
        </Pressable>
      </View>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      gap: theme.spacing.xl,
    },

    heroCard: {
      borderRadius: theme.radius['2xl'],
      backgroundColor: theme.colors.nude,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.xl,
      flexDirection: 'row',
      gap: theme.spacing.md,
      overflow: 'hidden',
      ...(theme.shadows.card ?? {}),
    },

    heroText: {
      flex: 1,
      gap: theme.spacing.md,
    },

    heroBadge: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.card,
    },

    heroIcon: {
      width: 76,
      height: 76,
      borderRadius: theme.radius['2xl'],
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.card,
      alignSelf: 'center',
    },

    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },

    categoryChip: {
      minHeight: 42,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.full,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.card,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    categoryChipActive: {
      borderColor: theme.colors.primaryDark,
      backgroundColor: theme.colors.cardMuted,
    },

    selectedText: {
      fontWeight: '700',
    },

    summaryCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.info,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },

    summaryIcon: {
      width: 48,
      height: 48,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },

    summaryText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    serviceList: {
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
    },

    serviceIcon: {
      width: 50,
      height: 50,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.cardMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },

    serviceInfo: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    serviceTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },

    serviceTitle: {
      flex: 1,
    },

    tag: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.warning,
    },

    serviceMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
    },

    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    serviceFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
    },

    bookButton: {
      minHeight: 42,
      paddingHorizontal: theme.spacing.xl,
    },

    detailsButton: {
      minHeight: 42,
      paddingHorizontal: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },

    emptyCard: {
      borderRadius: theme.radius.xl,
      backgroundColor: theme.colors.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing['2xl'],
      alignItems: 'center',
      gap: theme.spacing.sm,
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