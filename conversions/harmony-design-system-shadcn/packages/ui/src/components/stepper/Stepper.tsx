import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactElement,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import type { StepProps } from './Step';

export type StepperOrientation = 'horizontal' | 'vertical';

export const stepperVariants = cva('flex w-full font-sans', {
  variants: {
    orientation: {
      horizontal: 'flex-row items-start',
      vertical: 'flex-col items-stretch',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

interface StepperContextValue {
  activeStep: number;
  nonLinear: boolean;
  orientation: StepperOrientation;
  onStepClick?: (index: number) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export function useStepperContext(): StepperContextValue | null {
  return useContext(StepperContext);
}

export interface StepperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'> {
  /** Zero-based index of the active step. */
  activeStep?: number;
  /** Layout direction. */
  orientation?: StepperOrientation;
  /** Allow jumping to any step (non-linear mode). */
  nonLinear?: boolean;
  /** Fires with the clicked step index in non-linear mode. */
  onStepClick?: (index: number) => void;
}

export const Stepper = forwardRef<HTMLDivElement, StepperProps>(function Stepper(
  {
    activeStep = 0,
    orientation = 'horizontal',
    nonLinear = false,
    onStepClick,
    className,
    children,
    ...rest
  },
  ref,
) {
  const steps = Children.toArray(children).filter(isValidElement) as ReactElement<StepProps>[];
  const total = steps.length;

  return (
    <StepperContext.Provider value={{ activeStep, nonLinear, orientation, onStepClick }}>
      <div
        ref={ref}
        role="group"
        aria-label="Stepper"
        className={cn(stepperVariants({ orientation }), className)}
        {...rest}
      >
        {steps.map((child, index) => {
          const props = child.props;
          const isActive = index === activeStep;
          const explicitCompleted = !!props.completed;
          const linearDisabled = !nonLinear && index > activeStep && !explicitCompleted;
          const effectiveDisabled = !!props.disabled || linearDisabled;

          const next = steps[index + 1] as ReactElement<StepProps> | undefined;
          const nextActive = next ? index + 1 === activeStep : false;
          const nextCompleted = next ? !!next.props.completed : false;
          const connectorActive = explicitCompleted || nextActive || nextCompleted;

          return cloneElement(child, {
            __index: index,
            __isLast: index === total - 1,
            __active: isActive,
            __disabled: effectiveDisabled,
            __connectorActive: connectorActive,
          });
        })}
      </div>
    </StepperContext.Provider>
  );
});
