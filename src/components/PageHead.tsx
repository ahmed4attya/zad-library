import { Icon, type IconName } from './Icon';

export function PageHead({ title, sub, icon }: { title: string; sub?: string; icon: IconName }) {
  return (
    <div className="card-box flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-[22px] font-extrabold leading-snug">{title}</h1>
        {sub && <p className="text-sm text-mut">{sub}</p>}
      </div>
      <span className="grid h-14 w-14 flex-none place-items-center rounded-2xl bg-brand-700 text-white">
        <Icon name={icon} className="h-8 w-8" />
      </span>
    </div>
  );
}
