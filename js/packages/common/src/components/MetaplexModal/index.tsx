import React from 'react';
import { Modal } from 'antd';
import { Footer } from 'antd/lib/layout/layout';
export const MetaplexModal = (props: any) => {
  const { children, bodyStyle, ...rest } = props;

  return (
    <Modal
      bodyStyle={{
        background: '#2F2F2F',
        boxShadow: '0px 6px 12px 8px rgba(0, 0, 0, 0.3)',
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...bodyStyle,
      }}
      footer={Footer}
      width={400}
      {...rest}
    >
      {children}
    </Modal>
  );
};
