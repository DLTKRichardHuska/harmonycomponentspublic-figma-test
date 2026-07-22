import { forwardRef, type ElementType, type HTMLAttributeAnchorTarget, type Ref } from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export interface DelaButtonProps extends Omit<ButtonProps, 'variant'> {
  pill?: boolean;
  /** When set with `href`, renders as an anchor (same pattern as MUI Button). */
  component?: ElementType;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
  rel?: string;
}

const DelaRoot = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'pill',
})<{ pill?: boolean }>(({ pill, theme }) => {
  const pillRadius = theme.shape.harmony?.['radius-100'] ?? 9999;
  return {
    position: 'relative',
    overflow: 'hidden',
    textTransform: 'none',
    fontWeight: theme.typography.button.fontWeight,
    color: theme.dela.contrastText,
    background: theme.dela.gradient,
    borderRadius: pill ? pillRadius : theme.shape.borderRadius,
    border: 'none',
    boxShadow: 'none',
    '&:hover': {
      background: theme.dela.gradient,
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: theme.dela.gradientHover,
        borderRadius: 'inherit',
        pointerEvents: 'none',
      },
    },
    '&:active': { boxShadow: theme.shadows[1] },
    '&.Mui-disabled': { opacity: 0.6, color: theme.dela.contrastText },
    '& .dela-stars': {
      width: 20,
      height: 20,
      flexShrink: 0,
      filter: 'brightness(0) invert(1)',
    },
  };
});

export const DelaButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, DelaButtonProps>(
  function DelaButton(
    { pill = false, children, loading, loadingPosition = 'start', startIcon, ...props },
    ref,
  ) {
    const stars = !loading ? <img src="/Stars.svg" alt="" className="dela-stars" aria-hidden /> : undefined;
    return (
      <DelaRoot
        ref={ref as Ref<HTMLButtonElement>}
        pill={pill}
        variant="contained"
        disableElevation
        loading={loading}
        loadingPosition={loadingPosition}
        startIcon={stars ?? startIcon}
        {...props}
      >
        {children}
      </DelaRoot>
    );
  },
);
