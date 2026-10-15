import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { AppText } from '../atoms/AppText';
import { AppIcon } from '../atoms/AppIcon';

type ProfileHeaderProps = {
  title?: string;
  subtitle?: string;
  avatarUrl?: string;
  avatarText?: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

export function ProfileHeader({
  title = 'BATO Clinic',
  subtitle = 'Profile Setup',
  avatarUrl,
  avatarText = 'B',
  showBack = false,
  onBackPress,
}: ProfileHeaderProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border || '#DEDCD5',
          borderBottomColor: theme.colors.border || '#DEDCD5',
        },
      ]}
    >
      
      <View style={styles.row}>
        {showBack && onBackPress && (
        <Pressable onPress={onBackPress} style={{backgroundColor:theme.colors.surfaceSecondary,padding:10,borderRadius:10,marginRight:10}}>
          <AppIcon name="ArrowLeft" size={24} color={theme.colors.text || '#322C24'} />
        </Pressable>
      )}
        {/* Avatar / Badge */}
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: theme.colors.primaryDark || '#322C24' },
          ]}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
          ) : (
            <AppText variant="h3" color="#FFFFFF" style={styles.avatarText}>
              {avatarText}
            </AppText>
          )}
        </View>

        {/* Text Container */}
        <View style={styles.textContainer}>
          <AppText variant="h3" style={styles.titleText} numberOfLines={1}>
            {title}
          </AppText>
          <AppText
            variant="caption"
            color={theme.colors.textMuted || '#77736A'}
            numberOfLines={1}
          >
            {subtitle}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontWeight: '700',
    fontSize: 16,
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleText: {
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 20,
  },
  backButton: {
  
  },
});