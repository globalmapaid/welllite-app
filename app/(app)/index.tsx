import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { Map, Camera, Marker } from '@maplibre/maplibre-react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { colors } from '@/components/theme';
import { searchWells, type Well, type WellSearchBounds } from '@/lib/api/wells';
import { useNetwork } from '@/lib/network';
import { loadWellsCache, saveWellsCache } from '@/lib/wellsCache';

const OPENFREEMAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/bright';

const DEFAULT_ZOOM = 13;
// Caps how far out the map can zoom so a single viewport can never plausibly
// cover the whole tenant's wells — that would defeat viewport-scoped fetching.
const MIN_ZOOM = 10;
const REGION_CHANGE_DEBOUNCE_MS = 400;

const userLocationIcon = require('@/assets/shapes/user-location-circle.png');
const wellSquareIcon = require('@/assets/shapes/well-square.png');
const wellSurveyedTriangleIcon = require('@/assets/shapes/well-surveyed-triangle.png');

const LEGEND_ITEMS = [
  { icon: userLocationIcon, label: 'Red Circle:', description: 'Your location' },
  { icon: wellSquareIcon, label: 'Black Squares:', description: 'Wells location' },
  { icon: wellSurveyedTriangleIcon, label: 'Blue Triangles:', description: 'Wells already surveyed' },
];

export default function MapScreen() {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [localName, setLocalName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [wells, setWells] = useState<Well[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [selectedWell, setSelectedWell] = useState<Well | null>(null);
  const { isConnected } = useNetwork();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Allow WellLite to use your location to show it on the map.');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });

        try {
          const [place] = await Location.reverseGeocodeAsync({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
          const name = place && (place.city || place.subregion || place.region);
          setLocalName(name ?? 'Unknown location');
        } catch {
          setLocalName('Unknown location');
        }
      } catch {
        Alert.alert('Error', 'Failed to get your location. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchWellsInBounds = useCallback(
    (bounds: WellSearchBounds) => {
      if (!isConnected) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      (async () => {
        try {
          const result = await searchWells(bounds, { signal: controller.signal });
          setWells(result.items);
          setTruncated(result.truncated);
          saveWellsCache(result.items);
        } catch (error) {
          if (controller.signal.aborted) return;
          console.log('[Map] Failed to fetch wells:', error);
        }
      })();
    },
    [isConnected],
  );

  const handleRegionDidChange = useCallback(
    (bounds: WellSearchBounds) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => fetchWellsInBounds(bounds), REGION_CHANGE_DEBOUNCE_MS);
    },
    [fetchWellsInBounds],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (isConnected !== false) return;
    loadWellsCache().then((cached) => {
      if (cached.length === 0) return;
      setWells((prev) => (prev.length > 0 ? prev : cached));
    });
  }, [isConnected]);

  const lngLat: [number, number] | undefined = coords
    ? [coords.longitude, coords.latitude]
    : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Here is your location</Text>

          <View style={styles.legend}>
            {LEGEND_ITEMS.map((item) => (
              <View key={item.label} style={styles.legendRow}>
                <Image source={item.icon} style={styles.legendIcon} resizeMode="contain" />
                <Text style={styles.legendText}>
                  <Text style={styles.legendLabel}>{item.label}</Text> {item.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.mapWrap}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.text} />
          ) : (
            <Map
              style={StyleSheet.absoluteFill}
              mapStyle={OPENFREEMAP_STYLE_URL}
              onRegionDidChange={(event) => {
                const [west, south, east, north] = event.nativeEvent.bounds;
                handleRegionDidChange({ minLat: south, minLon: west, maxLat: north, maxLon: east });
              }}
            >
              <Camera center={lngLat} zoom={DEFAULT_ZOOM} minZoom={MIN_ZOOM} />
              {wells.map((well) => (
                <Marker
                  key={well.id}
                  id={well.id}
                  lngLat={[well.longitude, well.latitude]}
                  onPress={() => setSelectedWell(well)}
                >
                  <Image
                    source={well.review_status === 'approved' ? wellSurveyedTriangleIcon : wellSquareIcon}
                    style={styles.markerIcon}
                    resizeMode="contain"
                  />
                </Marker>
              ))}
              {lngLat && (
                <Marker id="user-location" lngLat={lngLat}>
                  <View style={styles.userLocationHalo}>
                    <Image source={userLocationIcon} style={styles.markerIcon} resizeMode="contain" />
                  </View>
                </Marker>
              )}
            </Map>
          )}
          {truncated && (
            <View style={styles.truncatedBanner}>
              <Text style={styles.truncatedBannerText}>Zoom in to see all wells in this area</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.infoHeading}>Your current location at red circle</Text>
          <Text style={styles.infoLine}>
            Latitude: {coords ? `${coords.latitude.toFixed(3)}° North` : '—'}
            {'   '}
            Longitude: {coords ? `${coords.longitude.toFixed(3)}° East` : '—'}
          </Text>
          <Text style={styles.infoLine}>
            Projection: WGS 84{'   '}Local name: {localName ?? '—'}
          </Text>

          <View style={styles.buttons}>
            <PrimaryButton
              label="Data for a well not on the map"
              onPress={() => router.push('/enter-well-data')}
              style={styles.compactButton}
            />
          </View>
        </View>
      </View>

      <Modal
        transparent
        animationType="fade"
        visible={!!selectedWell}
        onRequestClose={() => setSelectedWell(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedWell(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>{selectedWell?.name ?? 'Unconfirmed well'}</Text>

            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Latitude</Text>
              <Text style={styles.modalValue}>{selectedWell?.latitude.toFixed(6)}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Longitude</Text>
              <Text style={styles.modalValue}>{selectedWell?.longitude.toFixed(6)}</Text>
            </View>
            <View style={styles.modalRow}>
              <Text style={styles.modalLabel}>Status</Text>
              <Text style={styles.modalValue}>{selectedWell?.well_status ?? '—'}</Text>
            </View>

            <PrimaryButton
              label="Update well details"
              onPress={() => {
                router.push({ pathname: '/enter-well-data', params: { wellId: selectedWell!.id } });
                setSelectedWell(null);
              }}
              style={styles.modalButton}
            />

            <Text style={styles.modalClose} onPress={() => setSelectedWell(null)}>
              Close
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: 20 },
  header: { flexShrink: 0 },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 8 },
  legend: { marginTop: 8, gap: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  legendIcon: { width: 14, height: 14 },
  legendLabel: { fontWeight: '700', color: colors.text },
  legendText: { fontSize: 12, color: colors.text },
  mapWrap: {
    flex: 1,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.inputBg,
  },
  markerIcon: { width: 24, height: 24 },
  userLocationHalo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 59, 48, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  truncatedBanner: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  truncatedBannerText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  footer: { flexShrink: 0, paddingTop: 10, paddingBottom: 8 },
  infoHeading: { fontSize: 13, fontWeight: '700', color: colors.text },
  infoLine: { fontSize: 12, color: colors.text, marginTop: 2 },
  buttons: { marginTop: 10, gap: 8 },
  compactButton: { height: 44 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.bg,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: 12 },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  modalValue: { fontSize: 13, color: colors.text },
  modalButton: { marginTop: 18, height: 44 },
  modalClose: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
});
