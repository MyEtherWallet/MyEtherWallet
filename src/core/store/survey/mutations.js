import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.survey)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.survey);
    if (savedStore.stateVersion === Configs.VERSION.survey) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_PK_SURVEY = function (state) {
  state.userSurveyShown = true;
};

const SHOWN_PK_SURVEY_COUNTER = function (state) {
  state.userSurveyShownCounter += 1;
};

export default {
  INIT_STORE,
  SET_PK_SURVEY,
  SHOWN_PK_SURVEY_COUNTER
};
