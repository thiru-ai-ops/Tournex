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
  RefreshControl,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';

export default function SplitterScreen() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const onRefresh = () => {
    haptics.selection();
    setRefreshing(true);
    fetchExpenses();
  };

  const handleAddExpense = async () => {
    haptics.selection();
    if (!expDesc.trim() || !expAmount.trim()) {
      haptics.error();
      Alert.alert('Validation Alert', 'Please enter a description and amount.');
      return;
    }
    const amountNum = parseFloat(expAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      haptics.error();
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
      haptics.success();
      await fetchExpenses();
      setExpDesc('');
      setExpAmount('');
      Alert.alert('Expense Added', `Split recorded: "${newExpense.description}" for ₹${newExpense.amount}`);
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    haptics.selection();
    try {
      setLoading(true);
      await api.deleteExpense(id);
      haptics.success();
      await fetchExpenses();
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearExpenses = async () => {
    haptics.selection();
    try {
      setLoading(true);
      await api.clearExpenses();
      haptics.success();
      setExpenses([]);
      Alert.alert('Expenses Cleared', 'All split-bill records have been wiped.');
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Panel */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Splitter Ledger</Text>
        <Text style={styles.pageSubtitle}>Regulate and split group travel expenses</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollBody} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
        }
      >
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

        {/* Record Transaction Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Record Transaction</Text>
          
          <TextInput 
            style={styles.formInput}
            placeholder="Expense Description (e.g. Dinner at Lassiwala)"
            placeholderTextColor={theme.colors.textLight}
            value={expDesc}
            onChangeText={setExpDesc}
          />

          <TextInput 
            style={styles.formInput}
            placeholder="Amount (₹)"
            placeholderTextColor={theme.colors.textLight}
            keyboardType="numeric"
            value={expAmount}
            onChangeText={txt => setExpAmount(txt.replace(/[^0-9.]/g, ''))}
          />

          <View style={styles.selectRow}>
            <Text style={styles.selectLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectScroll}>
              {['Food', 'Stay', 'Transit', 'Activity'].map((cat) => (
                <TouchableOpacity 
                  key={cat} 
                  style={[styles.selectBtn, expCategory === cat ? styles.selectBtnActive : {}]}
                  onPress={() => { haptics.selection(); setExpCategory(cat); }}
                >
                  <Text style={[styles.selectBtnText, expCategory === cat ? styles.selectBtnTextActive : {}]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.selectRow}>
            <Text style={styles.selectLabel}>Paid By:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectScroll}>
              {['Arjun', 'Priya', 'Rahul'].map((payee) => (
                <TouchableOpacity 
                  key={payee} 
                  style={[styles.selectBtn, expPaidBy === payee ? styles.selectBtnActive : {}]}
                  onPress={() => { haptics.selection(); setExpPaidBy(payee); }}
                >
                  <Text style={[styles.selectBtnText, expPaidBy === payee ? styles.selectBtnTextActive : {}]}>{payee}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
    backgroundColor: theme.colors.background,
  },
  pageHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  pageSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  budgetOverview: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    marginBottom: 16,
    ...theme.shadows.small,
  },
  budgetTitle: {
    color: theme.colors.textLight,
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  budgetAmount: {
    color: theme.colors.success,
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  budgetDesc: {
    color: theme.colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 12,
  },
  clearLedgerBtn: {
    borderColor: theme.colors.error,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  clearLedgerBtnText: {
    color: theme.colors.error,
    fontSize: 10,
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  formTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  formInput: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.input,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: theme.colors.text,
    fontSize: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 10,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectLabel: {
    color: theme.colors.textMuted,
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 8,
    width: 60,
  },
  selectScroll: {
    gap: 6,
  },
  selectBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  selectBtnActive: {
    backgroundColor: theme.colors.primaryLightest,
    borderColor: theme.colors.primary,
  },
  selectBtnText: {
    color: theme.colors.textMuted,
    fontSize: 10,
  },
  selectBtnTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.button,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  subTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  expenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: theme.radius.card,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  expenseLeft: {
    flex: 1,
    marginRight: 10,
  },
  expenseName: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: 'bold',
  },
  expenseMeta: {
    color: theme.colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  expenseRight: {
    alignItems: 'flex-end',
  },
  expenseVal: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: 'bold',
  },
  delExpenseBtn: {
    marginTop: 4,
  },
  delExpenseText: {
    color: theme.colors.error,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
