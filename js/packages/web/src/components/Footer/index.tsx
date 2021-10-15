import React from 'react';
import { GithubFilled, GithubOutlined, TwitterOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const Footer = () => {
  return (
    <div className={'footer'} style={{ textAlign: 'center' }}>
      <span className="field-title">PerforMint ©</span>
      <br />
      <Button
        shape={'circle'}
        target={'_blank'}
        href={'https://github.com/samukbg/performint/'}
        icon={<GithubFilled />}
        style={{ border: 0 }}
      ></Button>
    </div>
  );
};
