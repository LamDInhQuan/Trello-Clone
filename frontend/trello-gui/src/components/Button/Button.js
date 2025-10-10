//thuư viện ngoài
import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
// src

const cx = classNames.bind(styles);

function Button(
    {
        onChangeFile = false,
        inputFile = false,
        children,
        leftIcon = false,
        rightIcon = false,
        outline = false,
        imgSrc = false,
        avatarGroup = false,
        className = false,
        chipHover = false,
        onClick,
        padding = false,
        ...props
    },
    ref,
) {
    // xử lí click file
    const fileRef = useRef();
    const handleClick = () => fileRef.current.click();

    const [avatar, setAvatar] = useState('');
    const handleSetAvatar = () => {
        console.log('Image load error, set fallback');
        setAvatar(images.noImage);
    };

    if (imgSrc) {
        return (
            <img
                style={avatar === images.noImage ? { width: '40px' } : {}}
                onClick={onClick}
                src={avatar || imgSrc}
                ref={ref}
                className={className}
                onError={handleSetAvatar}
                {...props}
            />
        );
    }

    const classes = cx('wrapper', { outline, [className]: className, chipHover, avatarGroup });
    return (
        <div className={cx('button-wrapper')}>
            {inputFile && <input type="file" className={cx('hidden-input')} ref={fileRef} onChange={onChangeFile} />}
            <button className={classes} ref={ref} onClick={inputFile ? handleClick : onClick} {...props}>
                {leftIcon && <span className={cx('left-icon', padding)}>{leftIcon}</span>}
                {children}
                {rightIcon && <span className={cx('right-icon', padding)}>{rightIcon}</span>}
            </button>
        </div>
    );
}

export default memo(forwardRef(Button), (prev, next) => {
    return (
        prev.className === next.className &&
        prev.leftIcon === next.leftIcon &&
        prev.rightIcon === next.rightIcon &&
        prev.outline === next.outline &&
        prev.avatarGroup === next.avatarGroup &&
        prev.chipHover === next.chipHover &&
        prev.imgSrc === next.imgSrc &&
        prev.children === next.children &&
        prev.onClick === next.onClick
    );
});
