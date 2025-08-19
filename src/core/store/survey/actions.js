const setUserSurvey = function ({ commit }) {
  commit('SET_PK_SURVEY');
};

const shownUserSurveyCounter = function ({ commit }) {
  commit('SHOWN_PK_SURVEY_COUNTER');
};

export default {
  setUserSurvey,
  shownUserSurveyCounter
};
