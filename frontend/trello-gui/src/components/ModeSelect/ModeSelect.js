//thuư viện ngoài
import styles from './ModeSelect.module.scss';
import classNames from 'classnames/bind';

// src

const cx = classNames.bind(styles);

function ModeSelect() {
    return (
        <div className={cx('wrapper')}>
            <label className={cx('select-label')}>Mode</label>
            <select className={cx('select-option')}>
                <option value="light">🌞 Light</option>
                <option value="dark">🌙 Dark</option>
            </select>
        </div>
    );
}

export default ModeSelect;
