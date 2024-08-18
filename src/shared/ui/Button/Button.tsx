import { Button as MuiButton } from '@mui/material';
import { ButtonHTMLAttributes, FC } from 'react';
import clsx from 'clsx';

import styles from './Button.module.scss';

//интерфейс для пропсов кнопки из MUI (можно подобавлять из MUI каке еще есть)
export enum ButtonTheme {
  CONTAINED = 'contained',
}

//интерфейс для пропсов кнопки из MUI (размер кнопки)
export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

//интерфейс для пропсов кнопки из MUI (какие цвета)
export enum ButtonColor {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}


//интерфейс для пропсов кнопки 
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  theme?: ButtonTheme;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = (props) => {
  const { className, disabled, size, theme, color, ...otherProps } = props;
  return (
    <MuiButton
      className={clsx(styles.button, className)}
      color={color}
      size={size}
      variant={theme}
      disabled={disabled}
      {...otherProps}>
      Искать
    </MuiButton>
  );
};

export default Button;
