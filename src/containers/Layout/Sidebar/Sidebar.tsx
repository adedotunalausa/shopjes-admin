import React from 'react';
import { withRouter } from 'react-router-dom';
import {
  SidebarWrapper,
  NavLink,
  MenuWrapper,
  Svg,
  LogoutBtn,
} from './Sidebar.style';
import {
  DASHBOARD,
  PRODUCTS,
  CATEGORY,
  ORDERS,
  CUSTOMERS,
  COUPONS,
  SETTINGS,
} from '../../../settings/constants';

import { DashboardIcon } from '../../../assets/icons/DashboardIcon';
import { ProductIcon } from '../../../assets/icons/ProductIcon';
import { SidebarCategoryIcon } from '../../../assets/icons/SidebarCategoryIcon';
import { OrderIcon } from '../../../assets/icons/OrderIcon';
import { CustomerIcon } from '../../../assets/icons/CustomerIcon';
import { CouponIcon } from '../../../assets/icons/CouponIcon';
import { SettingIcon } from '../../../assets/icons/SettingIcon';
import { LogoutIcon } from '../../../assets/icons/LogoutIcon';
// import { useLogoutMutation } from '../../../generated/graphql';
// import { setAccessToken } from '../../../accessToken';

const sidebarMenus = [
  {
    name: 'Dashboard',
    path: DASHBOARD,
    exact: true,
    icon: <DashboardIcon />,
  },
  {
    name: 'Products',
    path: PRODUCTS,
    exact: false,
    icon: <ProductIcon />,
  },
  {
    name: 'Category',
    path: CATEGORY,
    exact: false,
    icon: <SidebarCategoryIcon />,
  },
  {
    name: 'Orders',
    path: ORDERS,
    exact: false,
    icon: <OrderIcon />,
  },
  {
    name: 'Customers',
    path: CUSTOMERS,
    exact: false,
    icon: <CustomerIcon />,
  },
  {
    name: 'Coupons',
    path: COUPONS,
    exact: false,
    icon: <CouponIcon />,
  },
  {
    name: 'Settings',
    path: SETTINGS,
    exact: false,
    icon: <SettingIcon />,
  },
];

export default withRouter(function Sidebar({
  refs,
  style,
  onMenuItemClick,
}: any) {

  // const history = useHistory();
  // const [logout, { client }] = useLogoutMutation();

  return (
    <SidebarWrapper ref={refs} style={style}>
      <MenuWrapper>
        {sidebarMenus.map((menu: any, index: number) => (
          <NavLink
            to={menu.path}
            key={index}
            exact={menu.exact}
            activeStyle={{
              color: '#ea1c44',
              backgroundColor: '#f7f7f7',
              borderRadius: '50px 0 0 50px',
            }}
            onClick={onMenuItemClick}
          >
            {menu.icon ? <Svg>{menu.icon}</Svg> : ''}
            {menu.name}
          </NavLink>
        ))}
      </MenuWrapper>

      <LogoutBtn
        // onClick={async () => {
        //   await logout();
        //   setAccessToken("");
        //   await client.resetStore();
        //   // history.go(0);
        // }}
      >
        <Svg>
          <LogoutIcon />
        </Svg>
        Logout
      </LogoutBtn>
    </SidebarWrapper>
  );
});
