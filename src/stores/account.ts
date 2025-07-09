import { defineStore } from 'pinia';

export interface LabelItem {
  text: string;
}

export interface Account {
  labels: LabelItem[];
  type: 'LDAP' | 'Local';
  login: string;
  password: string | null;
}

export const useCounterStore = defineStore('account', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount() {
      this.accounts.push({
        labels: [],
        type: 'Local',
        login: '',
        password: '',
      });
      
      this.saveToStorage();
    },
    deleteAccount(index: number) {
      this.accounts.splice(index, 1);
      this.saveToStorage();
    },
    updateAccount(index: number, data: Partial<Account>) {
      Object.assign(this.accounts[index], data);
      this.saveToStorage();
    },
    saveToStorage() {
      localStorage.setItem('account', JSON.stringify(this.accounts));
    },
    loadFromStorage() {
      const data = localStorage.getItem('account');

      if (data) {
        this.accounts = JSON.parse(data);
      }
    },
  },
});
