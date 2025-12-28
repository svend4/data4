/**
 * Skip Links для быстрой навигации
 */

import React from 'react';
import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const SkipLinks: React.FC = () => {
  const { t } = useTranslation();

  const skipLinks = [
    { href: '#main-content', label: t('skipLinks.mainContent') },
    { href: '#navigation', label: t('skipLinks.navigation') },
    { href: '#footer', label: t('skipLinks.footer') },
  ];

  return (
    <Box
      component="nav"
      aria-label={t('skipLinks.ariaLabel')}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 9999,
        '& a': {
          position: 'absolute',
          left: '-9999px',
          top: '4px',
          padding: '8px 16px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          textDecoration: 'none',
          borderRadius: '4px',
          '&:focus': {
            left: '4px',
          },
        },
      }}
    >
      {skipLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          {link.label}
        </Link>
      ))}
    </Box>
  );
};
