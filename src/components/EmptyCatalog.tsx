'use client';

import { Icon } from './Icon';
import { ImportButton } from './ImportButton';

export function EmptyCatalog() {
  return (
    <div className="card-box relative -mt-[52px]">
      <b>لم يتم العثور على فهرس المكتبة</b>
      <ol className="mt-2.5 list-decimal ps-5 text-mut">
        <li>شغّل السكربت scripts/catalog-builder.gs في Google Apps Script.</li>
        <li>نزّل الملف catalog.json من Drive وضعه في مجلد public.</li>
        <li>أو اضغط الزر أدناه واختر الملف مباشرة.</li>
      </ol>
      <ImportButton className="cta" label="تحميل ملف الفهرس">
        <Icon name="up" />
        تحميل ملف الفهرس
      </ImportButton>
    </div>
  );
}
