import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrustProfile } from '../hooks/useTrustProfile';
import { isValidWalletAddress } from '../lib/validation';
import { api } from '../lib/api';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import TrustProfileCard from '../components/trust/TrustProfileCard';
import Header from '../components/layout/Header';
import demoWallets from '../data/demo-wallets.json';

// Local domain resolution for offline mode
const DEMO_DOMAINS: Record<string, string> = {};
for (const w of demoWallets) {
  if (w.analysis.hasSolDomain && w.analysis.solDomain) {
    DEMO_DOMAINS[w.analysis.solDomain.toLowerCase()] = w.walletAddress;
  }
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [searchAddress, setSearchAddress] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const { profile, loading, error } = useTrustProfile(searchAddress);

  const handleSearch = useCallback(async () => {
    Keyboard.dismiss();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Direct wallet address
    if (isValidWalletAddress(trimmed)) {
      setSearchAddress(trimmed);
      return;
    }

    // Try domain resolution (.sol or .skr)
    if (trimmed.includes('.')) {
      setResolving(true);
      try {
        const result = await api.resolveDomain(trimmed);
        if (result?.walletAddress) {
          setSearchAddress(result.walletAddress);
        } else {
          setSearchAddress(null);
        }
      } catch {
        // Offline fallback: check local demo domains
        const localAddr = DEMO_DOMAINS[trimmed.toLowerCase()];
        setSearchAddress(localAddr ?? null);
      } finally {
        setResolving(false);
      }
      return;
    }

    // Invalid input
    setSearchAddress(null);
  }, [query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Search Wallet</Text>
            <Text style={styles.subtitle}>Look up any wallet's trust score</Text>
          </View>
          {searchAddress && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setQuery('');
                setSearchAddress(null);
              }}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Wallet address or .sol/.skr domain"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Intro + suggestions when no search active */}
        {!searchAddress && !loading && !resolving && !error && (
          <View style={styles.suggestionsContainer}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Every Solana wallet has a trust score based on on-chain activity, DeFi usage, wallet age, and more. Enter any wallet address or .sol/.skr domain to see their score.
              </Text>
            </View>
            <Text style={styles.suggestionsTitle}>Try a demo wallet</Text>
            {[
              { label: 'dami.sol', sub: 'Trusted \u2022 75', addr: 'fRRwPwbb9wqTbf9ZDHjMRVKZoDBPsjsP7Rh7VZVMqxX3' },
              { label: 'og.sol', sub: 'Highly Trusted \u2022 86', addr: 'eHHHqVwd1DsmwmbK913uRTXKB7wT35uP775HVRffRDB3' },
              { label: 'nftking.sol', sub: 'Established \u2022 51', addr: 'abD5FFDf3d9PHRMXwdTjf5y19hP9MjfT7DKjyKMRHwsq' },
              { label: 'whale.sol', sub: 'Trusted \u2022 75', addr: '317PfVH1ZwV5H9uwKjX3mjuTh5FByP1jhjjXMKH9KF1u' },
              { label: 'alice.sol', sub: 'Established \u2022 55', addr: 'Rb5RTuodu9VHMMVPhwXjMFTwqyDuwfH1ouZFqXTZXTsT' },
            ].map(item => (
              <TouchableOpacity
                key={item.addr}
                style={styles.suggestionItem}
                onPress={() => {
                  setQuery(item.label);
                  setSearchAddress(item.addr);
                }}
              >
                <Text style={styles.suggestionLabel}>{item.label}</Text>
                <Text style={styles.suggestionSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(loading || resolving) && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.ttPrimary} />
            <Text style={styles.loadingText}>
              {resolving ? 'Resolving domain...' : 'Loading profile...'}
            </Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {profile && <TrustProfileCard profile={profile} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontFamily: fonts.displayRegular,
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  clearButton: {
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 4,
  },
  clearButtonText: {
    color: colors.textSecondary,
    fontFamily: fonts.uiMedium,
    fontSize: 13,
  },
  infoBox: {
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.ttPrimary,
  },
  infoText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    color: colors.textPrimary,
    fontFamily: fonts.ui,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: colors.ttPrimary,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: colors.bgBase,
    fontFamily: fonts.uiSemiBold,
    fontSize: 14,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: 'rgba(192, 57, 43, 0.1)',
    borderRadius: 8,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: 14,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsTitle: {
    color: colors.textMuted,
    fontFamily: fonts.uiSemiBold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  suggestionLabel: {
    color: colors.textPrimary,
    fontFamily: fonts.uiMedium,
    fontSize: 15,
  },
  suggestionSub: {
    color: colors.textMuted,
    fontFamily: fonts.mono,
    fontSize: 12,
  },
});
