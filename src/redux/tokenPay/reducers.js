import { LOADING_TX, COMPLETE_TX, PENDING_TX, ERROR_TX, RESET_STATE } from './actions';


const initialData =  {
  pendingTx: false,
  loadingTx: false,
  error: false,
  completeTx: false
}
export const transferReducer = (state = {...initialData}, { type, payload }) => {
    switch (type) {
      case LOADING_TX:
        return { ...initialData, loadingTx: true, pendingTx: true }
      case COMPLETE_TX:
        return { ...initialData, completeTx: true, loadingTx: true }
      case PENDING_TX:
        return { ...initialData, pendingTx: true, loadingTx: true }
      case ERROR_TX:
        return { ...initialData, error: true }
      case RESET_STATE:
        return { ...initialData }
      default:
        return state
    }
  }