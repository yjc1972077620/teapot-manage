import React, { useEffect } from 'react';
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

type NotificationProps = {
  message: string;
  type?: NotificationType;
  visible?: boolean;
  onClose?: () => void;
  duration?: number;
};

/**
 * 基于 Antd Modal 的通知组件
 * - 保留原有遮罩与布局
 * - 保留 FontAwesome 图标
 */
const AppNotification = ({
  message,
  type = 'info',
  visible = false,
  onClose,
  duration = 2000
}: NotificationProps) => {
  // 自动关闭逻辑
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [visible, duration, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: faCheckCircle,
          iconColor: 'text-green-500'
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: faExclamationCircle,
          iconColor: 'text-red-500'
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: faExclamationCircle,
          iconColor: 'text-yellow-500'
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: faInfoCircle,
          iconColor: 'text-blue-500'
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable={false}
      centered
      destroyOnClose
      maskClosable
      width={420}
      styles={{ body: { padding: 0, background: 'transparent' } }}
      // 保持遮罩与旧组件一致的透明度
      maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
    >
      <div
        className={`relative max-w-md mx-4 p-4 rounded-lg border ${config.bgColor} ${config.borderColor} shadow-lg`}
        role="alert"
      >
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${config.iconColor}`}>
            <FontAwesomeIcon icon={config.icon} size="lg" />
          </div>
          <div className={`ml-3 flex-1 ${config.textColor}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AppNotification;
