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
 LIST_WA_TRANSACTIONS: "/admin/transactions/list-wallet-account-transactions" // GET
};