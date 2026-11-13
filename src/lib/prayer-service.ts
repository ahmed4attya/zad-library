import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  Madhab,
  Prayer,
  PrayerTimes,
  Qibla,
} from 'adhan';

export interface CityInfo {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  method?: string;
}

export interface PrayerEntry {
  key: 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
  name: string;
  time: Date;
  formatted: string;
  isPassed: boolean;
  isCurrent: boolean;
  isNext: boolean;
}

export interface AdditionalTimes {
  imsak: string;
  duha: string;
  midnight: string;
  lastThird: string;
}

export interface PrayerStatus {
  currentPrayer: PrayerEntry | null;
  nextPrayer: PrayerEntry | null;
  timeRemainingSeconds: number;
  progressPercent: number;
  entries: PrayerEntry[];
  additional: AdditionalTimes;
  dateStr: string;
  hijriStr: string;
  hijriDay: number;
  hijriMonth: number;
  hijriYear: number;
  hijriMonthName: string;
}

export const CALC_METHODS: { id: string; name: string }[] = [
  { id: 'UmmAlQura', name: 'جامعة أم القرى (مكة المكرمة)' },
  { id: 'Egyptian', name: 'الهيئة العامة المصرية للمساحة' },
  { id: 'MuslimWorldLeague', name: 'رابطة العالم الإسلامي' },
  { id: 'Karachi', name: 'جامعة العلوم الإسلامية بكراتشي' },
  { id: 'NorthAmerica', name: 'الجمعية الإسلامية لأمريكا الشمالية (ISNA)' },
  { id: 'Dubai', name: 'دائرة الشؤون الإسلامية (دبي)' },
  { id: 'Qatar', name: 'وزارة الأوقاف والشؤون الإسلامية (قطر)' },
  { id: 'Kuwait', name: 'وزارة الأوقاف (الكويت)' },
];

export function getCalculationParameters(methodId: string, madhab: 'shafi' | 'hanafi' = 'shafi'): CalculationParameters {
  let params: CalculationParameters;
  switch (methodId) {
    case 'Egyptian':
      params = CalculationMethod.Egyptian();
      break;
    case 'MuslimWorldLeague':
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case 'Karachi':
      params = CalculationMethod.Karachi();
      break;
    case 'NorthAmerica':
      params = CalculationMethod.NorthAmerica();
      break;
    case 'Dubai':
      params = CalculationMethod.Dubai();
      break;
    case 'Qatar':
      params = CalculationMethod.Qatar();
      break;
    case 'Kuwait':
      params = CalculationMethod.Kuwait();
      break;
    case 'UmmAlQura':
    default:
      params = CalculationMethod.UmmAlQura();
      break;
  }
  params.madhab = madhab === 'hanafi' ? Madhab.Hanafi : Madhab.Shafi;
  return params;
}

export function formatTimeArabic(d: Date): string {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const period = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${h}:${m} ${period}`;
}

export function formatTime24(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function getHijriDetails(date: Date = new Date(), offsetDays = 0): {
  formatted: string;
  day: number;
  month: number;
  year: number;
  monthName: string;
} {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() + offsetDays);

  const monthsArabic = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ];

  function toInt(val: string): number {
    const norm = val.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
    return parseInt(norm.replace(/[^0-9]/g, ''), 10) || 0;
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(adjusted);
    let day = 1;
    let month = 1;
    let year = 1448;

    for (const part of parts) {
      if (part.type === 'day') day = toInt(part.value) || 1;
      if (part.type === 'month') month = toInt(part.value) || 1;
      if (part.type === 'year') year = toInt(part.value) || 1448;
    }

    const monthName = monthsArabic[(month - 1) % 12] || 'رمضان';
    const formatted = `${day} ${monthName} ${year} هـ`;

    return { formatted, day, month, year, monthName };
  } catch {
    return {
      formatted: `1448 هـ`,
      day: 1,
      month: 1,
      year: 1448,
      monthName: 'محرم',
    };
  }
}

export function calculatePrayerStatus(
  lat: number,
  lng: number,
  methodId = 'UmmAlQura',
  madhab: 'shafi' | 'hanafi' = 'shafi',
  hijriOffset = 0,
  now: Date = new Date()
): PrayerStatus {
  const coords = new Coordinates(lat, lng);
  const params = getCalculationParameters(methodId, madhab);
  const ptToday = new PrayerTimes(coords, now, params);

  // Tomorrow for after-isha transitions
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ptTomorrow = new PrayerTimes(coords, tomorrow, params);

  // Yesterday for pre-fajr transitions
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const ptYesterday = new PrayerTimes(coords, yesterday, params);

  const nowMs = now.getTime();

  const rawEntries: { key: PrayerEntry['key']; name: string; time: Date }[] = [
    { key: 'fajr', name: 'الفجر', time: ptToday.fajr },
    { key: 'sunrise', name: 'الشروق', time: ptToday.sunrise },
    { key: 'dhuhr', name: 'الظهر', time: ptToday.dhuhr },
    { key: 'asr', name: 'العصر', time: ptToday.asr },
    { key: 'maghrib', name: 'المغرب', time: ptToday.maghrib },
    { key: 'isha', name: 'العشاء', time: ptToday.isha },
  ];

  let nextIdx = rawEntries.findIndex((e) => e.time.getTime() > nowMs);
  let nextPrayerRaw: { key: PrayerEntry['key']; name: string; time: Date };
  let currentPrayerRaw: { key: PrayerEntry['key']; name: string; time: Date };

  if (nextIdx === -1) {
    // After Isha, next prayer is tomorrow Fajr
    nextPrayerRaw = { key: 'fajr', name: 'الفجر', time: ptTomorrow.fajr };
    currentPrayerRaw = rawEntries[rawEntries.length - 1];
  } else if (nextIdx === 0) {
    // Before Fajr, current is yesterday Isha
    nextPrayerRaw = rawEntries[0];
    currentPrayerRaw = { key: 'isha', name: 'العشاء', time: ptYesterday.isha };
  } else {
    nextPrayerRaw = rawEntries[nextIdx];
    currentPrayerRaw = rawEntries[nextIdx - 1];
  }

  const entries: PrayerEntry[] = rawEntries.map((e) => {
    const isPassed = e.time.getTime() <= nowMs;
    const isCurrent = currentPrayerRaw.key === e.key && (nextIdx !== 0 || e.key === 'isha');
    const isNext = nextPrayerRaw.key === e.key && nextIdx !== -1;
    return {
      key: e.key,
      name: e.name,
      time: e.time,
      formatted: formatTimeArabic(e.time),
      isPassed,
      isCurrent,
      isNext,
    };
  });

  const nextPrayer: PrayerEntry = {
    key: nextPrayerRaw.key,
    name: nextPrayerRaw.name,
    time: nextPrayerRaw.time,
    formatted: formatTimeArabic(nextPrayerRaw.time),
    isPassed: false,
    isCurrent: false,
    isNext: true,
  };

  const currentPrayer: PrayerEntry = {
    key: currentPrayerRaw.key,
    name: currentPrayerRaw.name,
    time: currentPrayerRaw.time,
    formatted: formatTimeArabic(currentPrayerRaw.time),
    isPassed: true,
    isCurrent: true,
    isNext: false,
  };

  const timeRemainingSeconds = Math.max(0, Math.floor((nextPrayerRaw.time.getTime() - nowMs) / 1000));

  const totalWindow = nextPrayerRaw.time.getTime() - currentPrayerRaw.time.getTime();
  const elapsed = nowMs - currentPrayerRaw.time.getTime();
  const progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / (totalWindow || 1)) * 100)));

  // Additional Islamic prayer related times
  // Imsak: 10 mins before Fajr
  const imsakDate = new Date(ptToday.fajr.getTime() - 10 * 60 * 1000);
  // Duha: ~15 mins after Sunrise
  const duhaDate = new Date(ptToday.sunrise.getTime() + 15 * 60 * 1000);
  // Midnight: halfway between sunset (Maghrib) and Fajr tomorrow
  const midnightMs = ptToday.maghrib.getTime() + (ptTomorrow.fajr.getTime() - ptToday.maghrib.getTime()) / 2;
  const midnightDate = new Date(midnightMs);
  // Last Third: last third of the night between Maghrib and Fajr
  const nightDuration = ptTomorrow.fajr.getTime() - ptToday.maghrib.getTime();
  const lastThirdDate = new Date(ptToday.maghrib.getTime() + (nightDuration * 2) / 3);

  const additional: AdditionalTimes = {
    imsak: formatTimeArabic(imsakDate),
    duha: formatTimeArabic(duhaDate),
    midnight: formatTimeArabic(midnightDate),
    lastThird: formatTimeArabic(lastThirdDate),
  };

  const hijri = getHijriDetails(now, hijriOffset);

  const gregorianFormatter = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const dateStr = gregorianFormatter.format(now);

  return {
    currentPrayer,
    nextPrayer,
    timeRemainingSeconds,
    progressPercent,
    entries,
    additional,
    dateStr,
    hijriStr: hijri.formatted,
    hijriDay: hijri.day,
    hijriMonth: hijri.month,
    hijriYear: hijri.year,
    hijriMonthName: hijri.monthName,
  };
}

export function calculateQibla(lat: number, lng: number): {
  bearing: number;
  distanceKm: number;
} {
  const coords = new Coordinates(lat, lng);
  const bearing = Qibla(coords);

  // Haversine formula to Kaaba (21.4225, 39.8262)
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  const R = 6371; // Earth radius in km

  const dLat = ((kaabaLat - lat) * Math.PI) / 180;
  const dLng = ((kaabaLng - lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat * Math.PI) / 180) *
      Math.cos((kaabaLat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return { bearing, distanceKm };
}
