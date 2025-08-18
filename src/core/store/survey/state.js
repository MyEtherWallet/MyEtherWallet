import Configs from '../configs';

const state = {
  localStore: true,
  stateVersion: Configs.VERSION.survey,
  userSurveyShown: false,
  userSurveyShownCounter: 0
};

export default state;
