import { IconUser } from '@tabler/icons-react';

export const UserLocationMarker = () => {
  const size = 32;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        pointerEvents: 'none',
      }}
    >
      {/* Gradient circle head */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid white',
          boxShadow: '0 3px 14px #06b6d466, 0 2px 6px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <IconUser size={size * 0.55} stroke={1.8} />
      </div>

      {/* Pin tail */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${size * 0.22}px solid transparent`,
          borderRight: `${size * 0.22}px solid transparent`,
          borderTop: `${size * 0.38}px solid #06b6d4`,
          marginTop: -1,
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.25))',
          position: 'relative',
          zIndex: 1,
        }}
      />

      {/* Ground shadow */}
      <div
        style={{
          width: size * 0.4,
          height: 4,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.25)',
          marginTop: 2,
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
};
