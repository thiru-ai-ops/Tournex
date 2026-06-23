import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  SafeAreaView
} from 'react-native';
import { api } from '../services/api';
import theme from '../theme';
import haptics from '../utils/haptics';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.getMessages();
      if (res.success) {
        setMessages(res.data.messages || []);
      }
    } catch (e) {
      console.warn('Error fetching messages:', e.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim()) return;
    haptics.selection();
    const text = chatInput.trim();
    setChatInput('');

    const userMsg = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      await api.addMessage(userMsg);
      await fetchMessages();

      setTimeout(async () => {
        let aiText = '';
        const lower = text.toLowerCase();

        if (lower.includes('hawa mahal') || lower.includes('crowd')) {
          aiText = "Based on our live tourist density index, Hawa Mahal gets highly congested after 11:30 AM. Sunrise is the absolute prime hour!\n\nPro-Tip: Enter via the rear street entrance rather than the main heavy marketplace arch for a shorter queue line of under 5 minutes.";
        } else if (lower.includes('jaipur') || lower.includes('palace') || lower.includes('fort')) {
          aiText = "Jaipur is stunning! I suggest visiting Amer Fort (glorious elephant walks and mirror work), and the ornate City Palace.\n\nLocal secrets tell that you should try Lassi at Lassiwala on M.I. Road—they serve it inside clay hand-baked kulladh cups since 1944. It is an amazing cultural treat!";
        } else if (lower.includes('varanasi') || lower.includes('aarti') || lower.includes('ghat')) {
          aiText = "Varanasi Ghats are deeply mystical. I suggest witnessing the evening Ganga Aarti at Dashashwamedh Ghat starting at 6:30 PM. Rent a rowboat for the best views!";
        } else if (lower.includes('guide')) {
          aiText = "We found 2 government-accredited local guides available tomorrow morning. They speak fluent English/Hindi and charge standard regulated rates of ₹800/hour. Let me know if you would like me to book one!";
        } else {
          aiText = `Sure! I am monitoring standard travel metrics for your query "${text}". Let me know if you would like custom guide lists, weather charts, or local food reviews!`;
        }

        const aiMsg = {
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        await api.addMessage(aiMsg);
        haptics.success();
        await fetchMessages();
      }, 1000);

    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    }
  };

  const handleClearChatHistory = async () => {
    haptics.selection();
    try {
      await api.clearMessages();
      setMessages([]);
      haptics.success();
      Alert.alert('Chat Cleared', 'Companion conversation history cleared successfully.');
    } catch (err) {
      haptics.error();
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Panel */}
      <View style={styles.chatHeader}>
        <Text style={styles.chatHeaderTitle}>AI Travel Companion</Text>
        <Text style={styles.chatHeaderSubtitle}>24/7 Conversational Intelligence Engine</Text>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView 
          ref={chatScrollRef}
          contentContainerStyle={styles.chatScroll} 
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.length === 0 ? (
            <View style={styles.chatEmpty}>
              <Text style={styles.chatEmptyIcon}>💬</Text>
              <Text style={styles.chatEmptyTitle}>How can I help you today?</Text>
              <Text style={styles.chatEmptyDesc}>
                Ask me about crowd timing at Hawa Mahal, local regulatory guidelines, or book local guides directly.
              </Text>
            </View>
          ) : (
            messages.map((msg, i) => {
              const isUser = msg.sender === 'user';
              return (
                <View 
                  key={msg.id || i} 
                  style={[
                    styles.chatMsgBox, 
                    isUser ? styles.chatMsgUser : styles.chatMsgAI
                  ]}
                >
                  <Text style={[styles.chatMsgText, isUser ? styles.chatMsgTextUser : styles.chatMsgTextAI]}>{msg.text}</Text>
                  <Text style={[styles.chatMsgTime, isUser ? styles.chatMsgTimeUser : styles.chatMsgTimeAI]}>{msg.time}</Text>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={styles.chatInputRow}>
          <TextInput 
            style={styles.chatInputField}
            placeholder="Ask travel companion..."
            placeholderTextColor={theme.colors.textLight}
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={handleSendChatMessage}
          />
          <TouchableOpacity style={styles.chatSendBtn} onPress={handleSendChatMessage}>
            <Text style={styles.chatSendBtnText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatClearBtn} onPress={handleClearChatHistory}>
            <Text style={styles.chatClearBtnText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  chatHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  chatHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  chatHeaderSubtitle: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  chatScroll: {
    padding: 16,
    paddingBottom: 24,
  },
  chatEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 30,
  },
  chatEmptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  chatEmptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chatEmptyDesc: {
    color: theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  chatMsgBox: {
    maxWidth: '80%',
    borderRadius: theme.radius.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  chatMsgUser: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
    ...theme.shadows.small,
  },
  chatMsgAI: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },
  chatMsgText: {
    fontSize: 13,
    lineHeight: 18,
  },
  chatMsgTextUser: {
    color: '#ffffff',
  },
  chatMsgTextAI: {
    color: theme.colors.text,
  },
  chatMsgTime: {
    fontSize: 8,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatMsgTimeUser: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  chatMsgTimeAI: {
    color: theme.colors.textLight,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: '#ffffff',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.input,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: theme.colors.text,
    fontSize: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 8,
  },
  chatSendBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  chatSendBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatClearBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chatClearBtnText: {
    fontSize: 12,
  },
});
