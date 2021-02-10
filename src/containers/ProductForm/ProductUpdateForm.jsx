import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch, useDrawerState } from '../../context/DrawerContext';
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
import { categories } from "../../data/categories"

import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';

const typeOptions = [
  { value: 'shop', name: 'Shop', id: '1' },
];

const categoryOptionsFetcher = () => {
  const list = categories.map(item => {
    return {
      value: item.title,
      name: item.title,
      id: item.id
    }
  })
  return list;
}

const subCategoryOptionsFetcher = (input) => {
  const options = categories.filter(item => item.title === input)[0]
    .children.map(item => {
      return {
        value: item.title,
        name: item.title,
        id: item.id
      }
    })
  return options;
}

const isValidToken = () => {
  const token = localStorage.getItem('user');
  // JWT decode & check token validity & expiration.
  if (token) return JSON.parse(token);
  return false;
};

const calculatePercent = (value, total) => Math.round(value / total * 100)

const AddProduct = () => {
  const dispatch = useDrawerDispatch();
  const defaultData = useDrawerState('data');
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: defaultData,
  });

  const [type, setType] = useState([{ value: defaultData.type }]);
  const [category, setCategory] = useState([{ value: defaultData.category }]);
  const [subCategory, setSubCategory] = useState([]);
  const [file, setFile] = useState({ file: null })
  const [description, setDescription] = useState(defaultData.description);
  const [percent, setPercent] = useState(0)
  const [loading, setLoading] = useState(false)
  const [subCategoryOptions, setSubCategoryOptions] = useState([])
  const categoryOptions = categoryOptionsFetcher();

  React.useEffect(() => {
    register({ name: 'type' });
    register({ name: 'category' });
    register({ name: 'subCategory' });
    // register({ name: 'image' });
    register({ name: 'description' });
  }, [register]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue('description', value);
    setDescription(value);
  };

  const handleTypeChange = ({ value }) => {
    setValue('type', value);
    setType(value);
  };

  const handleCategoryChange = ({ value }) => {
    setValue('category', value);
    setCategory(value);
    const selectedOption = subCategoryOptionsFetcher(value[0].value)
    setSubCategoryOptions(selectedOption);
  };

  const handleSubCategoryChange = ({ value }) => {
    setValue('subCategory', value);
    setSubCategory(value);
  };

  const handleUploader = (files) => {
    // setValue('image', files[0].path);
    setFile(files[0]);
  };

  const onSubmit = async (data) => {

    setLoading(true);

    const newProduct = {
      id: defaultData.id,
      title: data.title,
      type: data.type === undefined ? defaultData.type : data.type[0].value,
      description: data.description,
      image: defaultData.image,
      price: Number(data.price),
      unit: data.unit,
      salePrice: Number(data.salePrice),
      discountInPercent: Number(data.discountInPercent),
      // quantity: Number(data.quantity),
      slug: data.title.toLowerCase().trim().split(" ").join("-"),
      category: data.category === undefined ? defaultData.category : data.category[0].value,
      sub_category: data.subCategory === undefined ? defaultData.sub_category : data.subCategory[0].value
    };

    const imageData = new FormData();
    imageData.append('files', file)

    const token = isValidToken().jwt

    try {

      if (file.file !== null) {

        const imageResponse = await Axios({
          method: 'POST',
          url: `${process.env.REACT_APP_API_URL}/upload`,
          data: imageData,
          headers: { Authorization: `Bearer ${token}` },
        })

        if (imageResponse) {
          newProduct.image = imageResponse.data[0].url
        }

      }

      const response = await Axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_API_URL}/products/${defaultData.id}`,
        data: newProduct,
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progress) => setPercent(calculatePercent(progress.loaded, progress.total))
      })
      // console.log(response);

      if (response.error) {
        toast.error("There was an error: " + response.message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } else {
        toast.success("Product updated successfully", {
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
    }

    // console.log(newProduct, 'newProduct data');

    setLoading(false);

    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Update Product</DrawerTitle>
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
        {loading && <DrawerTitle>Updating...</DrawerTitle>}
      </DrawerTitleWrapper>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: '100%' }}
        noValidate
      >
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
              <DrawerBox>
                <Uploader onChange={handleUploader} imageURL={defaultData.image} />
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
                    inputRef={register({ required: true })}
                    name="title"
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
                    type="number" required min="0" step="0.01"
                    pattern="^\d+(?:\.\d{1,2})?$"
                    inputRef={register({ required: true })}
                    name="price"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Sale Price</FormLabel>
                  <Input type="number" required min="0" step="0.01"
                    pattern="^\d+(?:\.\d{1,2})?$"
                    inputRef={register} name="salePrice" />
                </FormFields>

                <FormFields>
                  <FormLabel>Discount In Percent</FormLabel>
                  <Input
                    type="number" required min="0" step="0.01"
                    pattern="^\d+(?:\.\d{1,2})?$"
                    inputRef={register} name="discountInPercent"
                  />
                </FormFields>

                {/* <FormFields>
                  <FormLabel>Product Quantity</FormLabel>
                  <Input type="number" inputRef={register} name="quantity" />
                </FormFields> */}

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

                <FormFields>
                  <FormLabel>Category</FormLabel>
                  <Select
                    options={categoryOptions}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Category"
                    value={category}
                    onChange={handleCategoryChange}
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

                <FormFields>
                  <FormLabel>Sub-Category</FormLabel>
                  <Select
                    options={subCategoryOptions}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Sub-Category"
                    value={subCategory}
                    onChange={handleSubCategoryChange}
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
            Update Product
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
