//thuư viện ngoài
import classNames from 'classnames/bind';
import styles2 from '~/components/MenuDropDownCustom/MenuDropDownCustom.module.scss';
import styles3 from '~/components/MenuDropDownCustom/MenuDropDownCustomItem/MenuDropDownCustomItem.module.scss';
import styles from './MenuAppBar.module.scss';

// src

import { useRef, useState } from 'react';
import Button from '~/components/Button';
import Icons from '~/components/Icons';
import MenuDropDownCustom from '~/components/MenuDropDownCustom';
import MenuDropDownCustomItem from '~/components/MenuDropDownCustom/MenuDropDownCustomItem';
import useClickOutSide from '~/hooks/useClickOutSide';
import useDropDownPosition from '~/hooks/useDropDownPosition';

const cx = classNames.bind(styles);
const cx2 = classNames.bind(styles2);
const cx3 = classNames.bind(styles3);

// useClickAway
// 1 . ref	RefObject	Thẻ DOM mà bạn muốn bảo vệ (nếu click ra ngoài nó thì mới gọi callback).
// 2. onClickAway	function(event)	Hàm callback được gọi khi click xảy ra ngoài vùng ref.
// 3. events (tuỳ chọn)	string[]	Loại event muốn lắng nghe (mousedown, touchstart, click, v.v).
function ButtonDropDownMenu({
    imgSrc = false,
    children,
    leftIcon = false,
    rightIcon = false,
    calcPosition = false,
    magin = false,
    className = false,
    menuItems,
}) {
    const [hide, setHide] = useState(false);
    const handleClick = () => {
        setHide((prev) => !prev);
    };
    const dropdownRef = useRef();
    const imgRef = useRef();
    // lấy tọa độ menu

    const position = useDropDownPosition(imgRef, dropdownRef, hide, magin);

    // Nếu click bên ngoài dropdownRef, đóng dropdown
    const divRef = useRef();
    useClickOutSide(
        divRef,
        () => {
            setHide(false);
        },
        hide,
    );

    return (
        <div className={cx('menu-dropDown', className)} ref={divRef} style={imgSrc ? { minWidth: '30px' } : {}}>
            <Button
                ref={imgRef}
                onClick={handleClick}
                className={imgSrc ? cx('avatar') : cx('button')}
                imgSrc={imgSrc || false}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            >
                {children}
            </Button>
            {/*  ẩn hiện menumenu */}
            <MenuDropDownCustom
                className={cx2('wrapper', { active: hide })}
                ref={dropdownRef}
                position={imgSrc || calcPosition ? position : false}
            >
                {menuItems
                    ? menuItems.map((item, key) => {
                          const Icon = item.icon;
                          return (
                              <MenuDropDownCustomItem
                                  key={key}
                                  leftIcon={<Icon className={cx('icon3')} />}
                                  onClick={item.onClick}
                              >
                                  {item.label}
                              </MenuDropDownCustomItem>
                          );
                      })
                    : []}
            </MenuDropDownCustom>
            {/*  ẩn hiện menumenu */}
        </div>
    );
}

export default ButtonDropDownMenu;
