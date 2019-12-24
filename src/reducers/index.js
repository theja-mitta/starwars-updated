import { combineReducers } from 'redux';

import { FETCH_PEOPLE } from '../actions';

const initialState = {
  people: []
}


const dataReducer = ( state = initialState, action ) => {
  switch (action.type) {
    case FETCH_PEOPLE: return {...state, people: action.payload};
    default: return state;
  };
};



const reducers = combineReducers({
  data: dataReducer
});


export default reducers;