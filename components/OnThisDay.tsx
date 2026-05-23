import { getOnThisDayItems, type TodayItem, type ItemType } from '@/lib/onThisDay';

function countryFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join('');
}

function truncate(text: string, max: number): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
}

function ItemBadge({ item }: { item: TodayItem }) {
  const base: React.CSSProperties = {
    flexShrink: 0,
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (item.type === 'observance') {
    return (
      <div style={{
        ...base,
        background: 'rgba(246,198,106,0.12)',
        border: '1px solid rgba(246,198,106,0.22)',
      }}>
        <span style={{ fontSize: 18, lineHeight: 1 }}>★</span>
      </div>
    );
  }

  return (
    <div style={{
      ...base,
      background: 'rgba(127,167,232,0.10)',
      border: '1px solid rgba(127,167,232,0.18)',
      fontSize: 22,
    }}>
      {item.countryCode ? countryFlag(item.countryCode) : '🌍'}
    </div>
  );
}

function ItemTag({ type, country }: { type: ItemType; country?: string }) {
  if (type === 'observance') {
    return (
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--accent-gold)',
        fontFamily: 'Inter, sans-serif',
        display: 'block',
        marginBottom: 3,
      }}>
        Observance
      </span>
    );
  }
  if (type === 'national-holiday' && country) {
    return (
      <span style={{
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--accent-blue)',
        fontFamily: 'Inter, sans-serif',
        display: 'block',
        marginBottom: 3,
      }}>
        {country}
      </span>
    );
  }
  return null;
}

interface OnThisDayProps {
  month: number;
  day: number;
  year: number;
  userCountryCode?: string;
}

export default async function OnThisDay({ month, day, year, userCountryCode }: OnThisDayProps) {
  const items = await getOnThisDayItems(month, day, year, userCountryCode);
  if (items.length === 0) return null;

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(180deg, rgba(21,36,61,0.78), rgba(10,23,42,0.78))',
    border: '1px solid var(--border-card)',
    borderRadius: 'var(--radius-card)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.22)',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    padding: '20px 22px',
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-faint)',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
        }}>
          Holidays Today
        </p>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              paddingTop: i === 0 ? 0 : 14,
              paddingBottom: i === items.length - 1 ? 0 : 14,
              borderBottom: i < items.length - 1 ? '1px solid var(--divider)' : 'none',
            }}
          >
            <ItemBadge item={item} />
            <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
              <ItemTag type={item.type} country={item.country} />
              <p style={{
                fontSize: 14,
                lineHeight: 1.45,
                color: 'var(--text-secondary)',
                fontFamily: 'Inter, sans-serif',
                margin: 0,
              }}>
                {truncate(item.text, 140)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
