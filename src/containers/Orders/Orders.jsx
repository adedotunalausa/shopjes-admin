import React, { useState, useEffect } from 'react';
import { styled, withStyle, createThemedUseStyletron } from 'baseui';
import dayjs from 'dayjs';
import { Grid, Row as Rows, Col as Column } from '../../components/FlexBox/FlexBox';
import Select from '../../components/Select/Select';
import Input from '../../components/Input/Input';

import { callApiGet } from '../../utils';
import { Wrapper, Header, Heading } from '../../components/Wrapper.style';
import Checkbox from '../../components/CheckBox/CheckBox';

import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
} from './Orders.style';
import NoResult from '../../components/NoResult/NoResult';

// type CustomThemeT = { red400: string; textNormal: string; colors: any };
const themedUseStyletron = createThemedUseStyletron();

const Status = styled('div', ({ $theme }) => ({
  ...$theme.typography.fontBold14,
  color: $theme.colors.textDark,
  display: 'flex',
  alignItems: 'center',
  lineHeight: '1',
  textTransform: 'capitalize',

  ':before': {
    content: '""',
    width: '10px',
    height: '10px',
    display: 'inline-block',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
    backgroundColor: $theme.borders.borderE6,
    marginRight: '10px',
  },
}));

const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px)': {
    alignItems: 'center',
  },
}));

const statusSelectOptions = [
  { value: 1, label: 'Order Received' },
  { value: 2, label: 'Order On The Way' },
  { value: 3, label: 'Order Delivered' },
  { value: 4, label: 'Order Returned' },
];

const limitSelectOptions = [
  { value: 7, label: 'Last 7 orders' },
  { value: 15, label: 'Last 15 orders' },
  { value: 30, label: 'Last 30 orders' },
];

const isValidToken = () => {
  const token = localStorage.getItem('user');
  // JWT decode & check token validity & expiration.
  if (token) return JSON.parse(token);
  return false;
};

export default function Orders() {
  const [checkedId, setCheckedId] = useState([]);
  const [checked, setChecked] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    callApiGet("/grouped-orders", "GET", isValidToken().jwt)
      .then(response => setOrders(response))
      .catch(error => {
        console.log(error);
      })
    return () => {
      setOrders([]);
    };
  }, [])

  console.log("Orders", orders);

  const [useCss, theme] = themedUseStyletron();
  const sent = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.primary,
    },
  });
  const failed = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.red400,
    },
  });
  const processing = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.textNormal,
    },
  });
  const delivered = useCss({
    ':before': {
      content: '""',
      backgroundColor: theme.colors.blue400,
    },
  });

  const [status, setStatus] = useState();
  const [limit, setLimit] = useState([]);
  const [search, setSearch] = useState([]);

  const handleStatus = ({ value }) => {
    setStatus(value);
    // if (value.length) {
    //   refetch({
    //     status: value[0].value,
    //     limit: limit.length ? limit[0].value : null,
    //   });
    // } else {
    //   refetch({ status: null });
    // }
  }

  const handleLimit = ({ value }) => {
    setLimit(value);
    // if (value.length) {
    //   refetch({
    //     status: status.length ? status[0].value : null,
    //     limit: value[0].value,
    //   });
    // } else {
    //   refetch({
    //     limit: null,
    //   });
    // }
  }

  const handleSearch = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    // refetch({ searchText: value });
  }

  const onAllCheck = (event) => {
    if (event.target.checked) {
      const idx = orders && orders.map((order) => order.id);
      setCheckedId(idx);
    } else {
      setCheckedId([]);
    }
    setChecked(event.target.checked);
  }

  const handleCheckbox = (event) => {
    const { name } = event.currentTarget;
    if (!checkedId.includes(name)) {
      setCheckedId((prevState) => [...prevState, name]);
    } else {
      setCheckedId((prevState) => prevState.filter((id) => id !== name));
    }
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header
            style={{
              marginBottom: 30,
              boxShadow: '0 0 8px rgba(0, 0 ,0, 0.1)',
            }}
          >
            <Col md={3} xs={12}>
              <Heading>Orders</Heading>
            </Col>

            <Col md={9} xs={12}>
              <Row>
                <Col md={3} xs={12}>
                  <Select
                    options={statusSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Status"
                    value={status}
                    searchable={false}
                    onChange={handleStatus}
                  />
                </Col>

                <Col md={3} xs={12}>
                  <Select
                    options={limitSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    value={limit}
                    placeholder="Order Limits"
                    searchable={false}
                    onChange={handleLimit}
                  />
                </Col>

                <Col md={6} xs={12}>
                  <Input
                    value={search}
                    placeholder="Ex: Search By Address"
                    onChange={handleSearch}
                    clearable
                  />
                </Col>
              </Row>
            </Col>
          </Header>

          <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
            <TableWrapper>
              <StyledTable $gridTemplateColumns="minmax(70px, 70px) minmax(70px, 70px) minmax(150px, auto) minmax(150px, auto) minmax(200px, max-content) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto) minmax(150px, auto)">
                <StyledHeadCell>
                  <Checkbox
                    type="checkbox"
                    value="checkAll"
                    checked={checked}
                    onChange={onAllCheck}
                    overrides={{
                      Checkmark: {
                        style: {
                          borderTopWidth: '2px',
                          borderRightWidth: '2px',
                          borderBottomWidth: '2px',
                          borderLeftWidth: '2px',
                          borderTopLeftRadius: '4px',
                          borderTopRightRadius: '4px',
                          borderBottomRightRadius: '4px',
                          borderBottomLeftRadius: '4px',
                        },
                      },
                    }}
                  />
                </StyledHeadCell>
                <StyledHeadCell>ID</StyledHeadCell>
                <StyledHeadCell>Customer Details</StyledHeadCell>
                <StyledHeadCell>Payment Status</StyledHeadCell>
                <StyledHeadCell>Date/Time</StyledHeadCell>
                <StyledHeadCell>Delivery Address</StyledHeadCell>
                <StyledHeadCell>Amount</StyledHeadCell>
                <StyledHeadCell>Payment Method</StyledHeadCell>
                <StyledHeadCell>Status</StyledHeadCell>

                {orders ? (
                  orders.length ? (
                    orders
                      .map((row, index) => (
                        <React.Fragment key={index}>
                          <StyledCell>
                            <Checkbox
                              name={row.id}
                              checked={checkedId.includes(row.id)}
                              onChange={handleCheckbox}
                              overrides={{
                                Checkmark: {
                                  style: {
                                    borderTopWidth: '2px',
                                    borderRightWidth: '2px',
                                    borderBottomWidth: '2px',
                                    borderLeftWidth: '2px',
                                    borderTopLeftRadius: '4px',
                                    borderTopRightRadius: '4px',
                                    borderBottomRightRadius: '4px',
                                    borderBottomLeftRadius: '4px',
                                  },
                                },
                              }}
                            />
                          </StyledCell>
                          <StyledCell>{row.id}</StyledCell>
                          <StyledCell>
                            {row.user.firstName} {row.user.lastName} <br />
                            <span style={{ fontSize: "0.7rem" }}>{row.user.phone}</span>
                            <br />
                            <span style={{ fontSize: "0.7rem" }}>{row.user.email}</span>
                          </StyledCell>
                          <StyledCell>{row.paymentStatus}</StyledCell>
                          <StyledCell>
                            {dayjs(row.created_at).format('DD MMM YYYY')}, {dayjs(row.created_at).format('h:mm A')}
                          </StyledCell>
                          <StyledCell>{row.deliveryAddress}</StyledCell>
                          <StyledCell>${row.subTotal}</StyledCell>
                          <StyledCell>{row.paymentMethod}</StyledCell>
                          <StyledCell style={{ justifyContent: 'center' }}>
                            <Status
                              className={
                                row.status === 1
                                  ? sent
                                  : row.status === 2
                                    ? processing
                                    : row[8].status === 3
                                      ? delivered
                                      : row[8].toLowerCase() === 'unpaid'
                                        ? failed
                                        : ''
                              }
                            >
                              {row.status === 1 ? "Order Received"
                                : row.status === 2 ? "Order On The Way"
                                  : row.status === 3 ? "Order Delivered"
                                    : ""}
                            </Status>
                          </StyledCell>
                        </React.Fragment>
                      ))
                  ) : (
                    <NoResult
                      hideButton={false}
                      style={{
                        gridColumnStart: '1',
                        gridColumnEnd: 'one',
                      }}
                    />
                  )
                ) : null}
              </StyledTable>
            </TableWrapper>
          </Wrapper>
        </Col>
      </Row>
    </Grid>
  );
}
