import React, { useCallback, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import Popover, { PLACEMENT } from '../../../components/Popover/Popover';
import { callApiAuth } from '../../../utils'
import { useDispatchCurrentUser } from '../../../context/AuthUser'
import Notification from '../../../components/Notification/Notification';
import { STAFF_MEMBERS, SETTINGS } from '../../../settings/constants';
import { NotificationIcon } from '../../../assets/icons/NotificationIcon';
import { AlertDotIcon } from '../../../assets/icons/AlertDotIcon';
import { ArrowLeftRound } from '../../../assets/icons/ArrowLeftRound';
import { MenuIcon } from '../../../assets/icons/MenuIcon';
import {
  TopbarWrapper,
  Logo,
  LogoImage,
  TopbarRightSide,
  ProfileWrapper,
  ProfileImg,
  // ProfileName,
  Image,
  AlertDot,
  NotificationIconWrapper,
  UserDropdowItem,
  NavLink,
  LogoutBtn,
  DrawerIcon,
  CloseButton,
  DrawerWrapper,
} from './Topbar.style';
import Logoimage from '../../../assets/image/Shopjes.png';
import UserImage from '../../../assets/image/user.png';
import { useDrawerDispatch } from '../../../context/DrawerContext';
import Drawer, { ANCHOR } from '../../../components/Drawer/Drawer';
import Sidebar from '../Sidebar/Sidebar';

const notificationData = [
  {
    title: 'Delivery Successful',
    time: '5m',
    message: 'Order #34567 had been placed',
  },
];

const isValidUser = () => {
  const user = localStorage.getItem('user');
  if (user) return JSON.parse(user);
  return null;
};

const Topbar = ({ refs }) => {
  const logoutDispatch = useDispatchCurrentUser();
  const drawerDispatch = useDrawerDispatch();
  const currentUser = isValidUser().user;
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(
    () => drawerDispatch({ type: 'OPEN_DRAWER', drawerComponent: 'PRODUCT_FORM' }),
    [drawerDispatch]
  );

  const handleLogout = async () => {

    await callApiAuth("/logout", "POST")

    logoutDispatch({ type: "LOGOUT" })

    localStorage.removeItem('user')

    history.push("/login");
  }

  return (
    <TopbarWrapper ref={refs}>
      <Logo>
        <Link to="/">
          <LogoImage src={Logoimage} alt="shopjes-admin" />
        </Link>
      </Logo>

      <DrawerWrapper>
        <DrawerIcon onClick={() => setIsDrawerOpen(true)}>
          <MenuIcon />
        </DrawerIcon>
        <Drawer
          isOpen={isDrawerOpen}
          anchor={ANCHOR.left}
          onClose={() => setIsDrawerOpen(false)}
          overrides={{
            Root: {
              style: {
                zIndex: '1',
              },
            },
            DrawerBody: {
              style: {
                marginRight: '0',
                marginLeft: '0',
                '@media only screen and (max-width: 767px)': {
                  marginLeft: '30px',
                },
              },
            },
            DrawerContainer: {
              style: {
                width: '270px',
                '@media only screen and (max-width: 767px)': {
                  width: '80%',
                },
              },
            },
            Close: {
              component: () => (
                <CloseButton onClick={() => setIsDrawerOpen(false)}>
                  <ArrowLeftRound />
                </CloseButton>
              ),
            },
          }}
        >
          <Sidebar onMenuItemClick={() => setIsDrawerOpen(false)} />
        </Drawer>
      </DrawerWrapper>

      <TopbarRightSide>
        <Button onClick={openDrawer}>Add Products</Button>

        <Popover
          content={({ close }) => <Notification data={notificationData} onClear={close} />}
          accessibilityType={'tooltip'}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: {
                width: '330px',
                zIndex: 2,
              },
            },
            Inner: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          <NotificationIconWrapper>
            <NotificationIcon />
            <AlertDot>
              <AlertDotIcon />
            </AlertDot>
          </NotificationIconWrapper>
        </Popover>

        <Popover
          content={({ close }) => (
            <UserDropdowItem>
              <NavLink to={STAFF_MEMBERS} exact={false} onClick={close}>
                Staff
              </NavLink>
              <NavLink to={SETTINGS} exact={false} onClick={close}>
                Settings
              </NavLink>
              <LogoutBtn onClick={handleLogout}>
                Logout
              </LogoutBtn>
            </UserDropdowItem>
          )}
          accessibilityType={'tooltip'}
          placement={PLACEMENT.bottomRight}
          overrides={{
            Body: {
              style: () => ({
                width: '220px',
                zIndex: 2,
              }),
            },
            Inner: {
              style: {
                backgroundColor: '#ffffff',
              },
            },
          }}
        >
          <ProfileWrapper>
            <ProfileImg>
              <Image src={UserImage} alt="user" />
            </ProfileImg>
            {currentUser && `Welcome, ${currentUser.username}`}
          </ProfileWrapper>
        </Popover>
      </TopbarRightSide>
    </TopbarWrapper>
  );
};

export default Topbar;
