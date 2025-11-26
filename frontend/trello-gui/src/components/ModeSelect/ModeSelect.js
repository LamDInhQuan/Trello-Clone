//thuư viện ngoài
import { ThemeContext } from '~/CreateContext/ThemeContext';
import styles from './ModeSelect.module.scss';
import classNames from 'classnames/bind';
import { useContext } from 'react';

// src

const cx = classNames.bind(styles);

function ModeSelect() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    // console.log(toggleTheme);
    return (
        <div className={cx('wrapper')}>
            <label className={cx('select-label')}>Mode</label>
            <select
                className={cx('select-option')}
                onChange={(e) => {
                    toggleTheme(e.target.value);
                }}
                value={theme}
            >
                <option value="light">🌞 Light</option>
                <option value="dark">🌙 Dark</option>
            </select>
        </div>
    );
}

export default ModeSelect;
