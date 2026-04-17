import axios from 'axios';
import { config } from '../config';

const VAPI_BASE_URL = 'https://api.vapi.ai';

interface VapiMessage {
  type: string;
  role: string;
  content: string;
  timestamp?: number;
}

export const sendVapiResponse = async (
  callId: string,
  message: string
): Promise<void> => {
  try {
    // This would be called to send a message back to the Vapi call
    // In webhook mode, responses are typically queued for the agent
    console.log(`[Vapi Response] Call: ${callId}, Message: ${message.substring(0, 100)}...`);

    // Example: Send to Vapi's message endpoint
    // await axios.post(`${VAPI_BASE_URL}/call/${callId}/message`, {
    //   message: message,
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${config.VAPI_API_KEY}`,
    //   }
    // });
  } catch (error) {
    console.error('Failed to send Vapi response:', error);
    throw error;
  }
};

export interface VapiWebhookPayload {
  message: VapiMessage;
  call: {
    id: string;
    status: string;
    transcript?: string;
    duration?: number;
  };
  messages: VapiMessage[];
}

export const parseVapiWebhook = (payload: any): VapiWebhookPayload => {
  return {
    message: payload.message || {},
    call: payload.call || {},
    messages: payload.messages || [],
  };
};
