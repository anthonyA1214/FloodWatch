'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Menu } from 'lucide-react';

const navItems = [
  { label: 'Features', url: '#features' },
  { label: 'Safety Guides', url: '#safety-guides' },
  { label: 'Latest News', url: '#latest-news' },
  { label: 'About Us', url: '#about-us' },
];

interface CollapsibleMenuProps {
  isLoggedIn?: boolean;
}

export default function CollapsibleMenu({
  isLoggedIn = false,
}: CollapsibleMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Hamburger — extra right padding so it's never flush with screen edge */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label='Open menu'
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 0px 4px 4px',
          display: 'flex',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        <Menu size={22} strokeWidth={2} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeMenu}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.45)',
              zIndex: 9998,
            }}
          />

          {/* Panel */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              width: '68%',
              maxWidth: '340px',
              height: '100vh',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-6px 0 32px rgba(0,0,0,0.2)',
              zIndex: 9999,
              // Respect device safe areas (notch / dynamic island)
              paddingRight: 'env(safe-area-inset-right, 0px)',
            }}
          >
            {/* Blue header — left padding for logo, right padding so X isn't clipped */}
            <div
              style={{
                backgroundColor: '#0066CC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingLeft: '16px',
                paddingRight: '12px',
                height: '64px',
                flexShrink: 0,
              }}
            >
              <Link
                href='/'
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  minWidth: 0,
                }}
              >
                <Image
                  src='/logo-white.svg'
                  alt='FloodWatch Logo'
                  width={26}
                  height={26}
                  style={{ flexShrink: 0 }}
                />
                <span
                  style={{
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '17px',
                    letterSpacing: '-0.2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  FloodWatch
                </span>
              </Link>

              {/* X button — explicit size so it's always fully visible */}
              <button
                onClick={closeMenu}
                aria-label='Close menu'
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  flexShrink: 0,
                  marginLeft: '8px',
                }}
              >
                <X size={22} strokeWidth={2} />
              </button>
            </div>

            {/* Nav links */}
            <nav style={{ flex: 1, overflowY: 'auto' }}>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.url}
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    padding: '18px 20px',
                    color: '#111111',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 400,
                    borderBottom: '1px solid #eeeeee',
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Auth buttons pinned to bottom */}
            {!isLoggedIn && (
              <div
                style={{
                  padding: '16px 20px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flexShrink: 0,
                }}
              >
                <Link
                  href='/auth/login'
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '13px',
                    borderRadius: '8px',
                    border: '1.5px solid #cccccc',
                    backgroundColor: '#ffffff',
                    color: '#111111',
                    fontWeight: 500,
                    fontSize: '15px',
                    textDecoration: 'none',
                  }}
                >
                  Login
                </Link>
                <Link
                  href='/auth/sign-up'
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '13px',
                    borderRadius: '8px',
                    backgroundColor: '#5B9BD5',
                    color: '#ffffff',
                    fontWeight: 600,
                    fontSize: '15px',
                    textDecoration: 'none',
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
