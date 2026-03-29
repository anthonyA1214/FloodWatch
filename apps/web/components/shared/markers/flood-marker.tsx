import {
  REPORT_STATUS_COLOR_MAP,
  SEVERITY_COLOR_MAP,
} from '@/lib/utils/get-color-map';
import {
  IconAlertCircleFilled,
  IconAlertOctagonFilled,
  IconAlertTriangleFilled,
} from '@tabler/icons-react';

const SEVERITY_CONFIG = {
  critical: { icon: IconAlertOctagonFilled },
  high: { icon: IconAlertTriangleFilled },
  moderate: { icon: IconAlertCircleFilled },
  low: { icon: IconAlertCircleFilled },
};

export const FloodMarker = ({
  severity,
  status,
  isFocused,
}: {
  severity: 'critical' | 'high' | 'moderate' | 'low';
  status?: 'verified' | 'unverified' | 'resolved';
  isFocused?: boolean;
}) => {
  const { icon: Icon } = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.low;
  const color = SEVERITY_COLOR_MAP[severity] || SEVERITY_COLOR_MAP.low;
  const statusColor = status ? REPORT_STATUS_COLOR_MAP[status] : undefined;
  const size = 32;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {/* circle head */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: color,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // white halo ring when focused
          border: isFocused ? `3px solid white` : '2.5px solid white',
          outline: isFocused ? `3px solid ${color}` : 'none',
          boxShadow: `0 3px 12px ${color}45, 0 2px 4px rgba(0,0,0,0.2)`,
          zIndex: 2,
        }}
      >
        <Icon size={size * 0.55} stroke={1.8} />
        {statusColor && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: statusColor,
              border: '2px solid white',
              boxShadow: `0 1px 4px ${statusColor}80`,
              zIndex: 3,
            }}
          />
        )}
      </div>

      {/* tail */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size * 0.22}px solid transparent`,
          borderRight: `${size * 0.22}px solid transparent`,
          borderTop: `${size * 0.38}px solid ${color}`,
          marginTop: -1,
          zIndex: 2,
        }}
      />

      {/* ground shadow */}
      <div
        style={{
          position: 'absolute',
          bottom: -6,
          width: size * 0.4,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          filter: 'blur(2px)',
          zIndex: 1,
        }}
      />
    </div>
  );
};
