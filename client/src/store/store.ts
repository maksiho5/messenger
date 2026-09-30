import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import authReducer from './reducers/authReducer';
import authSaga from './sagas/authSaga';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(authReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(authSaga);

export default store;

export type RootState = ReturnType<typeof authReducer>;
