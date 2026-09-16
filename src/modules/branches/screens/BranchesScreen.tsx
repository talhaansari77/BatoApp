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
import { AppIcon } from '../../../shared/ui/atoms/AppIcon';
import { Screen } from '../../../shared/ui/templates/Screen';
import { Branch } from '../services/branchesApi';
import { useBranchesStore } from '../store/branches.store';

export function BranchesScreen() {
  const theme = useAppTheme();

  const branches = useBranchesStore((state) => state.branches);
  const isLoading = useBranchesStore((state) => state.isLoading);
  const error = useBranchesStore((state) => state.error);
  const fetchBranches = useBranchesStore((state) => state.fetchBranches);

  React.useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const renderBranch = ({ item }: { item: Branch }) => {
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
            <AppIcon name="MapPin" size={24} color={theme.colors.primary} />
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
              {item.address}
            </Text>

            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
              {item.city ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <AppIcon name="Building2" size={14} color={theme.colors.textMuted} />
                  <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                    {item.city}
                  </Text>
                </View>
              ) : null}

              {item.phone ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <AppIcon name="Phone" size={14} color={theme.colors.textMuted} />
                  <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
                    {item.phone}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          <AppIcon name="ChevronRight" size={20} color={theme.colors.textMuted} />
        </View>
      </Pressable>
    );
  };

  return (
    <Screen title="Choose Branch" subtitle="Select your preferred BATO location">
      {isLoading && branches.length === 0 ? (
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
        data={branches.filter((branch) => branch.isActive)}
        keyExtractor={(item) => item.id}
        renderItem={renderBranch}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchBranches} />
        }
      />
    </Screen>
  );
}