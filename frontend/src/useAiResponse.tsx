import { useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import axios from 'axios';

export const useAIResponse = () => {
  const { channel, client } = useChatContext();

  useEffect(() => {
    if (!channel) return;

    // Listen for new messages
    const handleNewMessage = async (event: { message: any }) => {
      const message = event.message;

      // Ignore messages from the AI itself
      if (message.user?.id === 'ai-bot') return;

      try {
        // Call your backend endpoint that triggers AI response
        await axios.post('/backend/start-ai-agent', {
          channelId: channel.id,
          message: message.text,
        });
      } catch (err) {
        console.error('AI response failed', err);
      }
    };

    const subscription = channel.on('message.new', (event: any) => {
      handleNewMessage(event);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [channel, client]);
};
