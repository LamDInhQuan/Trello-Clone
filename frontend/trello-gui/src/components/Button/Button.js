//thuư viện ngoài
import { forwardRef, memo, useEffect, useState } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import images from '~/assets/images';
// src

const cx = classNames.bind(styles);

function Button(
    {
        children,
        leftIcon = false,
        rightIcon = false,
        outline = false,
        imgSrc = false,
        avatarGroup = false,
        className = false,
        chipHover = false,
        onClick,
        ...props
    },
    ref,
) {
    let Comp = 'button';
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
        <Comp className={classes} ref={ref} onClick={onClick} {...props}>
            {leftIcon && <span className={cx('left-icon')}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={cx('right-icon')}>{rightIcon}</span>}
        </Comp>
    );
}

export default memo(forwardRef(Button), (prevProps, nextProps) => {
    return (
        prevProps.className === nextProps.className &&
        prevProps.leftIcon === nextProps.leftIcon &&
        prevProps.rightIcon === nextProps.rightIcon &&
        prevProps.outline === nextProps.outline &&
        prevProps.avatarGroup === nextProps.avatarGroup &&
        prevProps.chipHover === nextProps.chipHover && 
        prevProps.imgSrc === nextProps.imgSrc
    );
});
