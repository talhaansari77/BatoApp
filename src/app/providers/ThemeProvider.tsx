import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AccessibilityInfo, StyleSheet, useColorScheme } from 'react-native';
import { EaseView } from 'react-native-ease';

import {
  AppColors,
  darkColors,
  lightColors,
  radius,
  shadows,
  spacing,
  typography,
} from '../../theme';

export type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedMode = 'light' | 'dark';
type Phase = 'idle' | 'out' | 'commit' | 'in';
type ThemeState = { mode: ThemeMode; resolvedMode: ResolvedMode };
type PendingTransition = ThemeState & { finish: () => void };

const THEME_STORAGE_KEY = 'bato.theme.mode';
const FADE_OUT_MS = 100;
const FADE_IN_MS = 180;

type AppTheme = {
  mode: ThemeMode;
  resolvedMode: ResolvedMode;
  colors: AppColors;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  typography: typeof typography;
  setMode: (mode: ThemeMode) => Promise<void>;
  isThemeTransitioning: boolean;
};

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useColorScheme();
  // Some React Native versions also return "unspecified". Normalize it before
  // assigning anything to our light/dark-only ResolvedMode type.
  const systemMode: ResolvedMode = deviceColorScheme === 'dark' ? 'dark' : 'light';
  const systemModeRef = useRef(systemMode);
  systemModeRef.current = systemMode;

  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'light',
    resolvedMode: 'light',
  });
  const themeStateRef = useRef(themeState);
  const [phase, setPhaseState] = useState<Phase>('idle');
  const phaseRef = useRef<Phase>('idle');
  const pendingRef = useRef<PendingTransition | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const mountedRef = useRef(true);
  const userRequestedRef = useRef(false);
  // Do not animate until the accessibility preference has been read.
  const [reduceMotion, setReduceMotion] = useState(true);
  const reduceMotionRef = useRef(true);

  const setPhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  const applyTheme = useCallback((next: ThemeState) => {
    themeStateRef.current = next;
    setThemeState(next);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    let receivedEvent = false;
    const updatePreference = (enabled: boolean) => {
      reduceMotionRef.current = enabled;
      setReduceMotion(enabled);
    };
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        receivedEvent = true;
        if (mountedRef.current) updatePreference(enabled);
      },
    );
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mountedRef.current && !receivedEvent) updatePreference(enabled);
      })
      .catch(() => {});

    return () => {
      mountedRef.current = false;
      subscription.remove();
      // Release waiting callers rather than leaving an unresolved promise.
      pendingRef.current?.finish();
      pendingRef.current = null;
    };
  }, []);

  const transitionTo = useCallback((next: ThemeState): Promise<void> => {
    if (
      reduceMotionRef.current ||
      themeStateRef.current.resolvedMode === next.resolvedMode
    ) {
      applyTheme(next);
      return Promise.resolve();
    }

    return new Promise<void>((finish) => {
      pendingRef.current = { ...next, finish };
      // Keep the OLD palette until the native fade-out reports completion.
      setPhase('out');
    });
  }, [applyTheme, setPhase]);

  const enqueueChange = useCallback((nextMode: ThemeMode, persist: boolean) => {
    // Serialize requests so rapid taps or OS changes cannot interrupt a commit.
    const task = queueRef.current.catch(() => {}).then(async () => {
      if (!mountedRef.current) return;
      const nextResolved: ResolvedMode = nextMode === 'system'
        ? systemModeRef.current
        : nextMode;
      await transitionTo({ mode: nextMode, resolvedMode: nextResolved });
      if (persist && mountedRef.current) {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
      }
    });
    queueRef.current = task;
    return task;
  }, [transitionTo]);

  const setMode = useCallback((nextMode: ThemeMode) => {
    userRequestedRef.current = true;
    return enqueueChange(nextMode, true);
  }, [enqueueChange]);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedMode) => {
        // Do not overwrite a choice made while storage was loading.
        if (!active || userRequestedRef.current) return;
        if (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system') {
          applyTheme({
            mode: savedMode,
            resolvedMode: savedMode === 'system'
              ? systemModeRef.current
              : savedMode,
          });
        }
      })
      .catch((error) => console.warn('Unable to load theme preference:', error));
    return () => { active = false; };
  }, [applyTheme]);

  useEffect(() => {
    if (
      themeState.mode === 'system' &&
      themeState.resolvedMode !== systemMode
    ) {
      void enqueueChange('system', false)
        .catch((error) => console.warn('Unable to update system theme:', error));
    }
  }, [systemMode, themeState.mode, themeState.resolvedMode, enqueueChange]);

  const handleTransitionEnd = useCallback(({ finished }: { finished: boolean }) => {
    if (!finished || !mountedRef.current) return;
    const pending = pendingRef.current;
    if (!pending) return;

    if (phaseRef.current === 'out') {
      // Everything changes in this hidden render: text, icons, cards, footer.
      applyTheme({ mode: pending.mode, resolvedMode: pending.resolvedMode });
      setPhase('commit');
    } else if (phaseRef.current === 'in') {
      pendingRef.current = null;
      setPhase('idle');
      pending.finish();
    }
  }, [applyTheme, setPhase]);

  useEffect(() => {
    if (phase !== 'commit') return;
    // Allow the new hidden palette to reach the native tree before revealing it.
    // These are render frames, not a timeout guessing the animation duration.
    let secondFrame: number | undefined;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        if (mountedRef.current && phaseRef.current === 'commit') setPhase('in');
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame !== undefined) cancelAnimationFrame(secondFrame);
    };
  }, [phase, setPhase]);

  const colors = themeState.resolvedMode === 'dark' ? darkColors : lightColors;
  const value = useMemo<AppTheme>(() => ({
    ...themeState,
    colors,
    spacing,
    radius,
    shadows,
    typography,
    setMode,
    isThemeTransitioning: phase !== 'idle',
  }), [themeState, colors, setMode, phase]);

  return (
    <ThemeContext.Provider value={value}>
      <EaseView
        style={styles.fill}
        animate={{ backgroundColor: colors.background }}
        transition={reduceMotion
          ? { type: 'none' }
          : { type: 'timing', duration: FADE_IN_MS, easing: 'easeInOut' }}
      >
        <EaseView
          style={styles.fill}
          animate={{ opacity: phase === 'out' || phase === 'commit' ? 0 : 1 }}
          transition={reduceMotion
            ? { type: 'none' }
            : {
                type: 'timing',
                duration: phase === 'out' ? FADE_OUT_MS : FADE_IN_MS,
                easing: 'easeInOut',
              }}
          onTransitionEnd={handleTransitionEnd}
          pointerEvents={phase === 'idle' ? 'auto' : 'none'}
        >
          {children}
        </EaseView>
      </EaseView>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });

export function useAppTheme() {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useAppTheme must be used inside ThemeProvider');
  return theme;
}
