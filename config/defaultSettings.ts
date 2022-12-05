import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  title: 'iSee',
  pwa: false,
  logo: '/isee_icon.png',
  headerHeight: 48,
  splitMenus: false,
  menu: {
    locale: false
  }
};

export default Settings;
