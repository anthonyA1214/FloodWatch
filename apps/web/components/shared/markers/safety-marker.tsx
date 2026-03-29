import { SAFETY_TYPE_COLOR_MAP } from '@/lib/utils/get-color-map';
import {
  IconBuildingHospital,
  IconBuildingCommunity,
} from '@tabler/icons-react';

const SAFETY_CONFIG = {
  hospital: {
    icon: IconBuildingHospital,
  },
  shelter: {
    icon: IconBuildingCommunity,
  },
};

export const SafetyMarker = ({
  type = 'hospital',
  isFocused,
}: {
  type: 'hospital' | 'shelter';
  isFocused?: boolean;
}) => {
  const { icon: Icon } = SAFETY_CONFIG[type] || SAFETY_CONFIG.hospital;
  const color = SAFETY_TYPE_COLOR_MAP[type] || SAFETY_TYPE_COLOR_MAP.hospital;
  const size = 32;

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Rounded square head */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '10px',
          backgroundColor: 'white',
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isFocused ? `3px solid ${color}` : `2.5px solid ${color}`,
          outline: isFocused ? `3px solid white` : 'none',
          boxShadow: isFocused
            ? `0 0 0 6px ${color}40, 0 3px 12px ${color}44, 0 2px 4px rgba(0,0,0,0.15)`
            : `0 3px 12px ${color}44, 0 2px 4px rgba(0,0,0,0.15)`,
          cursor: 'pointer',
        }}
      >
        <Icon size={size * 0.55} stroke={1.8} />
      </div>

      {/* Pin tail */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size * 0.22}px solid transparent`,
          borderRight: `${size * 0.22}px solid transparent`,
          borderTop: `${size * 0.38}px solid ${color}`,
          marginTop: -1,
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))',
        }}
      />

      {/* Ground shadow */}
      <div
        style={{
          width: size * 0.4,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.2)',
          marginTop: 2,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
};
