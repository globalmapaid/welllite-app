import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db } from '@/db';
import { pendingWells, pendingReadings } from '@/db/schema';
import DropdownField from '@/components/molecules/DropdownField';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { colors, dimensions } from '@/components/theme';
import { getWellById, createWell, submitWellChange } from '@/lib/api/wells';
import { createReading } from '@/lib/api/readings';
import { useNetwork } from '@/lib/network';
import { generateUuid } from '@/lib/uuid';
import { useT } from '@/lib/i18n';

// Form state (confirmedWellHere/wellType/wellStatus) stores stable slugs —
// 'yes'|'no', 'borehole'|'hand_dug'|'spring', 'working'|'broken' — that
// double as the API's values, independent of the display language.
// 'Oasis' is intentionally not offered — the translator merged it into
// 'Spring'.

type FormState = {
  confirmedWellHere: string;
  wellName: string;
  wellType: string;
  wellStatus: string;
  dailyUsersEstimate: string;
  distanceToWaterKm: string;
  comments: string;
  staticWaterLevel: string;
  wellDiameterCm: string;
};

// Distance-to-water needs to accept up to 3 decimal places (per spreadsheet
// dev note); truncate rather than reject so typing never feels blocked.
function formatDecimal3(value: string): string {
  const [whole, decimal] = value.split('.');
  if (decimal === undefined) return whole;
  return `${whole}.${decimal.slice(0, 3)}`;
}

const emptyForm: FormState = {
  confirmedWellHere: '',
  wellName: '',
  wellType: '',
  wellStatus: '',
  dailyUsersEstimate: '',
  distanceToWaterKm: '',
  comments: '',
  staticWaterLevel: '',
  wellDiameterCm: '',
};

function LabeledInput({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  info,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (v: string) => void;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
  info?: string | string[];
}) {
  const t = useT();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);

  return (
    <View style={styles.fieldGroup}>
      {info && tooltipVisible && (
        <View>
          <View style={styles.tooltip}>
            {Array.isArray(info)
              ? info.map((line, i) => (
                  <View key={i} style={styles.tooltipBulletRow}>
                    <Text style={styles.tooltipBullet}>{'•'}</Text>
                    <Text style={styles.tooltipText}>{line}</Text>
                  </View>
                ))
              : <Text style={styles.tooltipText}>{info}</Text>
            }
            <TouchableOpacity onPress={() => setTooltipVisible(false)}>
              <Text style={styles.tooltipDismiss}>{t('gotIt')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.tooltipArrow, { marginLeft: labelWidth + 5 }]} />
        </View>
      )}
      <View style={styles.labelRow}>
        <Text style={styles.label} onLayout={(e) => setLabelWidth(e.nativeEvent.layout.width)}>{label}</Text>
        {info ? (
          <TouchableOpacity
            onPress={() => setTooltipVisible((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="information-circle-outline" size={18} color={colors.placeholder} style={styles.infoIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function PhotoSlot({
  uri,
  onPress,
  onRemove,
}: {
  uri: string | null;
  onPress: () => void;
  onRemove: () => void;
}) {
  return (
    <TouchableOpacity style={styles.photoSlot} onPress={uri ? undefined : onPress} activeOpacity={0.7}>
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.photoImage} />
          <TouchableOpacity style={styles.photoRemove} onPress={onRemove}>
            <Ionicons name="close" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      ) : (
        <Ionicons name="camera-outline" size={28} color={colors.placeholder} />
      )}
    </TouchableOpacity>
  );
}

export default function EnterWellDataScreen() {
  const { wellId } = useLocalSearchParams<{ wellId?: string }>();
  const isEditMode = !!wellId;
  const { isConnected } = useNetwork();
  const t = useT();

  const CONFIRM_OPTIONS = [
    { label: t('confirmYes'), value: 'yes' },
    { label: t('confirmNo'), value: 'no' },
  ];
  const WELL_TYPE_OPTIONS = [
    { label: t('wellTypeBorehole'), value: 'borehole' },
    { label: t('wellTypeHandDug'), value: 'hand_dug' },
    { label: t('wellTypeSpring'), value: 'spring' },
  ];
  const WELL_STATUS_OPTIONS = [
    { label: t('wellStatusWorking'), value: 'working' },
    { label: t('wellStatusBroken'), value: 'broken' },
  ];

  const [form, setForm] = useState<FormState>(emptyForm);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [saving, setSaving] = useState(false);
  const [loadingWell, setLoadingWell] = useState(isEditMode);
  const [openField, setOpenField] = useState<keyof FormState | null>(null);

  useEffect(() => {
    if (!wellId) return;
    (async () => {
      try {
        const well = await getWellById(wellId);
        setForm({
          confirmedWellHere: well.well_confirmed ? 'yes' : 'no',
          wellName: well.name ?? '',
          wellType: well.well_type ?? '',
          wellStatus: well.well_status ?? '',
          dailyUsersEstimate: well.daily_users_estimate?.toString() ?? '',
          distanceToWaterKm: well.distance_to_other_water_km ?? '',
          comments: well.comments ?? '',
          staticWaterLevel: '',
          wellDiameterCm: well.opening_diameter_cm ?? '',
        });
      } catch {
        Alert.alert('Error', 'Failed to load well details.');
        router.back();
      } finally {
        setLoadingWell(false);
      }
    })();
  }, [wellId]);

  function setField(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleField(field: keyof FormState) {
    setOpenField((f) => (f === field ? null : field));
  }

  function selectOption(field: keyof FormState, value: string) {
    setField(field, value);
    setOpenField(null);
  }

  async function pickPhoto(index: number) {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to upload photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotos((prev) => prev.map((p, i) => (i === index ? result.assets[0].uri : p)));
    }
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.map((p, i) => (i === index ? null : p)));
  }

  async function handleSave() {
    const required: [keyof FormState, string][] = [
      ['confirmedWellHere', 'Confirm a well is here'],
      ['wellName', 'Well name'],
      ['wellType', 'Well type'],
      ['wellStatus', 'Well working or broken'],
    ];
    for (const [field, label] of required) {
      if (!form[field].trim()) {
        Alert.alert('Missing field', `"${label}" is required.`);
        return;
      }
    }

    if (isEditMode && !isConnected) {
      Alert.alert('Offline', "You're offline. Connect to the internet to submit a well update.");
      return;
    }

    setSaving(true);
    let latitude: number | undefined;
    let longitude: number | undefined;
    let locationAccuracy: number | undefined;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
        locationAccuracy = loc.coords.accuracy ?? undefined;
      }
    } catch {
      // location failure does not block save
    }

    const wellUuid = generateUuid();
    const readingUuid = form.staticWaterLevel.trim() ? generateUuid() : undefined;

    if (isConnected) {
      try {
        const wellData = {
          client_uuid: wellUuid,
          latitude: latitude ?? 0,
          longitude: longitude ?? 0,
          well_confirmed: form.confirmedWellHere === 'yes',
          name: form.wellName.trim(),
          well_type: form.wellType,
          well_status: form.wellStatus,
          daily_users_estimate: form.dailyUsersEstimate ? parseInt(form.dailyUsersEstimate, 10) : undefined,
          distance_to_other_water_km: form.distanceToWaterKm ? parseFloat(form.distanceToWaterKm) : undefined,
          opening_diameter_cm: form.wellDiameterCm ? parseFloat(form.wellDiameterCm) : undefined,
          comments: form.comments.trim() || undefined,
        };

        let savedWellId: string;
        if (isEditMode) {
          await submitWellChange(wellId, wellData);
          savedWellId = wellId;
        } else {
          savedWellId = (await createWell(wellData)).id;
        }

        if (readingUuid) {
          await createReading({
            client_uuid: readingUuid,
            well_id: savedWellId,
            swl_metres: parseFloat(form.staticWaterLevel),
            measured_on: new Date().toISOString().slice(0, 10),
          });
        }

        Alert.alert(
          'Saved',
          isEditMode ? 'Well update submitted successfully.' : 'Well data saved successfully.',
          [{ text: 'OK', onPress: () => router.back() }],
        );
      } catch (err) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Failed to save. Please try again.';
        Alert.alert('Error', message);
      } finally {
        setSaving(false);
      }
      return;
    }

    try {
      const [insertedWell] = await db
        .insert(pendingWells)
        .values({
          clientUuid: wellUuid,
          createdAt: new Date(),
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          wellConfirmed: form.confirmedWellHere === 'yes',
          name: form.wellName.trim(),
          wellType: form.wellType,
          wellStatus: form.wellStatus,
          dailyUsersEstimate: form.dailyUsersEstimate ? parseInt(form.dailyUsersEstimate, 10) : null,
          distanceToOtherWaterKm: form.distanceToWaterKm ? parseFloat(form.distanceToWaterKm) : null,
          openingDiameterCm: form.wellDiameterCm ? parseFloat(form.wellDiameterCm) : null,
          comments: form.comments.trim() || null,
          photoUris: JSON.stringify(photos.filter(Boolean)),
        })
        .returning({ id: pendingWells.id });

      if (readingUuid) {
        await db.insert(pendingReadings).values({
          clientUuid: readingUuid,
          wellClientUuid: wellUuid,
          createdAt: new Date(),
          localWellId: insertedWell.id,
          swlMetres: parseFloat(form.staticWaterLevel),
          measuredOn: new Date().toISOString().slice(0, 10),
        });
      }

      Alert.alert(
        'Saved locally',
        "This well was saved on your device and will sync automatically once you're back online and signed in.",
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Stack.Screen options={{ title: isEditMode ? 'Update well data' : t('enterWellData') }} />

      {loadingWell ? (
        <View style={[styles.flex, styles.loadingWrap]}>
          <ActivityIndicator size="large" color={colors.text} />
        </View>
      ) : (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.subtitleBlock}>
            <Text style={styles.subtitleMain}>{t('completeDataEntry')}</Text>
            <Text style={styles.subtitleSub}>{t('getHelpFromLocalUsers')}</Text>
          </View>

          <DropdownField
            label={t('confirmWellIsHere')}
            value={form.confirmedWellHere}
            placeholder={t('select')}
            options={CONFIRM_OPTIONS}
            isOpen={openField === 'confirmedWellHere'}
            onToggle={() => toggleField('confirmedWellHere')}
            onSelect={(v) => selectOption('confirmedWellHere', v)}
          />

          <LabeledInput
            label={t('wellName')}
            value={form.wellName}
            placeholder={t('enterWellName')}
            onChangeText={(v) => setField('wellName', v)}
          />

          <DropdownField
            label={t('wellType')}
            value={form.wellType}
            placeholder={t('select')}
            options={WELL_TYPE_OPTIONS}
            isOpen={openField === 'wellType'}
            onToggle={() => toggleField('wellType')}
            onSelect={(v) => selectOption('wellType', v)}
          />

          <DropdownField
            label={t('wellWorkingOrBroken')}
            value={form.wellStatus}
            placeholder={t('select')}
            options={WELL_STATUS_OPTIONS}
            isOpen={openField === 'wellStatus'}
            onToggle={() => toggleField('wellStatus')}
            onSelect={(v) => selectOption('wellStatus', v)}
          />

          <LabeledInput
            label={t('dailyUseEstimate')}
            value={form.dailyUsersEstimate}
            placeholder={t('enterEstimate')}
            onChangeText={(v) => setField('dailyUsersEstimate', v)}
            keyboardType="numeric"
          />

          <LabeledInput
            label={t('distanceToWater')}
            value={form.distanceToWaterKm}
            placeholder={t('enterDistance')}
            onChangeText={(v) => setField('distanceToWaterKm', formatDecimal3(v))}
            keyboardType="decimal-pad"
            info={t('distanceInfoTooltip')}
          />

          <LabeledInput
            label={t('comments')}
            value={form.comments}
            placeholder={t('commentsPlaceholder')}
            onChangeText={(v) => setField('comments', v)}
            multiline
            info={[
              t('commentsInfoStory'),
              t('commentsInfoMaintenance'),
              t('commentsInfoBroken'),
              t('commentsInfoVillageTaps'),
              t('commentsInfoNetwork'),
              t('commentsInfoAge'),
              t('commentsInfoMadeBy'),
              t('commentsInfoOther'),
            ]}
          />

          <Text style={styles.sectionHeader}>{t('uploadPhotos')}</Text>
          <View style={styles.photoRow}>
            {photos.map((uri, i) => (
              <PhotoSlot
                key={i}
                uri={uri}
                onPress={() => pickPhoto(i)}
                onRemove={() => removePhoto(i)}
              />
            ))}
          </View>

          <Text style={styles.sectionHeader}>{t('optional')}</Text>

          <LabeledInput
            label={t('staticWaterLevel')}
            value={form.staticWaterLevel}
            placeholder={t('enterStaticWaterLevel')}
            onChangeText={(v) => setField('staticWaterLevel', v)}
            keyboardType="decimal-pad"
            info={t('staticWaterLevelInfo')}
          />

          <LabeledInput
            label={t('diameterOfWellOpening')}
            value={form.wellDiameterCm}
            placeholder={t('enterWellDiameter')}
            onChangeText={(v) => setField('wellDiameterCm', v)}
            keyboardType="decimal-pad"
          />

          <PrimaryButton
            label={saving ? 'Saving…' : t('saveClose')}
            onPress={handleSave}
            disabled={saving}
            loading={saving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  loadingWrap: { alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: dimensions.paddingH, paddingBottom: 40 },

  subtitleBlock: { alignItems: 'center', marginTop: 24, marginBottom: 24 },
  subtitleMain: { fontSize: 16, fontWeight: '700', color: colors.text },
  subtitleSub: { fontSize: 14, color: colors.placeholder, marginTop: 2 },

  fieldGroup: { marginTop: 16 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  label: { fontSize: 14, color: colors.text, fontWeight: '500', marginBottom: 10 },
  infoIcon: { marginLeft: 4 },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: dimensions.radius,
    height: dimensions.inputHeight,
    paddingHorizontal: 20,
    fontSize: 15,
    color: colors.text,
  },
  inputMultiline: {
    height: dimensions.multilineHeight,
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: dimensions.multilineRadius,
  },

  tooltip: {
    backgroundColor: colors.text,
    borderRadius: 12,
    padding: 16,
  },
  tooltipText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  tooltipBulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tooltipBullet: {
    color: colors.white,
    fontSize: 15,
    marginRight: 8,
    lineHeight: 22,
  },
  tooltipDismiss: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginTop: 12,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.text,
    marginBottom: 6,
  },

  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginTop: 32,
    marginBottom: 12,
  },

  photoRow: { flexDirection: 'row', gap: 12 },
  photoSlot: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: colors.inputBg,
    borderWidth: 1.5,
    borderColor: colors.placeholder,
    borderStyle: 'dashed',
    borderRadius: Platform.OS === 'ios' ? 12 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoImage: { width: '100%', height: '100%' },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButton: { marginTop: 36 },
});
