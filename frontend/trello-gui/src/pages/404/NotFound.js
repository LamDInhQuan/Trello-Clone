import styles from './NotFound.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function NotFound() {
    return (
        <div className={cx('container')}>
            <div className={cx('bgNoise')}></div>
            <div className={cx('circle1')}></div>
            <div className={cx('circle2')}></div>
            <div className={cx('orb')}></div>
            <div className={cx('particles')}>
                {Array.from({ length: 25 }).map((_, i) => (
                    <span key={i}></span>
                ))}
            </div>

            <h1 className={cx('title')}>404</h1>
            <p className={cx('subtitle')}>Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>

            <a href="/" className={cx('homeBtn')}>
                ⬅ Quay về trang chủ
            </a>
        </div>
    );
}

export default NotFound;
