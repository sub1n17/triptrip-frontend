'ues client';

import { FieldValues, Path, useFormContext } from 'react-hook-form';
import style from './styles.module.css';
import { HTMLInputTypeAttribute } from 'react';

interface IInputSoftProps<T> {
    type?: HTMLInputTypeAttribute;
    keyname: Path<T>;
    className?: string;
    placeholder?: string;
    readOnly?: boolean;
    role?: string;
}
function InputBase<T extends FieldValues>(props: IInputSoftProps<T>) {
    const { register } = useFormContext<T>();

    return (
        <input
            role={props.role}
            type={props.type}
            {...register(props.keyname)}
            placeholder={props.placeholder}
            {...props}
            name={props.keyname}
        />
    );
}

export default function InputSoft<T extends FieldValues>(props: IInputSoftProps<T>) {
    return <InputBase<T> {...props} className={style.input_wrapperInput}></InputBase>;
}
