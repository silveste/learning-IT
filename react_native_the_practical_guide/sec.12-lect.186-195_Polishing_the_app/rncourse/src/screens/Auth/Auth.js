import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';

import DefaultInput from '../../components/UI/DefaultInput/DefaultInput';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import MainText from '../../components/UI/MainText/MainText';
import MainButton from '../../components/UI/MainButton/MainButton';

import backgroundImage from '../../assets/bg.jpg';
import validate from '../../utility/validation';
import { tryAuth, authAutoSignIn } from '../../store/actions';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    Dimensions.addEventListener('change', this.updateStyles);
  }

  state = {
    viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
    submitReady: false,
    authMode: 'login',
    controls: {
      email: {
        value: '',
        valid: true,
        validationRules: {
          isEmail: true
        }
      },
      password: {
        value: '',
        valid: true,
        // If other controls state depend on this control,
        // it should be included in validates property
        validates: ['confirmPassword'],
        validationRules: {
          minLength: 6
        }
      },
      // confirm password is null when login mode
      confirmPassword: null
    }
  };

  /*
  when the component is unmounted it's advisable to remove the event listener to avoid memory leaks
  as the event is not neccesary anymore
  */
  componentDidMount() {
    const { onAutoSignIn } = this.props;
    onAutoSignIn();
  }

  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.updateStyles);
  }

  switchAuthModeHandler = () => {
    this.setState((prevState) => {
      const newAuthMode = prevState.authMode === 'login' ? 'signup' : 'login';
      let confirmPassword: null;
      if (newAuthMode === 'signup') {
        confirmPassword = {
          value: '',
          valid: true,
          validationRules: {
            equalTo: 'password'
          }
        };
      }
      const newControls = {
        ...prevState.controls,
        confirmPassword
      };
      const submitReady = this.isReadyToSubmit(newControls);
      return {
        authMode: newAuthMode,
        submitReady,
        controls: {
          ...newControls
        }
      };
    });
  }

  updateStyles = (dims) => {
    this.setState({ viewMode: dims.window.height > 500 ? 'portrait' : 'landscape' });
  }

  authHandler = () => {
    const { controls, authMode } = this.state;
    const { onTryAuth } = this.props;
    // Check for Auth
    const authData = {
      email: controls.email.value,
      password: controls.password.value
    };
    onTryAuth(authData, authMode);
  }

  updateInputState = (key, value) => {
    const { controls } = this.state;
    // get the controls that must be updated
    // taking into account that if controls[key] has "validates" property
    // the controls included in validates must be updated as well
    let controlsNamesToUpdate = [key];
    if (controls[key].validates) {
      controlsNamesToUpdate = controlsNamesToUpdate.concat(controls[key].validates);
    }

    const controlsToUpdate = controlsNamesToUpdate.reduce((acc, val, index) => {
      // confirm password control might be null, if that is the case
      // return the acc and do nothing
      if (!controls[val]) {
        return acc;
      }

      // get the control[key]
      const control = { ...controls[val] };

      // get the validation validation rules
      const validationRules = { ...controls[val].validationRules };

      // equalTo rule points to other control
      // if controls[key] contains equalTo rule
      // equalTo is updated with the value to compare, required by validate()
      // which could be a new value if key === validationRules.equalTo
      // or the value in the state
      if (validationRules.equalTo === key) {
        validationRules.equalTo = value;
      } else if (validationRules.equalTo) {
        validationRules.equalTo = controls[validationRules.equalTo].value;
      }

      // Update the value only for the fied[key] that called the fuction
      // which allways is the 1st key in controlsNamesToUpdate
      control.value = index === 0 ? value : control.value;

      return {
        ...acc,
        [val]: {
          ...control, // By including all prev values for the specific
          // key value doesn't need to include all key pairs of the specific key
          value: control.value,

          // If control is empty the invalid style is also removed
          valid: control.value === '' ? true : validate(control.value, validationRules)
        }
      };
    }, {});

    // Set new controls object
    const newControls = {
      ...controls,
      ...controlsToUpdate
    };

    // Check if submit button should be disable
    const submitReady = this.isReadyToSubmit(newControls);

    this.setState(prevState => ({
      ...prevState,
      controls: {
        ...newControls
      },
      submitReady
    }));
  }

  isReadyToSubmit = controlsToNewState => (
    // Filter to remove controls if they are null
    // return if all not null are valid
    Object.keys(controlsToNewState).filter(control => controlsToNewState[control])
      .every(control => controlsToNewState[control].valid && controlsToNewState[control].value !== '')
  );

  /* Debuggin purposes
  seeState = () => {
    const keys = Object.keys(this.state.controls);
    alert(`${keys[0]}, ${keys[1]}, ${keys[2]}`);
    keys.forEach(key => {
      const value = this.state.controls[key].value;
      const valid = this.state.controls[key].valid;
      alert(`${key}: ${value}, valid: ${valid}`);
    });
  } */

  render() {
    const {
      viewMode,
      authMode,
      controls,
      submitReady
    } = this.state;
    const {
      isLoading
    } = this.props;
    let headingText = null;
    let confirmPasswordControl = null;

    let submitButton = (
      <MainButton
        title="Submit"
        onPress={this.authHandler}
        style={styles.button}
        disabled={!submitReady}
      />
    );

    if (viewMode === 'portrait') {
      headingText = (
        <MainText>
          <HeadingText style={{ color: '#fff' }}>Please Log In</HeadingText>
        </MainText>
      );
    }
    if (authMode === 'signup') {
      confirmPasswordControl = (
        <DefaultInput
          placeholder="Confirm Password"
          style={[
            styles.input,
            viewMode === 'landscape'
              ? styles.inputColumn
              : null
          ]}
          value={controls.confirmPassword.value}
          onChangeText={val => this.updateInputState('confirmPassword', val)}
          invalid={!controls.confirmPassword.valid}
          secureTextEntry
        />
      );
    }
    if (isLoading) {
      submitButton = <ActivityIndicator />;
    }
    return (
      <ImageBackground source={backgroundImage} style={styles.bgImage}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
          {headingText}
          <MainButton
            title={authMode === 'login' ? 'Sign Up' : 'Login'}
            onPress={this.switchAuthModeHandler}
            style={styles.button}
          />
          {/*
          By using a container to style the width of the text inputs
          we can now make the textinput reusable accross the app as the width
          is adaptable depending on the container.
          */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inputContainer}>
              <DefaultInput
                placeholder="E-mail Address"
                style={styles.input}
                value={controls.email.value}
                onChangeText={val => this.updateInputState('email', val)}
                invalid={!controls.email.valid}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <View
                style={
                  viewMode === 'portrait'
                    ? styles.portraitPwdContainer
                    : styles.landscapePwdContainer
                }
              >
                <DefaultInput
                  placeholder="Password"
                  style={[
                    styles.input,
                    viewMode === 'landscape' && authMode === 'signup'
                      ? styles.inputColumn
                      : null
                  ]}
                  value={controls.password.value}
                  onChangeText={val => this.updateInputState('password', val)}
                  invalid={!controls.password.valid}
                  secureTextEntry
                />
                {confirmPasswordControl}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {submitButton}
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  bgImage: {
    width: '100%',
    flex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
    width: '80%',
    flexBasis: 'auto'
  },
  landscapePwdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portraitPwdContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  input: {
    backgroundColor: '#eee',
    borderColor: '#bbb',
    flexBasis: 'auto'
  },
  inputColumn: {
    maxWidth: '49%'
  },
  button: {
    flexBasis: 'auto'
  }
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading
});

const mapDispatchToProps = dispatch => ({
  onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
  onAutoSignIn: () => dispatch(authAutoSignIn())
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
