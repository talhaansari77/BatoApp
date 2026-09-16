import React from 'react';
import { Pressable, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AuthStackParamList,
  RootStackParamList,
} from '../../../core/navigation/navigation.types';
import { Screen } from '../../../shared/ui/templates/Screen';
import { AppText } from '../../../shared/ui/atoms/AppText';
import { AppButton } from '../../../shared/ui/atoms/AppButton';
import { useAppTheme } from '../../../app/providers/ThemeProvider';

type Props = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'RoleSelection'>,
  NativeStackScreenProps<RootStackParamList>
>;

type Role = 'Patient' | 'Doctor' | 'Admin';

export function RoleSelectionScreen({ navigation }: Props) {
  const theme = useAppTheme();
  const [selectedRole, setSelectedRole] = React.useState<Role>('Patient');

  const continueToRole = () => {
    if (selectedRole === 'Patient') {
      navigation.navigate('PatientApp');
      return;
    }

    if (selectedRole === 'Doctor') {
      navigation.navigate('DoctorApp');
      return;
    }

    navigation.navigate('AdminApp');
  };

  return (
    <Screen
      title="Select Role"
      subtitle="Choose your BATO access"
      showBack
      onBackPress={() => navigation.goBack()}
      footer={
        <AppButton
          title={`Continue as ${selectedRole}`}
          onPress={continueToRole}
        />
      }
    >
      <View style={{ gap: theme.spacing.md }}>
        {(['Patient', 'Doctor', 'Admin'] as const).map((role) => {
          const isSelected = selectedRole === role;

          return (
            <Pressable
              key={role}
              onPress={() => setSelectedRole(role)}
              style={{
                backgroundColor: theme.colors.card,
                borderRadius: theme.radius.xl,
                padding: theme.spacing.xl,
                borderWidth: 1.5,
                borderColor: isSelected
                  ? theme.colors.primaryDark
                  : theme.colors.border,
              }}
            >
              <AppText
                variant="bodyMedium"
                color={isSelected ? theme.colors.primaryDark : theme.colors.text}
              >
                {role}
              </AppText>

              <AppText
                variant="caption"
                color={theme.colors.textMuted}
                style={{ marginTop: theme.spacing.xs }}
              >
                {role === 'Patient'
                  ? 'Book appointments and track your treatment journey.'
                  : role === 'Doctor'
                    ? 'Manage appointments, patients, notes, and treatment plans.'
                    : 'Manage clinic operations, services, users, and reports.'}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}