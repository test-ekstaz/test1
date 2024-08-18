import { TextField } from '@mui/material';
import { ChangeEvent, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

import styles from './InputSearch.module.scss';

//тип для пропсос инпута
type HTMLInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'color' | 'size'
>;
interface InputProps extends HTMLInputProps {
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const InputSearch = (props: InputProps) => {
  const { className, value, onChange, ...otherProps } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <TextField
      className={clsx(styles.search, className)}
      placeholder="Введите поисковый запрос"
      variant="outlined"
      size="small"
      value={value}
      onChange={onChangeHandler}
      {...otherProps}
      InputProps={{
        classes: {
          input: styles.placeholder,
        },
      }}
    />
  );
};

export default InputSearch;
