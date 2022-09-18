import { Settings as LayoutSettings } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'LuckDraw Admin',
  pwa: false,
  logo: 'https://img.alicdn.com/imgextra/i1/917298378/O1CN01M5YjWo2BlB0mF5rQu_!!917298378.png',
  iconfontUrl: '',
};

export default Settings;
