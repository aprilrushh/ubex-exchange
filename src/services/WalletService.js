// src/services/WalletService.js
const API_BASE_URL = 'http://localhost:3030/api/wallet'; // 백엔드 API 주소 (포트 3030)

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
  }
  return { 'Content-Type': 'application/json' };
};

/**
 * 지정된 코인의 입금 주소를 조회합니다.
 * @param {string} coinSymbol - 조회할 코인의 심볼 (예: "BTC", "ETH")
 * @returns {Promise<object>} API 응답 데이터
 */
export const getDepositAddress = async (coinSymbol) => {
  console.log(`[WalletService] getDepositAddress 호출: ${coinSymbol}`);
  try {
    const response = await fetch(`${API_BASE_URL}/deposit-address/${coinSymbol}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `API 통신 오류: ${response.status}` }));
      throw new Error(errorData.message || `입금 주소 조회 API 오류: ${response.status}`);
    }
    return response.json(); // 성공 시 { success: true, data: { coin, address } } 형태 기대
  } catch (error) {
    console.error(`[WalletService] ${coinSymbol} 입금 주소 조회 실패:`, error);
    throw error;
  }
};

/**
 * 출금 요청을 서버에 전송합니다.
 * @param {object} withdrawalData - 출금 정보 ({ coin, amount, address, otpCode? })
 * @returns {Promise<object>} API 응답 데이터
 */
export const requestWithdrawal = async (withdrawalData) => {
  console.log('[WalletService] requestWithdrawal 호출, 데이터:', withdrawalData);
  try {
    const response = await fetch(`${API_BASE_URL}/withdraw`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(withdrawalData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `API 통신 오류: ${response.status}` }));
      throw new Error(errorData.message || `출금 요청 API 오류: ${response.status}`);
    }
    return response.json(); // 성공 시 { success: true, message, data: withdrawalRequest } 형태 기대
  } catch (error) {
    console.error('[WalletService] 출금 요청 실패:', error);
    throw error;
  }
};

/**
 * 현재 사용자의 모든 코인 잔액을 조회합니다.
 * @returns {Promise<object>} API 응답 데이터
 */
export const getUserBalances = async () => {
  console.log('[WalletService] getUserBalances 호출');
  try {
    const response = await fetch(`${API_BASE_URL}/balances`, { // 백엔드 라우트에 /balances 추가 필요
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `API 통신 오류: ${response.status}` }));
      throw new Error(errorData.message || `잔액 조회 API 오류: ${response.status}`);
    }
    return response.json(); // 성공 시 { success: true, data: { BTC: "0.1", ETH: "2", ... } } 형태 기대
  } catch (error) {
    console.error('[WalletService] 전체 잔액 조회 실패:', error);
    throw error;
  }
};

// 입금 내역 조회 (추후 구현)
export const getDeposits = async () => {
  console.log('[WalletService] getDeposits 호출');
  // const response = await fetch(`${API_BASE_URL}/deposits`, { headers: getAuthHeaders() });
  // ...
  return Promise.resolve({ success: true, data: { deposits: [], pagination: {} } }); // 임시
};

// 출금 내역 조회 (추후 구현)
export const getWithdrawals = async () => {
  console.log('[WalletService] getWithdrawals 호출');
  // const response = await fetch(`${API_BASE_URL}/withdrawals`, { headers: getAuthHeaders() });
  // ...
  return Promise.resolve({ success: true, data: { withdrawals: [], pagination: {} } }); // 임시
};
