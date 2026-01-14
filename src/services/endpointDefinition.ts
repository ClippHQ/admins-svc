
export const API_ENDPOINTS = {
  LOGIN: "/admin/login",
  ALL_ADMIN: "/admin/get-admin-accounts",
  ADD_ADMIN_ACCOUNT: "/admin/add-admin-account",
  ALL_DEPOSITS: "/admin/deposit/get-all-deposits",
  ALL_PAYOUTS: "/admin/payout/get-all-payouts",
  USERS: "/users",
  APPLICATIONS: "/applications",
  DEPOSITS: "/deposits",
DEPOSIT_DETAILS: "/admin/deposit/get-deposit-details",  // GET /admin/deposit/get-deposit-details/<string:deposit_id>,
 CONFIRM_REJECT_DEPOSIT_MTN: '/admin/deposit/confirm-reject', // POST /admin/deposit/confirm-reject/<string:deposit_id>
 LIST_WA_TRANSACTIONS: "/admin/transactions/list-wallet-account-transactions", // GET,
 FETCH_USER_PROFILES: "/admin/actions/fetch-user-profiles", // GET

 FETCH_USER_PROFILE: "/admin/actions/fetch-user-profile", // GET /<string:user_id></string:user_id>
 FETCH_USER_PROFILE_BY_EMAIL: "/admin/actions/fetch-user-profile-by-email", // GET /<string:email>
 DEACTIVATE_USER_ACCOUNT: "/admin/actions/deactivate-user-account", // POST /<string:user_id>
  ACTIVATE_USER_ACCOUNT: "/admin/actions/activate-user-account", // POST /<string:user_id>
  ADD_REMOVE_PAYOUT_LIEN: "/admin/actions/add-remove-payout-lien", // POST /admin/actions/add-remove-payout-lien/<string:wallet_account_id>"
  FETCH_WALLET_ACCOUNTS: "/admin/actions/fetch-wallet-ccounts", // GET /<string:wallet_id>
  FETCH_KYC_DOCUMENTS: "/admin/actions/fetch_kyc_documents", // GET /<string:user_id>
  FETCH_VIRTUAL_ACCOUNTS: "/admin/fetch-virtual-accounts", // GET /<string:wallet_id>

};