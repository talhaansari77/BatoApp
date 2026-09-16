import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { useAppTheme } from '../../../app/providers/ThemeProvider';
import { Screen } from '../../../shared/ui/templates/Screen';
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { useServicesStore } from '../store/services.store';
import { ClinicService } from '../services/servicesApi';

export function ServicesScreen() {
  const theme = useAppTheme();

  const services = useServicesStore((state) => state.services);
  const isLoading = useServicesStore((state) => state.isLoading);
  const error = useServicesStore((state) => state.error);
  const fetchServices = useServicesStore((state) => state.fetchServices);

  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const renderService = ({ item }: { item: ClinicService }) => {
    return (
      <Pressable
        style={{
          padding: theme.spacing.md,
          borderRadius: theme.radius.lg,
          backgroundColor: theme.colors.card,
          marginBottom: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: theme.radius.md,
              backgroundColor: theme.colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppIcon name="Sparkles" size={24} color={theme.colors.primary} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: theme.colors.text,
                fontSize: 16,
                fontWeight: '700',
                marginBottom: 4,
              }}
            >
              {item.name}
            </Text>

            <Text
              style={{
                color: theme.colors.textMuted,
                fontSize: 13,
                marginBottom: theme.spacing.sm,
              }}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.md,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <AppIcon name="Clock3" size={14} color={theme.colors.textMuted} />
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                  {item.durationMinutes} min
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <AppIcon name="BadgeDollarSign" size={14} color={theme.colors.textMuted} />
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                  {item.price} KWD
                </Text>
              </View>
            </View>
          </View>

          <AppIcon name="ChevronRight" size={20} color={theme.colors.textMuted} />
        </View>
      </Pressable>
    );
  };

  return (
    <Screen
      title="Services"
      subtitle="Choose a treatment to start booking"
      scroll={false}
    >
      {isLoading && services.length === 0 ? (
        <View style={{ paddingVertical: theme.spacing.xl }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {error ? (
        <Text style={{ color: theme.colors.danger, marginBottom: theme.spacing.md }}>
          {error}
        </Text>
      ) : null}

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderService}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: theme.spacing.xl,
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchServices} />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View
              style={{
                padding: theme.spacing.lg,
                borderRadius: theme.radius.lg,
                backgroundColor: theme.colors.card,
                alignItems: 'center',
              }}
            >
              <AppIcon name="SearchX" size={32} color={theme.colors.textMuted} />
              <Text
                style={{
                  color: theme.colors.text,
                  fontWeight: '700',
                  marginTop: theme.spacing.sm,
                }}
              >
                No services found
              </Text>
              <Text
                style={{
                  color: theme.colors.textMuted,
                  textAlign: 'center',
                  marginTop: 4,
                }}
              >
                Please check again later.
              </Text>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}