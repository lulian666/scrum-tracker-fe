import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ScrumboardAppConfig from '../main/apps/scrumboard/ScrumboardAppConfig';

const routeConfigs = [
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  ScrumboardAppConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: '/',
    element: <Navigate to="/apps/scrumboard" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
    auth: settingsConfig.defaultAuth,
  },
];

export default routes;
