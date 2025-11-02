//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './CardActivitySection.module.scss';
import images from '~/assets/images';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

const cx = classNames.bind(styles);
function CardActivitySection({ comments = [], onAddCardComment, cardId }) {
    const currentUser = useSelector(selectCurrentUser);

    const handelAddComment = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!e.target.value) return;
            const comment = {
                cardId: cardId,
                content: e.target.value,
            };
            console.log(comment);
            onAddCardComment(comment).then(() => {
                console.log('goi api hoan tat');
                e.target.value = '';
            });
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('hearder')}>
                <img src={currentUser?.avatar}></img>
                <input placeholder="Write a comment..." onKeyDown={handelAddComment} />
            </div>
            <div className={cx('content')}>
                {comments.length === 0 && <p>No activity found!</p>}
                {comments.map((item, index) => (
                    <div className={cx('contentActivity')} key={index}>
                        <img src={item?.userAvatar}></img>
                        <div className={cx('userInfoAndInput')}>
                            <div className={cx('userInfo')}>
                                <p>{item?.userDisplayname}</p>
                                <p>{moment(item?.commentAt).format('llll')}</p>
                            </div>
                            <input placeholder={item?.content} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CardActivitySection;
