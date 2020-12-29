import React, { useState, useEffect } from 'react';
import { styled, withStyle } from 'baseui';
// import Button from '../../components/Button/Button';
import { Grid, Row as Rows, Col as Column } from '../../components/FlexBox/FlexBox';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import { callApi } from '../../utils'
import { Header, Heading } from '../../components/Wrapper.style';
import ProductCard from '../../components/ProductCard/ProductCard';
import NoResult from '../../components/NoResult/NoResult';
import { CURRENCY } from '../../settings/constants';
import Placeholder from '../../components/Placeholder/Placeholder';

export const ProductsRow = styled('div', ({ $theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: '25px',
  backgroundColor: $theme.colors.backgroundF7,
  position: 'relative',
  zIndex: '1',

  '@media only screen and (max-width: 767px)': {
    marginLeft: '-7.5px',
    marginRight: '-7.5px',
    marginTop: '15px',
  },
}));

export const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px) and (max-width: 991px)': {
    alignItems: 'center',
  },
}));

export const ProductCardWrapper = styled('div', () => ({
  height: '100%',
}));

export const LoaderWrapper = styled('div', () => ({
  width: '100%',
  height: '100vh',
  display: 'flex',
  flexWrap: 'wrap',
}));

export const LoaderItem = styled('div', () => ({
  width: '25%',
  padding: '0 15px',
  marginBottom: '30px',
}));

// const apiUrl = `${process.env.REACT_APP_API_URL}/products`;

const typeSelectOptions = [
  { value: 'shop', label: 'shop' },
];
const priceSelectOptions = [
  { value: 'highestToLowest', label: 'Highest To Lowest' },
  { value: 'lowestToHighest', label: 'Lowest To Highest' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loadingMore, toggleLoading] = useState(false);
  const [type, setType] = useState([]);
  const [priceOrder, setPriceOrder] = useState([]);
  const [search, setSearch] = useState([]);

  useEffect(() => {
    callApi("/products", "GET")
      .then(response => setProducts(response))
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        setError(error)
      })
    return () => {
      setProducts([]);
    };
  }, [])

  console.log(products);

  if (error) {
    return <div>Error! {error}</div>;
  }
  function loadMore() {
    toggleLoading(true);
  }
  function handlePriceSort({ value }) {
    setPriceOrder(value);
    // if (value.length) {
    //   refetch({
    //     sortByPrice: value[0].value,
    //   });
    // } else {
    //   refetch({
    //     sortByPrice: null,
    //   });
    // }
  }
  function handleCategoryType({ value }) {
    setType(value);
    // if (value.length) {
    //   refetch({
    //     type: value[0].value,
    //   });
    // } else {
    //   refetch({
    //     type: null,
    //   });
    // }
  }
  function handleSearch(event) {
    event.preventDefault();
    const value = event.currentTarget.value;
    setSearch(value);
    // refetch({ searchText: value });
  }

  return (
    <Grid fluid={true}>
      <Row>
        <Col md={12}>
          <Header style={{ marginBottom: 15 }}>
            <Col md={2} xs={12}>
              <Heading>Products</Heading>
            </Col>

            <Col md={10} xs={12}>
              <Row>
                <Col md={3} xs={12}>
                  <Select
                    options={typeSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    placeholder="Category Type"
                    value={type}
                    searchable={false}
                    onChange={handleCategoryType}
                  />
                </Col>

                <Col md={3} xs={12}>
                  <Select
                    options={priceSelectOptions}
                    labelKey="label"
                    valueKey="value"
                    value={priceOrder}
                    placeholder="Price"
                    searchable={false}
                    onChange={handlePriceSort}
                  />
                </Col>

                <Col md={6} xs={12}>
                  <Input
                    value={search}
                    placeholder="Ex: Search By Name"
                    onChange={handleSearch}
                    clearable
                  />
                </Col>
              </Row>
            </Col>
          </Header>

          <Row>
            {products ? (
              products.length !== 0 ? (
                products.map((item, index) => (
                  <Col
                    md={4}
                    lg={3}
                    sm={6}
                    xs={12}
                    key={index}
                    style={{ margin: '15px 0' }}
                  >
                    <ProductCard
                      title={item.name}
                      weight={item.unit}
                      image={item.image ? item.image : ""}
                      currency={CURRENCY}
                      price={item.price}
                      salePrice={item.salePrice}
                      discountInPercent={item.discountInPercent}
                      data={item}
                    />
                  </Col>
                ))
              ) : (
                  <NoResult />
                )
            ) : (
                <LoaderWrapper>
                  <LoaderItem>
                    <Placeholder />
                  </LoaderItem>
                  <LoaderItem>
                    <Placeholder />
                  </LoaderItem>
                  <LoaderItem>
                    <Placeholder />
                  </LoaderItem>
                  <LoaderItem>
                    <Placeholder />
                  </LoaderItem>
                </LoaderWrapper>
              )
            }
          </Row>
          {/* {data && data.products && data.products.hasMore && (
            <Row>
              <Col
                md={12}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <Button onClick={loadMore} isLoading={loadingMore}>
                  Load More
                </Button>
              </Col>
            </Row>
          )} */}
        </Col>
      </Row>
    </Grid>
  );
}
