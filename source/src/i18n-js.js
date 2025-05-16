// i18n.js - 다국어 설정
const i18n = {
  // 다국어 설정 (간단 버전)
  translations: {
    ko: {
      common: {
        search: '검색',
        cancel: '취소',
        confirm: '확인',
        save: '저장'
      },
      trading: {
        buy: '매수',
        sell: '매도',
        price: '가격',
        amount: '수량',
        total: '총액',
        orderBook: '호가',
        trades: '체결',
        chart: '차트'
      }
    },
    en: {
      common: {
        search: 'Search',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save'
      },
      trading: {
        buy: 'Buy',
        sell: 'Sell',
        price: 'Price',
        amount: 'Amount',
        total: 'Total',
        orderBook: 'Order Book',
        trades: 'Trades',
        chart: 'Chart'
      }
    }
  },
  
  // 현재 언어
  currentLanguage: 'ko',
  
  // 번역 함수
  t(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key;
      }
    }
    
    return translation;
  },
  
  // 언어 변경
  changeLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
    }
  }
};

export default i18n;