'use client';

import { useEffect, useState } from 'react';
import { Compass, MapPin, Navigation, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import { useLib } from '@/lib/library-context';
import { calculateQibla } from '@/lib/prayer-service';

export function QiblaCompassView() {
  const { city, detectLocation } = useLib();
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [hasCompassSensor, setHasCompassSensor] = useState(false);
  const [manualHeading, setManualHeading] = useState(0);

  const { bearing, distanceKm } = calculateQibla(city.lat, city.lng);

  // Effective device heading (sensor or manual)
  const currentHeading = deviceHeading !== null ? deviceHeading : manualHeading;

  // The angle to rotate the needle to point to Qibla relative to top of device screen
  const qiblaRelativeAngle = (bearing - currentHeading + 360) % 360;

  // Is pointing directly towards Kaaba within +/- 4 degrees?
  const isAligned = Math.abs(qiblaRelativeAngle) < 4 || Math.abs(qiblaRelativeAngle - 360) < 4;

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let heading: number | null = null;

      // iOS Safari provides webkitCompassHeading (0 = true north)
      const webkitEvent = e as unknown as { webkitCompassHeading?: number };
      if (typeof webkitEvent.webkitCompassHeading === 'number') {
        heading = webkitEvent.webkitCompassHeading;
        setHasCompassSensor(true);
      } else if (e.alpha !== null) {
        // Standard alpha (0 to 360 counter-clockwise)
        heading = (360 - e.alpha) % 360;
        setHasCompassSensor(true);
      }

      if (heading !== null) {
        setDeviceHeading(Math.round(heading));
      }
    };

    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const requestCompassPermission = async () => {
    // iOS 13+ requires explicit permission request
    const deviceOrientation = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    if (typeof deviceOrientation.requestPermission === 'function') {
      try {
        const response = await deviceOrientation.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
        } else {
          setPermissionGranted(false);
        }
      } catch {
        setPermissionGranted(false);
      }
    } else {
      setPermissionGranted(true);
    }
  };

  return (
    <div className="wrap space-y-6 pt-4">
      {/* City & Distance Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-pri">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-ink">اتجاه القبلة الشريفة</h2>
              <span className="text-xs text-mut">({city.name})</span>
            </div>
            <p className="text-xs text-mut">
              زاوية القبلة: <span className="font-bold text-pri">{Math.round(bearing)}°</span> من الشمال • المسافة إلى الكعبة: <span className="font-bold text-gold-700">{distanceKm.toLocaleString('ar-EG')} كم</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={detectLocation}
          className="btn gap-1.5 text-xs font-semibold hover:border-gold hover:text-pri"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span>تحديد موقعي بدقة</span>
        </button>
      </div>

      {/* Main Luxury Compass Dial Card */}
      <div className="relative overflow-hidden rounded-[32px] border border-gold/40 bg-gradient-to-b from-brand-900 via-brand-800 to-black p-6 text-white shadow-2xl md:p-10">
        <div className="pointer-events-none absolute -top-16 -end-16 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -start-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Status Badge */}
          <div
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              isAligned
                ? 'bg-amber-400 text-brand-950 shadow-lg shadow-amber-400/30 ring-4 ring-amber-400/20'
                : 'border border-white/20 bg-white/10 text-white/90 backdrop-blur'
            }`}
          >
            {isAligned ? (
              <>
                <Sparkles className="h-4 w-4" />
                <span>أنت الآن في اتجاه القبلة تماماً!</span>
              </>
            ) : (
              <>
                <Compass className="h-4 w-4 text-gold" />
                <span>قم بتدوير الهاتف حتى تتطابق الإبرة مع الكعبة</span>
              </>
            )}
          </div>

          {/* Compass Graphic */}
          <div className="relative my-8 h-72 w-72 select-none sm:h-80 sm:w-80">
            {/* Outer Glowing Ring */}
            <div
              className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${
                isAligned ? 'border-amber-400 shadow-[0_0_35px_rgba(251,191,36,0.5)]' : 'border-gold/30'
              }`}
            />

            {/* Dial background with tick marks */}
            <div
              className="absolute inset-2 rounded-full border border-white/10 bg-brand-950/80 transition-transform duration-300 ease-out"
              style={{
                transform: `rotate(${-currentHeading}deg)`,
              }}
            >
              {/* Cardinal directions */}
              <span className="absolute top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-400">ش (N)</span>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-bold text-white/60">ج (S)</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/60">ق (E)</span>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/60">غ (W)</span>

              {/* Angle Tick Marks */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <div
                  key={deg}
                  className="absolute left-1/2 top-1/2 h-full w-0.5 -translate-x-1/2 -translate-y-1/2"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className="h-2 w-0.5 bg-white/20" />
                </div>
              ))}

              {/* Kaaba Direction Marker on the dial */}
              <div
                className="absolute left-1/2 top-1/2 h-full w-4 -translate-x-1/2 -translate-y-1/2"
                style={{ transform: `rotate(${bearing}deg)` }}
              >
                <div className="absolute top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="h-6 w-6 rounded-md bg-stone-900 border-2 border-gold flex items-center justify-center shadow-lg">
                    <span className="text-[9px] font-bold text-gold">🕋</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Needle Pivot Center */}
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${qiblaRelativeAngle}deg)` }}
            >
              <div className="flex h-52 w-8 flex-col items-center justify-between">
                {/* North/Qibla Pointer Needle */}
                <div className="flex flex-col items-center">
                  <div className="h-0 w-0 border-x-8 border-b-[36px] border-x-transparent border-b-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  <span className="text-[10px] font-bold text-amber-300 mt-1">القبلة</span>
                </div>
                {/* Needle Tail */}
                <div className="h-0 w-0 border-x-6 border-t-[28px] border-x-transparent border-t-white/30" />
              </div>
            </div>

            {/* Center Cap */}
            <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-brand-800 shadow-md flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-full bg-gold" />
            </div>
          </div>

          {/* Heading Readout */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-center mt-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-[11px] text-white/60">اتجاه القبلة</span>
              <p className="font-mono text-base font-bold text-gold">{Math.round(bearing)}°</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
              <span className="text-[11px] text-white/60">اتجاه جهازك الحالي</span>
              <p className="font-mono text-base font-bold text-white">{currentHeading}°</p>
            </div>
          </div>

          {/* Fallback Manual Slider for desktop or when compass sensor is disabled */}
          {!hasCompassSensor && (
            <div className="mt-6 w-full max-w-sm rounded-2xl border border-white/15 bg-black/30 p-4 text-center">
              <p className="text-xs text-white/80">
                أجهزة الكمبيوتر أو المتصفحات دون مستشعر حركة: يمكنك محاكاة تدوير البوصلة يدويًا
              </p>
              <input
                type="range"
                min="0"
                max="360"
                value={manualHeading}
                onChange={(e) => setManualHeading(Number(e.target.value))}
                className="mt-3 w-full accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-white/50 mt-1">
                <span>0° (شمال)</span>
                <span>180° (جنوب)</span>
                <span>360°</span>
              </div>
            </div>
          )}

          {/* Sensor permission button for iOS */}
          {permissionGranted === false && (
            <button
              type="button"
              onClick={requestCompassPermission}
              className="mt-4 rounded-full bg-gold px-5 py-2 text-xs font-bold text-brand-900 shadow"
            >
              السماح باستخدام مستشعر البوصلة
            </button>
          )}
        </div>
      </div>

      {/* Calibration & Instructions Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <RotateCcw className="h-4 w-4 text-gold" />
            <span>طريقة معايرة البوصلة</span>
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-mut">
            للحصول على أعلى دقة، ابتعد عن الأجهزة الإلكترونية والمعادن، وحرك الهاتف في الهواء برسم الرقم (8) بالإنجليزي مرتين لمعايرة الحساس المغناطيسي الداخلي.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-card p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
            <ShieldCheck className="h-4 w-4 text-gold" />
            <span>حساب فلكي دقيق</span>
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-mut">
            يعتمد التطبيق على خوارزمية الدائرة العظمى الفلكية (Great Circle) المعتمدة لحساب زاوية القبلة الشريفة والمسافة الحقيقية بدقة من إحداثيات موقعك إلى الكعبة المشرفة في مكة المكرمة.
          </p>
        </div>
      </div>
    </div>
  );
}
