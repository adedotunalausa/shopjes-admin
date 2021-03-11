import React, {useEffect, useState} from 'react';
import { withStyle, useStyletron } from 'baseui';
import moment from 'moment'
import { Grid, Row, Col as Column } from '../../components/FlexBox/FlexBox';
import RadialBarChart from '../../components/Widgets/RadialBarChart/RadialBarChart';
import LineChart from '../../components/Widgets/LineChart/LineChart';
import ColumnChart from '../../components/Widgets/ColumnChart/ColumnChart';
import StickerCard from '../../components/Widgets/StickerCard/StickerCard';

import { CoinIcon } from '../../assets/icons/CoinIcon';
import { CartIconBig } from '../../assets/icons/CartIconBig';
import { UserIcon } from '../../assets/icons/UserIcon';
import { callApiGet } from '../../utils'
import {
  graphAmountDataHandler,
  monthlyRevenueHandler,
  monthlyCustomerHandler,
  monthlyOrderHandler,
  graphSalesDataHandler,
  yearlyRevenueHandler,
  yearlyPercentageDifference
} from '../../lib/dashboard'

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 574px)': {
    marginBottom: '30px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const isValidToken = () => {
  const token = localStorage.getItem('user');
  // JWT decode & check token validity & expiration.
  if (token) return JSON.parse(token);
  return false;
};

const Dashboard = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const currentMonth = moment().format("MMMM");
  const previousMonth = moment().subtract(1, 'months').format("MMMM")
  const currentYear = moment().format("YYYY");
  const previousYear = moment().subtract(1, 'years').format("YYYY")

  useEffect(() => {
    callApiGet("/grouped-orders", "GET", isValidToken().jwt)
      .then(response => setOrders(response))
      .catch(error => {
        console.log(error);
       })
  }, [])

  useEffect(() => {
    callApiGet("/users", "GET", isValidToken().jwt)
      .then(response => setCustomers(response))
      .catch(error => {
        console.log(error);
       })
  }, [])
  
  console.log("Orders", orders);
  

  const [css] = useStyletron();
  const mb30 = css({
    '@media only screen and (max-width: 990px)': {
      marginBottom: '16px',
    },
  });

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={5} lg={4} sm={6}>
          <RadialBarChart
            widgetTitle="Target"
            series={[43, 75]}
            label={['£1,342', '£8,908']}
            colors={['#ea1c44', '#666d92']}
            helperText={['Weekly Targets', 'Monthly Targets']}
          />
        </Col>
        <Col md={7} lg={8} sm={6}>
          <LineChart
            widgetTitle="Paid Orders"
            color={['#ea1c44']}
            seriesName="Amount"
            series={orders && graphAmountDataHandler(currentYear, orders)}
            categories={[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={4} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Total Revenue"
            subtitle="(this month)"
            icon={<CoinIcon />}
            price={`£${orders && monthlyRevenueHandler(currentMonth, orders).toLocaleString()}`}
            indicator={
              monthlyRevenueHandler(previousMonth, orders)
                > monthlyRevenueHandler(currentMonth, orders)
                ? "down" : monthlyRevenueHandler(previousMonth, orders)
                > monthlyRevenueHandler(currentMonth, orders)
                ? "up" : "constant"
            }
            indicatorText={
              monthlyRevenueHandler(previousMonth, orders)
                > monthlyRevenueHandler(currentMonth, orders)
                ? "Revenue down" : monthlyRevenueHandler(previousMonth, orders)
                > monthlyRevenueHandler(currentMonth, orders)
                ? "Revenue up" : "No increment"
            }
            note="(this month)"
            link="#"
            linkText="Full Details"
          />
        </Col>
        <Col lg={4} sm={6} xs={12} className={mb30}>
          <StickerCard
            title="Total Order Placed"
            subtitle="(this month)"
            icon={<CartIconBig />}
            price={orders && monthlyOrderHandler(currentMonth, orders)}
            indicator={
              monthlyOrderHandler(previousMonth, orders)
                > monthlyOrderHandler(currentMonth, orders)
                ? "down" : monthlyOrderHandler(previousMonth, orders)
                < monthlyOrderHandler(currentMonth, orders)
                ? "up" : "constant"
            }
            indicatorText={
              monthlyOrderHandler(previousMonth, orders)
                > monthlyOrderHandler(currentMonth, orders)
                ? "Order down" : monthlyOrderHandler(previousMonth, orders)
                < monthlyOrderHandler(currentMonth, orders)
                ? "Order up" : "No increment"
            }
            note="(this month)"
            link="#"
            linkText="Full Details"
          />
        </Col>
        <Col lg={4} sm={6} xs={12}>
          <StickerCard
            title="New Customer"
            subtitle="(this month)"
            icon={<UserIcon />}
            price={orders && monthlyCustomerHandler(currentMonth, customers)}
            indicator={
              monthlyCustomerHandler(previousMonth, customers)
                > monthlyCustomerHandler(currentMonth, customers)
                ? "down" : monthlyCustomerHandler(previousMonth, customers)
                < monthlyCustomerHandler(currentMonth, customers)
                ? "up" : "constant"
            }
            indicatorText={
              monthlyCustomerHandler(previousMonth, customers)
                > monthlyCustomerHandler(currentMonth, customers)
                ? "Customer down" : monthlyCustomerHandler(previousMonth, customers)
                  < monthlyCustomerHandler(currentMonth, customers) ? "Customer up"
                  : "No increment"
            }
            note="(this month)"
            link="#"
            linkText="Full Details"
          />
        </Col>
      </Row>

      <Row>
        <Col md={12} lg={12}>
          <ColumnChart
            widgetTitle="Sale History"
            colors={['#ea1c44']}
            prefix="£"
            totalValue={orders && yearlyRevenueHandler(currentYear, orders)
              .toLocaleString()}
            position={
              yearlyRevenueHandler(previousYear, orders)
                > yearlyRevenueHandler(currentYear, orders)
                ? "down" :yearlyRevenueHandler(previousYear, orders)
                < yearlyRevenueHandler(currentYear, orders) ? "up" : ""
            }
            percentage={
              `${yearlyPercentageDifference(currentYear, previousYear, orders)}%`
            }
            text={
              yearlyRevenueHandler(previousYear, orders)
                > yearlyRevenueHandler(currentYear, orders)
                  ? "Lower than last year" : "More than last year"
            }
            series={graphSalesDataHandler(currentYear, orders)}
            categories={[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ]}
          />
        </Col>
      </Row>
    </Grid>
  );
};

export default Dashboard;
