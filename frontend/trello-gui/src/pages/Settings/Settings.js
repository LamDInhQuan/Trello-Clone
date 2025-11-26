//thuư viện ngoài
import classNames from 'classnames/bind';

// src
import styles from './Settings.module.scss';
import AccountIcon from '~/components/Icons/AccountIcon';
import SecurityIcon from '~/components/Icons/SecurityIcon';
import Button from '~/components/Button';
import AppBar from '~/components/AppBar';
import AccountTab from './AccountTab';
import SecurityTab from './SecurityTab';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
function Settings() {
    const location = useLocation();
    const navigate = useNavigate();

    const tabs = [
        {
            icon: AccountIcon,
            title: 'ACCOUNT',
            children: <AccountTab />,
            link: 'account',
        },
        {
            icon: SecurityIcon,
            title: 'SECURITY',
            children: <SecurityTab />,
            link: 'security',
        },
    ];
    const path = location.pathname.split('/').pop(); // // lấy phần sau cùng của URL
    const currentIndex = tabs.findIndex((item) => item.link === path);

    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const changeTab = (index) => {
        setCurrentTabIndex(index);
        navigate(`/settings/${tabs[index].link}`);
    };
    // refresh thì set component = tab
    useEffect(() => {
        setCurrentTabIndex(currentIndex);
    }, [currentIndex]);
    return (
        <div className={cx('wrapper')}>
            <AppBar />
            <div className={cx('tab')}>
                <div className={cx('tab-button')}>
                    {tabs.map((item, index) => {
                        return (
                            <Button
                                key={index}
                                leftIcon={
                                    <item.icon className={cx('tab-icon', { activeItem: currentTabIndex === index })} />
                                }
                                className={cx('button', { activeButton: currentTabIndex === index })}
                                onClick={() => changeTab(index)}
                            >
                                {item.title}
                            </Button>
                        );
                    })}
                </div>
            </div>
            {tabs[currentTabIndex].children}
        </div>
    );
}

export default Settings;
