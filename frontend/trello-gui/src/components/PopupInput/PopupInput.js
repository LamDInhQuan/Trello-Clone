//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import CloseBorderIcon from '../Icons/CloseBorderIcon';
import CreateIcon from '../Icons/CreateIcon';
import styles from './PopupInput.module.scss';
import InputSearch from '../InputSearch';
import FieldErrorAlert from '../FieldErrorAlert';
import { useForm } from 'react-hook-form';
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators';
import ABCCharacterIcon from '../Icons/ABCCharacterIcon';
import DescriptionIcon from '../Icons/DescriptionIcon';
import Button from '../Button';
import { addNewBoardAPI } from '~/apis';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);

function PopupInput({ onPopUp = true, closePopup, onCreated }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm(); // dùng các props của useForm thay cho useState
    const inputTitle = watch('title'); // sẽ update liên tục khi gõ
    const inputDescription = watch('description');
    const submitCreateBoard = (data) => {
        console.log('data', data);
        addNewBoardAPI(data).then((res) => {
            if (!res.error) {
                toast.success('Thêm board thành công!');
            }
            closePopup();
            onCreated()
        });
    };
    return (
        <form onSubmit={handleSubmit(submitCreateBoard)}>
            <div className={cx('overlay', { onPopUp: onPopUp })}>
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <CreateIcon className={cx('iconCreate')} />
                        <p>Create a new board</p>
                        <span onClick={closePopup}>
                            <CloseBorderIcon className={cx('iconClose')} />
                        </span>
                    </div>
                    <div className={cx('content')}>
                        <InputSearch
                            leftIcon={<ABCCharacterIcon className={cx('hide-info-icon')} />}
                            title={'Title'}
                            valueInput={inputTitle}
                            searchInput_className={cx('input-username')}
                            label_search_className={cx('label-input-username')}
                            hasValue={true}
                            noValueInPlaceHolder={true}
                            {...register('title', {
                                required: FIELD_REQUIRED_MESSAGE,
                                minLength: { value: 3, message: 'Min length is 3 characters' },
                                maxLength: { value: 50, message: 'Max length is 50 characters' },
                            })}
                        />
                        <FieldErrorAlert errors={errors} fieldName={'title'} />

                        <InputSearch
                            leftIcon={<DescriptionIcon className={cx('hide-info-icon')} />}
                            title={'Description'}
                            valueInput={inputDescription}
                            searchInput_className={cx('input-username')}
                            label_search_className={cx('label-input-username')}
                            hasValue={true}
                            noValueInPlaceHolder={true}
                            {...register('description', {
                                required: FIELD_REQUIRED_MESSAGE,
                                minLength: { value: 3, message: 'Min length is 3 characters' },
                                maxLength: { value: 255, message: 'Max length is 50 characters' },
                            })}
                        />
                        <FieldErrorAlert errors={errors} fieldName={'description'} />

                        <div className={cx('scope-radio')}>
                            <div>
                                <label>Public</label>
                                <input type="radio" name="scope" value="public" defaultChecked {...register('scope')} />
                            </div>
                            <div>
                                <label>Private</label>
                                <input type="radio" name="scope" value="private" {...register('scope')} />
                            </div>
                        </div>
                        <Button className={cx('btn-create')}>Create</Button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default PopupInput;
