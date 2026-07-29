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
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { db } from '@/db';
import { wellSubmissions } from '@/db/schema';
import DropdownField from '@/components/molecules/DropdownField';
import PrimaryButton from '@/components/atoms/PrimaryButton';
import { colors, dimensions } from '@/components/theme';

const CONFIRM_OPTIONS = ['Yes', 'No'];
const WELL_TYPE_OPTIONS = ['Borehole', 'Hand dug', 'Spring', 'Oasis'];
const WELL_STATUS_OPTIONS = ['Working', 'Broken'];

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
              <Text style={styles.tooltipDismiss}>Got it</Text>
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
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null]);
  const [saving, setSaving] = useState(false);
  const [openField, setOpenField] = useState<keyof FormState | null>(null);

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

    try {
      await db.insert(wellSubmissions).values({
        createdAt: new Date(),
        confirmedWellHere: form.confirmedWellHere,
        wellName: form.wellName.trim(),
        wellType: form.wellType,
        wellStatus: form.wellStatus,
        dailyUsersEstimate: form.dailyUsersEstimate ? parseInt(form.dailyUsersEstimate, 10) : null,
        distanceToWaterKm: form.distanceToWaterKm ? parseFloat(form.distanceToWaterKm) : null,
        comments: form.comments.trim() || null,
        photoUris: JSON.stringify(photos.filter(Boolean)),
        staticWaterLevel: form.staticWaterLevel ? parseFloat(form.staticWaterLevel) : null,
        wellDiameterCm: form.wellDiameterCm ? parseFloat(form.wellDiameterCm) : null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        locationAccuracy: locationAccuracy ?? null,
      });
      Alert.alert('Saved', 'Well data saved successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Enter well data</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="person-circle-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerSeparator} />

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
            <Text style={styles.subtitleMain}>Complete the data entry</Text>
            <Text style={styles.subtitleSub}>Get help from local users</Text>
          </View>

          <DropdownField
            label="Confirm a well is here"
            value={form.confirmedWellHere}
            placeholder="Select"
            options={CONFIRM_OPTIONS}
            isOpen={openField === 'confirmedWellHere'}
            onToggle={() => toggleField('confirmedWellHere')}
            onSelect={(v) => selectOption('confirmedWellHere', v)}
          />

          <LabeledInput
            label="Well name"
            value={form.wellName}
            placeholder="Enter well name"
            onChangeText={(v) => setField('wellName', v)}
          />

          <DropdownField
            label="Well type"
            value={form.wellType}
            placeholder="Select"
            options={WELL_TYPE_OPTIONS}
            isOpen={openField === 'wellType'}
            onToggle={() => toggleField('wellType')}
            onSelect={(v) => selectOption('wellType', v)}
          />

          <DropdownField
            label="Well working or broken"
            value={form.wellStatus}
            placeholder="Select"
            options={WELL_STATUS_OPTIONS}
            isOpen={openField === 'wellStatus'}
            onToggle={() => toggleField('wellStatus')}
            onSelect={(v) => selectOption('wellStatus', v)}
          />

          <LabeledInput
            label="No. people daily use estimate"
            value={form.dailyUsersEstimate}
            placeholder="Enter estimate"
            onChangeText={(v) => setField('dailyUsersEstimate', v)}
            keyboardType="numeric"
          />

          <LabeledInput
            label="Distance to other water (Km)"
            value={form.distanceToWaterKm}
            placeholder="Enter distance"
            onChangeText={(v) => setField('distanceToWaterKm', v)}
            keyboardType="decimal-pad"
            info="Important to know if the well is broken, and please explain more in Comments."
          />

          <LabeledInput
            label="Comments"
            value={form.comments}
            placeholder="About the well, is there a story?"
            onChangeText={(v) => setField('comments', v)}
            multiline
            info={[
              'Write the short story of the well.',
              'If the well is working, how do the users manage the maintenance ?',
              'If the well is broken, how do the users explain this ?',
              'Does is feed one or more village taps ?',
              'Is it piped to buidlings in a network ?',
              'How old is the well ?',
              'Who originally made it ?',
              'Anything of interest, please write here.',
            ]}
          />

          <Text style={styles.sectionHeader}>Upload photos</Text>
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

          <Text style={styles.sectionHeader}>Optional</Text>

          <LabeledInput
            label="Static water level"
            value={form.staticWaterLevel}
            placeholder="Enter static water level"
            onChangeText={(v) => setField('staticWaterLevel', v)}
            keyboardType="decimal-pad"
            info="This is depth in meters from the ground surface to the water level in the well."
          />

          <LabeledInput
            label="Diameter of well opening (cms)"
            value={form.wellDiameterCm}
            placeholder="Enter well diameter"
            onChangeText={(v) => setField('wellDiameterCm', v)}
            keyboardType="decimal-pad"
          />

          <PrimaryButton
            label={saving ? 'Saving…' : 'Save & Close'}
            onPress={handleSave}
            disabled={saving}
            loading={saving}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: dimensions.paddingH, paddingBottom: 40 },

  header: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: dimensions.paddingH,
    backgroundColor: colors.bg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  profileButton: {
    position: 'absolute',
    right: dimensions.paddingH,
    top: 8,
  },
  headerSeparator: {
    height: 1,
    backgroundColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },

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
