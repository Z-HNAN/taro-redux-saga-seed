import { put, delay, takeEvery} from 'redux-saga/effects'

function* asyncAddRequest (action) {
  const { timeout } = action.payload
  yield delay(timeout)
  yield put({ type: 'ADD' })
}

export default function* () {
  yield takeEvery('ASYNC_ADD', asyncAddRequest)
}
