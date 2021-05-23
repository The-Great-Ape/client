import React from 'react';
import { Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

export class SideBar extends React.Component {
    handleClick = () => {
        console.log('click ');
    };

    render() {
        return (
            <Sider trigger={null} collapsible collapsed={false}>
                <div className="logo" >
                    <img src="/logo.png" alt="logo" className="header-logo" />
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<UserOutlined />}>
                        nav 1
          </Menu.Item>
                    <Menu.Item key="2" icon={<VideoCameraOutlined />}>
                        nav 2
          </Menu.Item>
                    <Menu.Item key="3" icon={<UploadOutlined />}>
                        nav 3
          </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}
