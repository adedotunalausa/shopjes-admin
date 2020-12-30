import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import {
  LOGIN,
  DASHBOARD,
  PRODUCTS,
  CATEGORY,
  ORDERS,
  CUSTOMERS,
  COUPONS,
  SETTINGS
} from './settings/constants';
import { InLineLoader } from './components/InlineLoader/InlineLoader';
import AdminLayout from './containers/Layout/Layout';
const Login = lazy(() => import('./containers/Login/Login'));
const Dashboard = lazy(() => import('./containers/Dashboard/Dashboard'));
const Products = lazy(() => import('./containers/Products/Products'));
const Categories = lazy(() => import('./containers/Category/Category'))

const isValidUser = () => {
const user = localStorage.getItem('user');
if (user) return true;
return false;
};

const PrivateRoute = ({ children, ...rest }) => {

  const currentUser =isValidUser();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        currentUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );

}


export const Routes: React.FC = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={LOGIN}>
          <Suspense fallback={<InLineLoader />}>
            <Login />
          </Suspense>
        </Route>
        <PrivateRoute exact={true} path={DASHBOARD}>
          <AdminLayout>
          <Suspense fallback={<InLineLoader />}>
            <Dashboard />
          </Suspense>
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute path={PRODUCTS}>
          <AdminLayout>
            <Suspense fallback={<InLineLoader />}>
              <Products />
            </Suspense>
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute path={CATEGORY}>
          <AdminLayout>
            <Suspense fallback={<InLineLoader />}>
              <Categories />
            </Suspense>
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute path={ORDERS}>
          <AdminLayout>
            <Suspense fallback={<InLineLoader />}>
              <h1>Orders Under Construction</h1>
            </Suspense>
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute path={CUSTOMERS}>
          <AdminLayout>
            <Suspense fallback={<InLineLoader />}>
              <h1>Customers Under Construction</h1>
            </Suspense>
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute path={COUPONS}>
          <AdminLayout>
            <Suspense fallback={<InLineLoader />}>
              <h1>Coupons Under Construction</h1>
            </Suspense>
          </AdminLayout>
        </PrivateRoute>
        <PrivateRoute path={SETTINGS}>
          <AdminLayout>
            <Suspense fallback={<InLineLoader />}>
              <h1>Settings Under Construction</h1>
            </Suspense>
          </AdminLayout>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
