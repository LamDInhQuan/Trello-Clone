//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './CardActivitySection.module.scss';
import images from '~/assets/images';
import moment from 'moment';

const cx = classNames.bind(styles);
function CardActivitySection() {
    const activityArray = Array.from({ length: 6 });
    return (
        <div className={cx('wrapper')}>
            <div className={cx('hearder')}>
                <img src={images.noImage2}></img>
                <input placeholder="Write a comment..." />
            </div>
            <div className={cx('content')}>
                {activityArray.length === 0 && <p>No activity found!</p>}
                {activityArray.map((item, index) => (
                    <div className={cx('contentActivity')} key={index}>
                        <img src={images.test}></img>
                        <div className={cx('userInfoAndInput')}>
                            <div className={cx('userInfo')}>
                                <p>Cola deptrai</p>
                                <p>{moment().format('llll')}</p>
                            </div>
                            <input placeholder="This is a comment!" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CardActivitySection;
