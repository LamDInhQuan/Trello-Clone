//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './Loading.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Loading({ title, verified = false }) {
    return (
        <div className={cx('status-wrapper')}>
            {!verified && (
                <div className={cx('error-box')}>
                    <FontAwesomeIcon icon={faTriangleExclamation} className={cx('error-icon')} />
                    <h2 className={cx('error-title')}>Không thể tải bảng làm việc</h2>
                    <p className={cx('error-message')}>Vui lòng kiểm tra kết nối hoặc đảm bảo server đang hoạt động.</p>
                </div>
            )}
            <div className={cx('icon-box')}>
                <FontAwesomeIcon icon={faSpinner} className={cx('spinner')} />
                <h2 className={cx('loading-title')}>{title}</h2>
            </div>
        </div>
    );
}

export default Loading;
