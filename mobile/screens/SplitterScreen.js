import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';

export default function SplitterScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expCategory, setExpCategory] = useState('Food');
  const [expPaidBy, setExpPaidBy] = useState('Arjun');

  const fetchExpenses = async () => {
    try {
      const expRes = await api.getExpenses();
      if (expRes.success) {
        setExpenses(expRes.data.expenses || []);
      }
    } catch (e) {
      console.warn('Error fetching expenses:', e.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (!expDesc.trim() || !expAmount.trim()) {
      Alert.alert('Validation Alert', 'Please enter a description and amount.');
      return;
    }
    const amountNum = parseFloat(expAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Validation Alert', 'Please enter a valid positive number for amount.');
      return;
    }

    const newExpense = {
      id: `expense-${Date.now()}`,
      description: expDesc.trim(),
      amount: amountNum,
      category: expCategory,
      paidBy: expPaidBy,
      splitWith: ['Arjun', 'Priya', 'Sanya', 'Rahul'],
      date: new Date().toISOString().split('T')[0]
    };

    try {
      setLoading(true);
      await api.addExpense(newExpense);
      await fetchExpenses();
      setExpDesc('');
      setExpAmount('');
      Alert.alert('Expense Added', `Split recorded: "${newExpense.description}" for ₹${newExpense.amount}`);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      setLoading(true);
      await api.deleteExpense(id);
      await fetchExpenses();
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearExpenses = async () => {
    try {
      setLoading(true);
      await api.clearExpenses();
      setExpenses([]);
      Alert.alert('Expenses Cleared', 'All split-bill records have been wiped.');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && expenses.length === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </SafeAreaView>
    );
  }

  const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.budgetOverview}>
          <Text style={styles.budgetTitle}>Group Travel Ledger</Text>
          <Text style={styles.budgetAmount}>₹{totalExpenses.toLocaleString()}</Text>
          <Text style={styles.budgetDesc}>Splitting equally with Arjun, Priya, Sanya, and Rahul</Text>
          {expenses.length > 0 && (
            <TouchableOpacity style={styles.clearLedgerBtn} onPress={handleClearExpenses}>
              <Text style={styles.clearLedgerBtnText}>Wipe Split Ledger</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Split Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Record Transaction</Text>
          
          <TextInput 
            style={styles.formInput}
            placeholder="Expense Description (e.g. Dinner at Lassiwala)"
            placeholderTextColor="#64748b"
            value={expDesc}
            onChangeText={setExpDesc}
          />

          <TextInput 
            style={styles.formInput}
            placeholder="Amount (₹)"
            placeholderTextColor="#64748b"
            keyboardType="numeric"
            value={expAmount}
            onChangeText={txt => setExpAmount(txt.replace(/[^0-9.]/g, ''))}
          />

          <View style={styles.selectRow}>
            <Text style={styles.selectLabel}>Category:</Text>
            {['Food', 'Stay', 'Transit', 'Activity'].map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={[styles.selectBtn, expCategory === cat ? styles.selectBtnActive : {}]}
                onPress={() => setExpCategory(cat)}
              >
                <Text style={[styles.selectBtnText, expCategory === cat ? styles.selectBtnTextActive : {}]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.selectRow}>
            <Text style={styles.selectLabel}>Paid By:</Text>
            {['Arjun', 'Priya', 'Rahul'].map((payee) => (
              <TouchableOpacity 
                key={payee} 
                style={[styles.selectBtn, expPaidBy === payee ? styles.selectBtnActive : {}]}
                onPress={() => setExpPaidBy(payee)}
              >
                <Text style={[styles.selectBtnText, expPaidBy === payee ? styles.selectBtnTextActive : {}]}>{payee}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleAddExpense}>
            <Text style={styles.submitBtnText}>Add to Split Bill</Text>
          </TouchableOpacity>
        </View>

        {/* Expenses List */}
        <Text style={styles.subTitle}>Transaction History</Text>
        {expenses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>💸 No transaction logs recorded yet</Text>
          </View>
        ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={styles.expenseLeft}>
                <Text style={styles.expenseName}>{expense.description}</Text>
                <Text style={styles.expenseMeta}>{expense.category} • Paid by {expense.paidBy} on {expense.date}</Text>
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseVal}>₹{expense.amount.toLocaleString()}</Text>
                <TouchableOpacity style={styles.delExpenseBtn} onPress={() => handleDeleteExpense(expense.id)}>
                  <Text style={styles.delExpenseText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  budgetOverview: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  budgetAmount: {
    color: '#10b981',
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  budgetDesc: {
    color: '#64748b',
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 12,
  },
  clearLedgerBtn: {
    borderColor: '#ef444480',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  clearLedgerBtnText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 6,
  },
  selectLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 6,
  },
  selectBtn: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  selectBtnActive: {
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    borderColor: '#2563eb',
  },
  selectBtnText: {
    color: '#64748b',
    fontSize: 10,
  },
  selectBtnTextActive: {
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.3)',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  expenseLeft: {
    flex: 1,
    marginRight: 10,
  },
  expenseName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expenseMeta: {
    color: '#64748b',
    fontSize: 9,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseVal: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: 'bold',
  },
  delExpenseBtn: {
    marginTop: 4,
  },
  delExpenseText: {
    color: '#ef4444',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
