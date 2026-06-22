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
          aiText = `Sure! I am monitoring standard travel metrics for your current query. Let me know if you would like custom guide lists, weather charts, or local food reviews!`;
        }

        const aiMsg = {
          sender: 'ai',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        await api.addMessage(aiMsg);
        await fetchMessages();
      }, 1200);

    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const handleClearChatHistory = async () => {
    try {
      await api.clearMessages();
      setMessages([]);
      Alert.alert('Chat Cleared', 'Simulated companion chat log has been cleared.');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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
              <Text style={styles.chatEmptyTitle}>Conversational Intellect</Text>
              <Text style={styles.chatEmptyDesc}>
                Ask me about crowd timing at Hawa Mahal, local regulatory guidelines, or book local guides directly.
              </Text>
            </View>
          ) : (
            messages.map((msg, i) => (
              <View 
                key={msg.id || i} 
                style={[
                  styles.chatMsgBox, 
                  msg.sender === 'user' ? styles.chatMsgUser : styles.chatMsgAI
                ]}
              >
                <Text style={styles.chatMsgText}>{msg.text}</Text>
                <Text style={styles.chatMsgTime}>{msg.time}</Text>
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.chatInputRow}>
          <TextInput 
            style={styles.chatInputField}
            placeholder="Ask travel companion..."
            placeholderTextColor="#64748b"
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
    backgroundColor: '#0f172a',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  chatEmptyDesc: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  chatMsgBox: {
    maxWidth: '80%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  chatMsgUser: {
    backgroundColor: '#2563eb',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  chatMsgAI: {
    backgroundColor: '#1e293b',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chatMsgText: {
    color: '#ffffff',
    fontSize: 13,
    lineHeight: 18,
  },
  chatMsgTime: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#0f172a',
  },
  chatInputField: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  chatSendBtn: {
    backgroundColor: '#2563eb',
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
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chatClearBtnText: {
    fontSize: 12,
  },
});
