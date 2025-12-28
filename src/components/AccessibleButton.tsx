/**
 * Доступная кнопка с поддержкой React Aria
 */

import React from 'react';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { mergeProps } from '@react-aria/utils';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface AccessibleButtonProps extends Omit<MuiButtonProps, 'onPress'> {
  onPress?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  onPress,
  ariaLabel,
  ariaDescribedBy,
  children,
  disabled,
  ...props
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);

  const { buttonProps } = useButton(
    {
      onPress,
      isDisabled: disabled,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
    },
    ref
  );

  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <MuiButton
      {...mergeProps(props, buttonProps, focusProps)}
      ref={ref}
      className={`${props.className || ''} ${isFocusVisible ? 'focus-visible' : ''}`}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
    >
      {children}
    </MuiButton>
  );
};
