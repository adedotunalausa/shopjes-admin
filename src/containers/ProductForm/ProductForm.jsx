import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch } from '../../context/DrawerContext';
import Uploader from '../../components/Uploader/Uploader';
import Button, { KIND } from '../../components/Button/Button';
import DrawerBox from '../../components/DrawerBox/DrawerBox';
import { Row, Col } from '../../components/FlexBox/FlexBox';
import Input from '../../components/Input/Input';
import { Textarea } from '../../components/Textarea/Textarea';
import Select from '../../components/Select/Select';
import { FormFields, FormLabel } from '../../components/FormFields/FormFields';
import { toast } from 'react-toastify';
import Axios from 'axios';

import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';

// const options = [
//   { value: 'Beverage', name: 'Beverage', id: '1' },
//   { value: 'Grocery', name: 'Grocery', id: '2' },
//   { value: 'Sauce, Oils & Vinegars', name: 'Sauce, Oils & Vinegars', id: '3' },
//   { value: 'Rice', name: 'Rice', id: '4' },
//   { value: 'Noodles', name: 'Noodles', id: '5' },
//   { value: 'Seasoning Herbs & Spices', name: 'Seasoning Herbs & Spices', id: '6' },
//   { value: 'Snacks', name: 'Snacks', id: '7' },
//   { value: 'African', name: 'African', id: '8' },
//   { value: 'Caribbean', name: 'Caribbean', id: '9' },
//   { value: 'Asian', name: 'Asian', id: '10' },
//   { value: 'Mediterranean', name: 'Mediterranean', id: '11' },
//   { value: 'Chilled', name: 'Chilled', id: '12' },
//   { value: 'Food Services', name: 'Food Services', id: '13' },
//   { value: 'Non Food', name: 'Non Food', id: '13' },
// ];

const typeOptions = [
  { value: 'shop', name: 'Shop', id: '1' },
];

const isValidToken = () => {
  const token = localStorage.getItem('user');
  // JWT decode & check token validity & expiration.
  if (token) return JSON.parse(token);
  return false;
};

const calculatePercent = (value, total) => Math.round(value / total * 100)

const AddProduct = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm();
  const [type, setType] = useState([]);
  // const [tag, setTag] = useState([]);
  const [file, setFile] = useState({ file: null })
  const [description, setDescription] = useState('');
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    register({ name: 'type' });
    register({ name: 'categories' });
    // register({ name: 'image', required: true });
    register({ name: 'description' });
  }, [register]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue('description', value);
    setDescription(value);
  };

  // const handleMultiChange = ({ value }) => {
  //   setValue('categories', value);
  //   setTag(value);
  // };

  const handleTypeChange = ({ value }) => {
    setValue('type', value);
    setType(value);
  };

  const handleUploader = (files) => {
    // setValue('image', files[0]);
    setFile(files[0]);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const newProduct = {
      name: data.name,
      type: data.type[0].value,
      description: data.description,
      // image: data.image && data.image.length !== 0 ? data.image.name : '',
      image: "",
      price: Number(data.price),
      unit: data.unit,
      salePrice: Number(data.salePrice),
      discountInPercent: Number(data.discountInPercent),
      quantity: Number(data.quantity),
      slug: data.name.toLowerCase().trim().split(" ").join("-"),
      // categories: data.tag
    };

    const imageData = new FormData();
    imageData.append('files', file)

    const token = isValidToken().jwt

    try {

      const imageResponse = await Axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL}/upload`,
        data: imageData,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (imageResponse) {
        newProduct.image = imageResponse.data[0].url
      }
    } catch (error) {
      console.log(error);
      toast.error("There was an image upload error: " + error, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }

    try {

      const response = await Axios({
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL}/products`,
        data: newProduct,
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progress) => setPercent(calculatePercent(progress.loaded, progress.total))
      })
      console.log(response);

      if (response.status === 200) {

        toast.success("Product uploaded successfully", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

      }

    } catch (error) {
      console.log(error);
      toast.error("There was a product upload: " + error, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }

    setLoading(false);

    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Product</DrawerTitle>
        <div style={{
          width: "200px", height: "5px",
          backgroundColor: "#eee", margin: "24px"
        }}>
          <div style={{
            width: `${percent}%`,
            height: "4px",
            backgroundColor: "#EA1C44"
          }}></div>
        </div>
        {loading && <DrawerTitle>Uploading...</DrawerTitle>}
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
              className="track-horizontal"
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>Upload your Product image here</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox
                overrides={{
                  Block: {
                    style: {
                      width: '100%',
                      height: 'auto',
                      padding: '30px',
                      borderRadius: '3px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
              >
                <Uploader onChange={handleUploader} />
              </DrawerBox>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add your Product description and necessary information from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Name</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 40 })}
                    name="name"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Unit</FormLabel>
                  <Input type="text" inputRef={register} name="unit" />
                </FormFields>

                <FormFields>
                  <FormLabel>Price</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="price"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Sale Price</FormLabel>
                  <Input type="number" inputRef={register} name="salePrice" />
                </FormFields>

                <FormFields>
                  <FormLabel>Discount In Percent</FormLabel>
                  <Input
                    type="number"
                    inputRef={register}
                    name="discountInPercent"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Product Quantity</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="quantity"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Type</FormLabel>
                  <Select
                    options={typeOptions}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Type"
                    value={type}
                    searchable={false}
                    onChange={handleTypeChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                              ? $theme.colors.textDark
                              : $theme.colors.textNormal,
                          };
                        },
                      },
                      SingleValue: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
                  />
                </FormFields>

                {/* <FormFields>
                  <FormLabel>Categories</FormLabel>
                  <Select
                    options={options}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Tag"
                    value={tag}
                    onChange={handleMultiChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
                    multi
                  />
                </FormFields> */}
              </DrawerBox>
            </Col>
          </Row>
        </Scrollbars>

        <ButtonGroup>
          <Button
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                  marginRight: '15px',
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                }),
              },
            }}
          >
            Create Product
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
