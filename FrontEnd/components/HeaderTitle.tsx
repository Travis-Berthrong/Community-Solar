import React from "react";
import { View, Platform, StyleSheet, Text } from "react-native";

export function HeaderTitle({ headerText }: { readonly headerText?: string }) {
  return (
    <View style={[
      styles.headerContainer,
      Platform.OS === 'ios' ? { marginBottom: 10 } : null
    ]}>
      <Text style={styles.headerText}>
        {headerText ?? 'COMMUNITY SOLAR'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#2E7D32',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    paddingVertical: Platform.OS === 'ios' ? 12 : 0,
    width: '100%',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    ...Platform.select({
      ios: {
        paddingBottom: 15,
        paddingTop: 5,
      },
      android: {
        paddingVertical: 0,
      },
    }),
  },
});