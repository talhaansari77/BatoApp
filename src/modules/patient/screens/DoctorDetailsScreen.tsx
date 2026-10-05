import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppIcon, AppIconName } from '../../../shared/ui/atoms/AppIcon';
import { AppText } from '../../../shared/ui/atoms/AppText';
import Assets from '@/assets';

/* ------------------------------------------------------------------ */
/* Mock data from the design                                           */
/* ------------------------------------------------------------------ */

const doctor = {
  specialty: 'Heart Expert',
  name: 'Dr. Talha',
  credentials: 'MBBS, FACC, FRCP FCCP(USA),DM',
  price: '$30 KWD',
  priceLabel: 'Per Session',
  // Replace with your own image. A transparent PNG cut-out gives the exact look.
  image: { uri: Assets.Images.DoctorPicOnline1 },
  about:
    'Dr. Willam James is a board-certified heart expert with over 12 years of experience in the field of cardiovascular medicine. He focuses on preventive cardiology, heart failure care and long-term patient follow-up.',
};

const stats = [
  { value: '12 Years', label: 'Experience' },
  { value: '4.9', label: 'Rating' },
  { value: '2500+', label: 'Patients' },
];

const tabs = ['About', 'Availability', 'Experience', 'Education'] as const;
type Tab = (typeof tabs)[number];

type InfoCardData = {
  label: string;
  value: string;
  symbol?: string;
  icon?: AppIconName;
};

const infoCards: InfoCardData[] = [
  { symbol: '$', label: 'Per Session Fee', value: '$130' },
  { symbol: '$', label: 'Follow-Up Fee', value: '$40' },
  { icon: 'Clock', label: 'Session Duration', value: '30m' },
  { icon: 'CalendarCheck', label: 'Available Slots', value: '23' },
];

// Mock lists for the other tabs
const experienceItems = [
  { title: 'Senior Cardiologist', subtitle: 'City Heart Hospital · 2018 – Present' },
  { title: 'Consultant Cardiologist', subtitle: 'National Cardiac Center · 2014 – 2018' },
];

const educationItems = [
  { title: 'MBBS', subtitle: 'University of Medicine' },
  { title: 'DM Cardiology', subtitle: 'Institute of Cardiovascular Sciences' },
];

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

const MINT = '#CDE3DB';
const MINT_STRONG = '#9ED3CA';
const MINT_BORDER = '#BFE0D8';
const GLASS = 'rgba(150, 185, 175, 0.55)';
const INK = '#14201D';
const INK_MUTED = '#5E716B';

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export function DoctorDetailsScreen() {
  const theme = useAppTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [activeTab, setActiveTab] = useState<Tab>('About');
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Hero */}
        <View style={[styles.hero, { paddingTop: insets.top + theme.spacing.md }]}>
          <Image
            source={doctor.image}
            style={styles.heroImage}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />

          <View style={styles.topBar}>
            <CircleButton
              icon="ChevronLeft"
              label="Go back"
              onPress={() => navigation.goBack()}
            />

            <View style={styles.topBarRight}>
              <CircleButton
                icon="Heart"
                label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
                active={isFavorite}
                onPress={() => setIsFavorite((value) => !value)}
              />
              <CircleButton
                icon="Share2"
                label="Share"
                onPress={() => {
                  // TODO: share doctor profile
                }}
              />
            </View>
          </View>

          <View style={styles.heroInfo}>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {doctor.specialty}
            </AppText>

            <AppText variant="h1" color={theme.colors.text} style={styles.doctorName}>
              {doctor.name}
            </AppText>

            <AppText variant="caption" color={theme.colors.textMuted} style={styles.credentials}>
              {doctor.credentials}
            </AppText>

            <View style={styles.priceBlock}>
              <AppText variant="h2" color={theme.colors.text} style={styles.price}>
                {doctor.price}
              </AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {doctor.priceLabel}
              </AppText>
            </View>
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat) => (
              <View key={stat.label} style={styles.statCard}>
                <AppText variant="bodyMedium" color={theme.colors.nude} style={styles.statValue}>
                  {stat.value}
                </AppText>
                <AppText variant="caption" color={theme.colors.nude}>
                  {stat.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Sheet */}
        <View style={styles.sheet}>
          <View style={styles.tabRow}>
            {tabs.map((tab) => {
              const selected = tab === activeTab;

              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  style={[styles.tab, selected && styles.tabActive]}
                >
                  <AppText
                    variant="caption"
                    color={selected ? INK : INK_MUTED}
                    style={selected ? styles.bold : undefined}
                  >
                    {tab}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          {activeTab === 'About' ? (
            <>
              <View>
                <AppText
                  variant="bodyMedium"
                  color={INK}
                  numberOfLines={expanded ? undefined : 3}
                  style={styles.aboutText}
                >
                  {doctor.about}
                </AppText>

                <Pressable
                  onPress={() => setExpanded((value) => !value)}
                  hitSlop={8}
                  accessibilityRole="button"
                  style={styles.moreButton}
                >
                  <AppText variant="caption" color={theme.colors.overlay}>
                    {expanded ? 'Less' : 'More'}
                  </AppText>
                </Pressable>
              </View>

              <View style={styles.grid}>
                {infoCards.map((card) => (
                  <View key={card.label} style={styles.infoCard}>
                    {card.symbol ? (
                      <AppText variant="h2" color={INK}>
                        {card.symbol}
                      </AppText>
                    ) : card.icon ? (
                      <AppIcon name={card.icon} size={26} color={INK} />
                    ) : null}

                    <AppText variant="caption" color={INK_MUTED}>
                      {card.label}
                    </AppText>
                    <AppText variant="h3" color={INK} style={styles.bold}>
                      {card.value}
                    </AppText>
                  </View>
                ))}
              </View>
            </>
          ) : null}

          {activeTab === 'Availability' ? (
            <AppText variant="bodyMedium" color={theme.colors.text}>
              Pick a date and time on the next step.
            </AppText>
          ) : null}

          {activeTab === 'Experience' ? (
            <TimelineList items={experienceItems} />
          ) : null}

          {activeTab === 'Education' ? <TimelineList items={educationItems} /> : null}
        </View>
      </ScrollView>

      {/* Floating button */}
      <View
        pointerEvents="box-none"
        style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.md }]}
      >
        <Pressable
          onPress={() => {
            // TODO: go to the booking step
          }}
          accessibilityRole="button"
          style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}
        >
          <AppText variant="bodyMedium" color={theme.colors.nude} style={styles.bold}>
            Next
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function CircleButton({
  icon,
  label,
  onPress,
  active,
}: {
  icon: AppIconName;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.circleButton, pressed && styles.pressed]}
    >
      <AppIcon name={icon} size={22} color={active ? '#E5484D' : INK} />
    </Pressable>
  );
}

function TimelineList({
  items,
}: {
  items: { title: string; subtitle: string }[];
}) {
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.timeline}>
      {items.map((item) => (
        <View key={item.title} style={styles.timelineItem}>
          <View style={styles.timelineDot} />
          <View style={styles.timelineText}>
            <AppText variant="bodyMedium" color={theme.colors.text} style={styles.bold}>
              {item.title}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {item.subtitle}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

function createStyles(theme: ReturnType<typeof useAppTheme>) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    scrollContent: {
      flexGrow: 1,
      paddingBottom: 120,
    },

    bold: {
      fontWeight: '700',
    },

    pressed: {
      opacity: 0.85,
    },

    /* Hero */
    hero: {
      backgroundColor: theme.colors.nude,
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
      overflow: 'hidden',
    },

    heroImage: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: '64%',
      height: '70%',
    },

    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    topBarRight: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },

    circleButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.overlay_3,
      alignItems: 'center',
      justifyContent: 'center',
    },

    heroInfo: {
      width: '55%',
      marginTop: theme.spacing.xl,
      gap: theme.spacing.xs,
    },

    doctorName: {
      fontWeight: '700',
    },

    credentials: {
      marginTop: theme.spacing.xs,
      lineHeight: 22,
    },

    priceBlock: {
      marginTop: theme.spacing.xl,
      gap: 2,
    },

    price: {
      fontSize: 28,
      fontWeight: '700',
    },

    statsRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xl,
    },

    statCard: {
      flex: 1,
      minHeight: 96,
      borderRadius: 24,
      backgroundColor: theme.colors.overlayDark,
      borderWidth: 1,
      borderColor: theme.colors.overlay_2,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
    },

    statValue: {
      fontSize: 18,
      fontWeight: '600',
    },

    /* Sheet */
    sheet: {
      flex: 1,
      marginTop: -1,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      padding: theme.spacing.lg,
      gap: theme.spacing.xl,
    },

    tabRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    tab: {
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },

    tabActive: {
      borderBottomColor: INK,
    },

    aboutText: {
      lineHeight: 26,
    },

    moreButton: {
      alignSelf: 'flex-start',
      marginTop: theme.spacing.xs,
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },

    infoCard: {
      width: '48%',
      flexGrow: 1,
      minHeight: 128,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.overlay,
      backgroundColor: theme.colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      padding: theme.spacing.md,
    },

    timeline: {
      gap: theme.spacing.lg,
    },

    timelineItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.md,
    },

    timelineDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 6,
      backgroundColor: theme.colors.overlay,
    },

    timelineText: {
      flex: 1,
      gap: theme.spacing.xs,
    },

    /* Footer */
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: theme.spacing.lg,
    },

    nextButton: {
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.overlayDark,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
