import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Button, Alert, Card, ListGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { compose } from "redux";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

import * as actions from "../actions";
import CustomInput from "./CustomInput";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  async onSubmit(formData) {
    console.log(formData);
    const res = await this.props.validateSignUp(formData);
    console.log(res);
    if (res) {
      await this.props.signUp(formData);
    }
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  async responseFacebook(response) {
    console.log(response);
    await this.props.oauthFacebook(response.accessToken);
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  async responseGoogle(response) {
    console.log(response);
    await this.props.oauthGoogle(response.accessToken);
    if (!this.props.errorMessage) {
      this.props.history.push("/");
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="row">
        <div className="col">
          <Card>
            <Card.Header>Create an account</Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset>
                  <Field
                    name="email"
                    type="email"
                    id="email"
                    label="Email address"
                    placeholder="Enter email"
                    // pattern="/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="password1"
                    type="password"
                    id="password1"
                    label="Password"
                    placeholder="Password"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                <fieldset>
                  <Field
                    name="password2"
                    type="password"
                    id="password2"
                    label="Confirm Password"
                    placeholder="Password"
                    required
                    component={CustomInput}
                  ></Field>
                </fieldset>
                {this.props.errorMessage ? (
                  <Alert variant="danger">{this.props.errorMessage} </Alert>
                ) : null}
                <Button variant="primary" type="submit">
                  Sign Up
                </Button>
              </form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <Card.Text>Already have an account?</Card.Text>
              <Button variant="link" href="/signin">
                Sign in
              </Button>
            </Card.Body>
          </Card>
        </div>
        <div className="col">
          <div className="text-center">
            <Card>
              <Card.Header>Or sign up using third-party services</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <FacebookLogin
                      appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                      // autoLoad={true}
                      fields="name,email,picture"
                      // onClick={componentClicked}
                      callback={this.responseFacebook}
                    />
                  </ListGroup.Item>
                  {/* &nbsp;&nbsp;&nbsp; */}
                  <ListGroup.Item>
                    <GoogleLogin
                      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                      // buttonText="Login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      // cookiePolicy={"single_host_origin"}
                    />
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
  };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: "signup" })
)(SignUp);
