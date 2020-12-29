import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
} from '../../components/FormFields/FormFields';
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from './Login.style';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Logoimage from '../../assets/image/Shopjes.png';
import { callApi } from '../../utils'
import { useDispatchCurrentUser } from '../../context/AuthUser'

const initialValues = {
  email: '',
  password: '',
};

const getLoginValidationSchema = () => {
  return Yup.object().shape({
    email: Yup.string().required('email is Required!'),
    password: Yup.string().required('Password is Required!'),
  });
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

export default function Login() {
  let history = useHistory();
  const [errorMsg, setErrorMsg] = useState(null);
  const dispatch = useDispatchCurrentUser();

  let login = async ({ email, password }) => {

    setErrorMsg(null);

    try {
      const response = await callApi("/auth/local", "POST", {
        identifier: email,
        password: password,
      });

      if (!response.user) {
        // eslint-disable-next-line no-throw-literal
        throw "Cannot login please try again!";
      }

      dispatch({ type: "LOGIN", user: response.user })

      history.push("/");

    } catch (error) {
      setErrorMsg(error);
    }
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          validationSchema={getLoginValidationSchema}
        >
          {({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FormFields>
                <LogoWrapper>
                  <LogoImage src={Logoimage} alt="shopjes-admin" />
                </LogoWrapper>
                <FormTitle>Log in to admin</FormTitle>
                {errorMsg && <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>}
              </FormFields>

              <FormFields>
                <FormLabel>Username</FormLabel>
                <Field
                  type="email"
                  name="email"
                  component={MyInput}
                  placeholder="Enter your email"
                />
                {errors.email && touched.email && (
                  <Error>{errors.email}</Error>
                )}
              </FormFields>
              <FormFields>
                <FormLabel>Password</FormLabel>
                <Field
                  type="password"
                  name="password"
                  component={MyInput}
                  placeholder="Enter your password"
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <Button
                type="submit"
                disabled={isSubmitting}
                overrides={{
                  BaseButton: {
                    style: () => ({
                      width: '100%',
                      marginLeft: 'auto',
                      borderTopLeftRadius: '3px',
                      borderTopRightRadius: '3px',
                      borderBottomLeftRadius: '3px',
                      borderBottomRightRadius: '3px',
                    }),
                  },
                }}
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </FormWrapper>
    </Wrapper>
  );
};
