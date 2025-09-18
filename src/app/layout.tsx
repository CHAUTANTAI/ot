'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider, Layout, Menu, theme, App } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#00b96b',
              },
            }}
          >
            <App>
              <Layout style={{ minHeight: '100vh' }}>
                <Sider
                  breakpoint="lg"
                  collapsedWidth="0"
                  onBreakpoint={(broken) => {
                    console.log(broken);
                  }}
                  onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                  }}
                >
                  <div className="demo-logo-vertical" />
                  <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[{ key: '1', icon: '', label: <Link href="/">Home</Link> }]}
                  />
                </Sider>
                <Layout>
                  <Header style={{ padding: 0, background: colorBgContainer }} />
                  <Content style={{ margin: '24px 16px 0' }}>
                    <div
                      style={{
                        padding: 24,
                        minHeight: 360,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                      }}
                    >
                      {children}
                    </div>
                  </Content>
                </Layout>
              </Layout>
            </App>
          </ConfigProvider>
        </Provider>
      </body>
    </html>
  );
}
