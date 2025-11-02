//thuư viện ngoài
import { forwardRef, memo } from 'react';
import styles from './MenuDropDownCustom.module.scss';
import classNames from 'classnames/bind';
// src

const cx = classNames.bind(styles);

const MenuDropDownCustom = ({ className, children, position = false }, ref) => {
    // console.log("render");
    let left, top;
    if (position) {
        ({ left, top } = position);
    }
    return (
        <div
            className={cx(className)}
            ref={ref}
            style={{
                ...(position ? { left: `${left}px`, top: `${top}px` } : {}),
      
            }} //Dấu ... là spread operator, dùng để "trải" các thuộc tính của object ra.
        >
            {children}
        </div>
    );
};

export default memo(forwardRef(MenuDropDownCustom));
// export default memo(forwardRef(MenuDropDownCustom), comparisonFunction)
// memo là hàm của React giúp ghi nhớ (memoize) component — tức là chỉ render lại khi props thay đổi.
// comparisonFunction là một hàm tự bạn viết để React biết khi nào props được coi là “bằng nhau” (không thay đổi), nhờ đó quyết định có render lại hay không.
// Cụ thể:
// Nếu comparisonFunction(prevProps, nextProps) trả về true → React bỏ qua render lại.
// Nếu trả về false → React sẽ render lại component.
