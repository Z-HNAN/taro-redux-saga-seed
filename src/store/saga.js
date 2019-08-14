import { all } from 'redux-saga/effects'

import indexSaga from '../pages/index/saga'

export default function* () {
  yield all([
    indexSaga()
  ])
}
