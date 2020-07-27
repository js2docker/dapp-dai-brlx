import { put, call, select, take, all, takeLatest } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { generateDaiContract, consumerContractAddress, generateBrlxUsdContract, generateTokenBrlx } from '../../contracts/api/contracts';
import { REQUEST_ALLOW_TX, LOADING_TX, COMPLETE_TX, REQUEST_MINT_TOKENS_TX, REQUEST_UPDATE_ORACLE, PENDING_TX, ERROR_TX, REQUEST_WITHDRAWN_DAI,  REQUEST_ALLOW_WITHDRAWN } from './actions';

export function* tokenPaySaga() {
  yield all([
    takeLatest(REQUEST_ALLOW_TX, AllowSpendAmountToken),
    takeLatest(REQUEST_MINT_TOKENS_TX, MintBrlxTokensSaga),
    takeLatest(REQUEST_UPDATE_ORACLE, UpdateOracleSaga),
    takeLatest(REQUEST_WITHDRAWN_DAI, WithdrawnDai),
    takeLatest(REQUEST_ALLOW_WITHDRAWN, AllowSpentWithDrawnToken)
  ])
} 

function* AllowSpendAmountToken({ payload }){
  const {
    amount
  } = payload;

  try {
    yield put({ type: PENDING_TX})

    const DaiContract = yield call(generateDaiContract)
    const txData = yield call(DaiContract.methods.approve, consumerContractAddress, amount)
    const txAllowReceipt = yield call(TransactionSaga, txData)
    console.log(txAllowReceipt)
  } catch (err) {
    console.log(err)
    yield put({ type: ERROR_TX})
  }
}


function* AllowSpentWithDrawnToken({ payload }){
  const {
    amount
  } = payload;

  try {
    yield put({ type: PENDING_TX})
    console.log('amount saga ', amount)
    const BrlxUsdContract = yield call(generateTokenBrlx)
    const txData = yield call(BrlxUsdContract.methods.approve, consumerContractAddress, amount)
    const txAllowReceipt = yield call(TransactionSaga, txData)
    console.log(txAllowReceipt)
  } catch (err) {
    console.log(err)
    yield put({ type: ERROR_TX})
  }
}

function* UpdateOracleSaga({payload}) {
  try {
    yield put({ type: PENDING_TX})

    const BrlxUsdContract = yield call(generateBrlxUsdContract)
    const txData = yield call(BrlxUsdContract.methods.requestRealUsdPrice, "0xc99B3D447826532722E41bc36e644ba3479E4365", "3cff0a3524694ff8834bda9cf9c779a1")
    const txAllowReceipt = yield call(TransactionSaga, txData)
    console.log(txAllowReceipt)
  } catch (err) {
    console.log(err)
    yield put({ type: ERROR_TX})
  }
}

function* MintBrlxTokensSaga({payload}) {
  const {
    amount
  } = payload;

  try {
    console.log(amount, typeof amount)
    yield put({ type: PENDING_TX})

    const BrlxUsdContract = yield call(generateBrlxUsdContract)
    const txData = yield call(BrlxUsdContract.methods.mintBrlx, amount)
    const txAllowReceipt = yield call(TransactionSaga, txData)
    console.log(txAllowReceipt)
  } catch (err) {
    console.log(err)
    yield put({ type: ERROR_TX})
  }
}

function* WithdrawnDai({payload}) {
  const {
    vaultId
  } = payload;

  try {
    yield put({ type: PENDING_TX})

    const BrlxUsdContract = yield call(generateBrlxUsdContract)
    const txData = yield call(BrlxUsdContract.methods.withdrawnDai, vaultId)
    const txAllowReceipt = yield call(TransactionSaga, txData)
    console.log(txAllowReceipt)
  } catch (err) {
    console.log(err)
    yield put({ type: ERROR_TX})
  }
}







function* TransactionSaga(transactionData) {
  let userAddress
  let tx
  let channels
  try {
    userAddress = yield select(state => state.web3Account.accountAddress)
    tx = transactionData.send({ from: userAddress })

    channels = new eventChannel(emit => {
      tx.once('transactionHash', tx => {
        console.log(`TX_DEPLOY: ${tx}`)
        emit({
          tx,
          type: 'TX_DEPLOY',
        })
      })
      tx.once('receipt', receipt => {
        emit({
          receipt,
          type: 'TX_MINED',
        })
        console.log(receipt)
      })
      tx.on('error', error => {
        console.log(error)
        emit({
          error,
          type: 'TX_ERROR',
        })
      })
      return () => {}
    })

    while (true) {
      const chan = yield take(channels)
      if (chan.type === 'TX_DEPLOY') yield put({ type: LOADING_TX })
      if (chan.type === 'TX_MINED') {
        yield put({ type: COMPLETE_TX })
        return chan
      }
      if (chan.type === 'TX_ERROR') {
        throw chan.error
      }
    }
  } catch (err) {
    throw err
  }
}

export default tokenPaySaga;
