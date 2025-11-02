//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './CardDescriptionMdEditor.module.scss';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import Button from '~/components/Button';
import EditNoteIcon from '~/components/Icons/EditNoteIcon';
import { updateDescriptionCardAPI, updateTitleCardAPI } from '~/apis';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentActiveCard } from '~/redux/activeCard/activeCardSlice';
import { toast } from 'react-toastify';

const cx = classNames.bind(styles);
const markdownValueExample = `
  *\`Markdown Content Example:\`*

  **Hello world | Coladeptrai | Trello MERN Stack Advanced**
  [![](https://avatars.githubusercontent.com/u/14128099?v=4&s=80)](https://avatars.githubusercontent.com/u/14128099?v=4)
  \`\`\`javascript
  import React from "react"
  import ReactDOM from "react-dom"
  import MDEditor from '@uiw/react-md-editor'
  \`\`\`
`;
function CardDescriptionMdEditor({ value, updateCardInBoardRedux }) {
    const dispatch = useDispatch();
    const currentActiveCard = useSelector(selectCurrentActiveCard);

    const [editMode, setEditMode] = useState(false);
    const [content, setContent] = useState(value);

    const handleSave = () => {
        // console.log({ cardId: currentActiveCard._id, description: content });
        updateDescriptionCardAPI({ cardId: currentActiveCard._id || currentActiveCard.cardId, description: content })
            .then((res) => {
                if (!res.error) {
                    toast.success('Cập nhật mô tả Card thành công!');
                }
                updateCardInBoardRedux(res.result);
            })

            .catch(() => {});
        setEditMode(false);
    };

    return (
        <div className={cx('wrapper')}>
            {editMode ? (
                <div className={cx('MDEditor')}>
                    <div className={cx('saveState')}>
                        <MDEditor
                            value={content}
                            onChange={setContent}
                            previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                            height={400}
                            preview="edit"
                        />
                    </div>
                    <Button onClick={handleSave} className={cx('btnSave')}>
                        Lưu
                    </Button>
                </div>
            ) : (
                <div className={cx('MDEditor', { edit: true })}>
                    <Button
                        leftIcon={<EditNoteIcon className={cx('editIcon')} />}
                        onClick={() => setEditMode(true)}
                        className={cx('btnEdit')}
                    >
                        Edit
                    </Button>
                    <MDEditor.Markdown
                        source={content}
                        style={{
                            border: '1.5px solid #a9a6a6b8',
                            borderRadius: 6,
                            paddingBottom: '40px',
                            paddingLeft: '10px',
                            backgroundColor: '#fff',
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default CardDescriptionMdEditor;
