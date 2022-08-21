import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import '@umijs/max';

const Footer: React.FC = () => {
  const defaultMessage = 'licat';
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Ant Design Pro',
          title: 'Ant Design Pro',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/licat233/luck_draw-ui',
          blankTarget: true,
        },
        {
          key: 'go-zero',
          title: 'go-zero',
          href: 'https://go-zero.dev/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
