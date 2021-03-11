import Configs from './configs';
import { createApolloClient } from '@/core/helpers/createApolloClient';

const aaveClient = createApolloClient(Configs.URL, Configs.SUBSCRIPTION_URL);

export default aaveClient;
