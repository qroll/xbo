import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9000';

// TODO xz: pretty sure i can just ask for this URL from the server
const PUSHBULLET_CLIENT_ID =
  process.env.REACT_APP_PUSHBULLET_APP_CLIENT_ID ||
  '2TXDmPJN0tukzOqu19qvwNCju16SyMb7';
const PUSHBULLET_URL = `https://www.pushbullet.com/authorize?client_id=${PUSHBULLET_CLIENT_ID}&redirect_uri=${API_URL}/auth/connect/pushbullet/callback&response_type=code`;

let API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 5000
});

export const checkUserSession = () => {
  return dispatch => {
    dispatch({
      type: 'USER_CHECK_SESSION'
    });

    return API.get('/auth/user')
      .then(res => {
        if (res.status === 200) {
          dispatch({ type: 'USER_LOGGED_IN', user: res.data });
        } else {
          dispatch({ type: 'USER_LOGGED_OUT' });
        }
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: 'USER_LOGGED_OUT' });
      });
  };
};

export const login = form => {
  return dispatch => {
    return API.post('/auth/login', {
      ...form
    }).then(res => {
      if (res.data && res.data.error) {
        return {
          error: res.data.error
        };
      }
      if (res.status === 200) {
        dispatch({ type: 'USER_LOGGED_IN', user: res.data });
      }
      return {
        status: res.status
      };
    });
  };
};

export const logout = () => {
  return dispatch => {
    return API.get('/auth/logout').then(res => {
      dispatch({ type: 'USER_LOGGED_OUT' });
    });
  };
};

export const signup = form => {
  return dispatch => {
    return API.post('/auth/signup', {
      ...form
    }).then(res => {
      if (res.data && res.data.error) {
        return {
          error: res.data.error
        };
      }
      if (res.status === 200) {
        dispatch({ type: 'USER_LOGGED_IN' });
      }
      return {
        status: res.status
      };
    });
  };
};

export const connectPushbulletProvider = () => {
  return dispatch => {
    return (window.location.href = PUSHBULLET_URL);
  };
};
